import { assert, is } from 'typia'
import type { ResponseCode, ResponsePacket } from '../schema/response'
import type { CommandPacket } from '../schema/command'

export class ProdeskelWebSocket extends WebSocket {
  #isServerValid: boolean | null = null
  #isServerReady: Promise<Error | true>
  #state = State.INITIAL

  #version: string | null = null
  #name: string | null = null

  constructor(url: string | URL, private connectionTimeout = 10000) {
    super(url)
    const that = this

    this.#isServerReady = new Promise<Error | true>((res, rej) => {
      // this is not a valid server if it's failed on initial state
      const reject = () => rej(ErrorInvalidServer)

      super.once('close', reject)
      super.once('error', reject)

      // if connection success
      super.once('open', () => {
        // then wait for identification response
        super.addEventListener('message', function listener(this, e) {
          const data = JSON.parse(e.data)
          if (!is<ResponsePacket.Identity>(data)) return

          that.#name = data.name
          that.#version = data.version
          that.#state = State.CONNECTED
          that.#isServerValid = true
          res(true)
          this.removeEventListener('message', listener)
        })

        // send the command
        super.send(JSON.stringify({ type: 'command', command: "identify:yourself" }))
      })

      setTimeout(() => rej(ErrorTimeout), connectionTimeout)
    }).catch(e => {
      this.#isServerValid = false
      this.#state = State.ERROR
      return e
    }).finally(() => {
      this.emit(getEventName('ready'))
    })

    // event generator for event: `prodeskel:${string}`
    super.addEventListener('message', (e) => {
      try {
        const data = JSON.parse(e.data)
        if (!is<ResponsePacket>(data)) return

        this.emit(getEventName('message'), data)
        let eventName = ''
        for (const eventNamePart of data.response.split(":")) {
          eventName += eventNamePart
          this.emit(getEventName(eventName as any), data)
        }
      } catch (e) {

      }
    })
  }

  get state() {
    return this.#state
  }

  get name() {
    return this.#name
  }

  get version() {
    return this.#version
  }

  get isServerValid() {
    return this.#isServerValid
  }

  async #assertServerReady() {
    const status = await this.#isServerReady
    if (status instanceof Error) throw status
  }

  #assertServerNotError() {
    if (this.#state === State.ERROR) throw ErrorConnectionClosed
  }

  #assertServerLoggedIn() {
    if (this.#state === State.CONNECTED || this.#state === State.INITIAL) throw ErrorNotAuthenticated
  }

  /**
   * Helper method to wait until the connection is ready.
   * This method will also assert that the connection is valid.
   */
  async ready() {
    await this.#assertServerReady()
    return
  }

  /**
   * Helper method to do login.
   * Can be fired immediately since it will assert connection readiness and
   * error internally.
   * 
   * Also, it's safe to be called after being authenticated, but
   * it must be noted that the client will actually send the payload
   * instead of returning cache result since the response from server
   * is not a simple cacheable boolean but a dynamic real-time data: 
   * 
   * Check `ResponsePacket.AuthOK`.
   * 
   * However, it should be guaranteed that the server will skip
   * authentication internally after the first successful login and
   * will simply respond with `ResponsePacket.AuthOK`.
   */
  async login(username: string, password: string, schema: string) {
    const packet = assert<CommandPacket.Auth>({
      command: 'auth',
      username,
      password,
      schema,
    } satisfies CommandPacket.Auth)

    await this.#assertServerReady()
    this.#assertServerNotError()

    const that = this
    return new Promise<boolean>((res, rej) => {
      if (this.#state != State.CONNECTED) return res(true)

      this.onceResponse('auth', (packet) => {
        const isLoggedIn = packet.response == 'auth:ok'
        if (isLoggedIn) that.#state = State.IDLE
        else that.#state = State.CONNECTED
        res(isLoggedIn)
      })

      super.send(JSON.stringify(packet))

      setTimeout(() => rej(ErrorTimeout), this.connectionTimeout)
    }).catch((e: Error) => {
      if (e === ErrorTimeout) return e
      this.#state = State.ERROR
      this.close()
      return e
    })
  }

  /**
   * Event handler helper to create listener for prodeskel packets.
   * Internally, will just attach listener to the `prodeskel:${string}` event.
   */
  onResponse<Code extends UnprefixedEventName>(code: Code, listener: (packet: PacketStartsWith<Code>) => void): void
  onResponse(listener: (packet: ResponsePacket) => void): void
  onResponse(...args: any[]) {
    const { code, listener } = ProdeskelWebSocket.#getListener(args)
    this.on(code, listener)
  }

  /**
   * Remove response handler. Internally, just an alias to `this.off(getEventName(code), listener)`.
   */
  offResponse<Code extends UnprefixedEventName>(code: Code, listener: (...args: any[]) => void): void {
    this.off(getEventName(code), listener)
  }

  /**
   * Event handler helper to create listener for prodeskel packets.
   * Internally, will just attach listener to the `prodeskel:${string}` event.
   */
  onceResponse<Code extends UnprefixedEventName>(code: Code, listener: (packet: PacketStartsWith<Code>) => void): void
  onceResponse(listener: (packet: ResponsePacket) => void): void
  onceResponse(...args: any[]) {
    const { code, listener } = ProdeskelWebSocket.#getListener(args)
    this.once(code, listener)
  }

  async start() {
    await this.#assertServerReady()
    this.#assertServerNotError()
    this.#assertServerLoggedIn()

    const that = this
    return new Promise((res, rej) => {
      if (this.#state === State.SYNCING) return res(true)

      this.onResponse('sync_status', function listener(packet) {
        switch (packet.response) {
          case 'sync_status:already_running':
          case 'sync_status:started':
            break
          default:
            return
        }

        that.offResponse('sync_status', listener)
        that.#state = State.SYNCING
        res(true)
      })

      const onStop = () => {
        this.#state = State.IDLE
      }
      this.onceResponse('sync_status:finished', onStop)
      this.onceResponse('sync_status:stopped', onStop)

      this.send(JSON.stringify({
        command: 'start'
      } satisfies CommandPacket.Generic<'start'>))

      setTimeout(() => rej(ErrorTimeout), this.connectionTimeout)
    })
  }

  async stop() {
    await this.#assertServerReady()
    this.#assertServerNotError()
    this.#assertServerLoggedIn()

    const that = this
    return new Promise((res, rej) => {
      if (this.#state === State.IDLE) return res(true)

      this.onResponse('sync_status', function listener(packet) {
        switch (packet.response) {
          case 'sync_status:no_running_task':
          case 'sync_status:finished':
          case 'sync_status:stopped':
            break
          default:
            return
        }

        that.offResponse('sync_status', listener)
        that.#state = State.IDLE
        res(true)
      })

      this.send(JSON.stringify({
        command: 'stop'
      } satisfies CommandPacket.Generic<'stop'>))

      setTimeout(() => rej(ErrorTimeout), this.connectionTimeout)
    })
  }

  static #getListener(args: any[]) {
    if (typeof args[0] == 'string') {
      const code = assert<ResponseCode>(args[0])
      const listener = args[1]
      if (listener == null) throw new TypeError("Missing listener argument")
      if (typeof listener != 'function') throw new TypeError("Invalid listener argument")

      return { code: getEventName(code), listener }
    } else if (typeof args[0] == 'function') {
      const listener = args[0]
      if (typeof listener != 'function') throw new TypeError("Invalid listener argument")

      return { code: getEventName('message'), listener }
    } else throw new TypeError("Invalid argument")
  }
}

export enum State {
  INITIAL,
  CONNECTED,
  IDLE,
  SYNCING,
  ERROR
}

export const EventNamePrefix = 'prodeskel'
type UnprefixedEventName = Explode<ResponseCode> | ResponseCode | 'ready' | 'message'
export type EventName = `${typeof EventNamePrefix}:${UnprefixedEventName}`

type Explode<T extends string, Acc extends string = ''> =
  T extends `${infer L}:${infer R}` ? `${Acc}${L}` | Explode<R, `${Acc}${L}:`> : never
type PacketStartsWith<C extends UnprefixedEventName> =
  C extends 'message' ?
  ResponsePacket :
  Extract<ResponsePacket, { response: Extract<ResponseCode, C | `${C}:${string}`> }>

export const getEventName = <T extends UnprefixedEventName>(name: T): `${typeof EventNamePrefix}:${T}` => `${EventNamePrefix}:${name}`

export const ErrorInvalidServer = new TypeError("Server is not a valid DIGIDES Prodeskel server")
export const ErrorConnectionClosed = new TypeError("Connection is closed")
export const ErrorNotAuthenticated = new TypeError("Server not authenticated yet")
export const ErrorTimeout = new TypeError("Connection timed out")
