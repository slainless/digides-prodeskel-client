import { assert, is } from 'typia'
import type { ResponseCode, ResponsePacket, CommandPacket } from '../schema'
import type { WebSocketLike, WebsocketData } from './websocket'

export abstract class ProdeskelWebSocket {
  protected __isServerValid: boolean | null = null
  protected isServerReady: Promise<Error | true> | null = null
  protected __state: State = State.INITIAL

  protected __version: string | null = null
  protected __name: string | null = null

  protected abstract ws: WebSocketLike
  protected connectionTimeout: number = 10000

  protected init(): this {
    const that = this

    this.isServerReady = new Promise<Error | true>((res, rej) => {
      // this is not a valid server if it's failed on initial state
      const reject = () => rej(ErrorInvalidServer)

      this.ws.once('close', reject)
      this.ws.once('error', reject)

      // if connection success
      this.ws.once('open', () => {
        // then wait for identification response
        this.ws.on('message', function listener(e) {
          const data = JSON.parse(e.toString())
          if (!is<ResponsePacket.Identity>(data)) return

          that.__name = data.name
          that.__version = data.version
          that.setState(State.CONNECTED)
          that.__isServerValid = true
          res(true)
          that.ws.off('message', listener)
          that.ws.emit(getEventName('ready'))
        })

        // send the command
        this.ws.send(JSON.stringify({
          command: "identify_yourself"
        } satisfies CommandPacket.Generic<'identify_yourself'>))
      })

      setTimeout(() => rej(ErrorTimeout), this.connectionTimeout)
    }).catch(e => {
      this.__isServerValid = false
      this.setState(State.ERROR)
      return e
    })

    // event generator for event: `prodeskel:${string}`
    this.ws.on('message', (e) => {
      try {
        const data = JSON.parse(e.toString())
        if (!is<ResponsePacket>(data)) return

        this.ws.emit(getEventName('message'), data)
        let eventName = ''
        for (const eventNamePart of data.response.split(":")) {
          eventName += eventNamePart
          this.ws.emit(getEventName(eventName as any), data)
        }
      } catch (e) {

      }
    })

    this.ws.on("error", () => {
      this.setState(State.ERROR)
    })

    this.ws.on("close", () => {
      this.setState(State.CLOSED)
    })

    // ==========================================

    // these event handlers are safe to be listened 
    // to pre-logged in since it can only be caught 
    // when user logged in...

    this.on("sync_status", (packet) => {
      switch (packet.response) {
        case 'sync_status:finished':
        case 'sync_status:stopped':
        case 'sync_status:no_running_task':
          this.setState(State.IDLE)
          break
        case 'sync_status:already_running':
        case 'sync_status:started':
          this.setState(State.SYNCING)
          break
        default:
          return
      }
    })

    this.on("sync_task", (packet) => {
      this.setState(State.SYNCING)
    })

    return this
  }

  get state(): State {
    return this.__state
  }

  protected setState(state: State): this {
    if (this.__state !== state)
      this.ws.emit(getEventName("state_change"), state)
    this.__state = state
    return this
  }

  get name(): string | null {
    return this.__name
  }

  get version(): string | null {
    return this.__version
  }

  get isServerValid(): boolean | null {
    return this.__isServerValid
  }

  protected async assertServerReady(): Promise<void> {
    if (this.isServerReady == null) throw new TypeError("Implementation error: not initialized yet")
    const status = await this.isServerReady
    if (status instanceof Error) throw status
  }

  protected assertServerNotError(): this {
    if (this.__state === State.ERROR) throw ErrorConnectionClosed
    return this
  }

  protected assertServerLoggedIn(): this {
    if (this.__state === State.CONNECTED || this.__state === State.INITIAL) throw ErrorNotAuthenticated
    return this
  }

  /**
   * Helper method to wait until the connection is ready.
   * This method will also assert that the connection is valid.
   */
  async ready(): Promise<void> {
    await this.assertServerReady()
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
  async login(username: string, password: string, schema: string): Promise<boolean> {
    const packet = assert<CommandPacket.Auth>({
      command: 'auth',
      username,
      password,
      schema,
    } satisfies CommandPacket.Auth)

    await this.assertServerReady()
    this.assertServerNotError()

    const that = this
    return new Promise<boolean>((res, rej) => {
      this.once('auth', (packet) => {
        const isLoggedIn = packet.response == 'auth:ok'
        if (isLoggedIn) that.setState(State.IDLE)
        res(isLoggedIn)
      })

      this.ws.send(JSON.stringify(packet))

      setTimeout(() => rej(ErrorTimeout), this.connectionTimeout)
    }).catch((e: Error) => {
      if (e === ErrorTimeout) throw e
      this.setState(State.ERROR)
      this.ws.close()
      throw e
    })
  }

  /**
   * Event handler helper to create listener for prodeskel packets.
   * Internally, will just attach listener to the `prodeskel:${string}` event.
   */
  on<Code extends UnprefixedEventName>(code: Code, listener: (packet: PacketStartsWith<Code>) => void): this
  on(listener: (packet: ResponsePacket) => void): this
  on(...args: any[]): this {
    const { code, listener } = ProdeskelWebSocket.getListener(args)
    this.ws.on(code, listener)
    return this
  }

  /**
   * Remove response handler. Internally, just an alias to `this.off(getEventName(code), listener)`.
   */
  off<Code extends UnprefixedEventName>(code: Code, listener: (...args: any[]) => void): this {
    this.ws.off(getEventName(code), listener)
    return this
  }

  /**
   * Event handler helper to create listener for prodeskel packets.
   * Internally, will just attach listener to the `prodeskel:${string}` event.
   */
  once<Code extends UnprefixedEventName>(code: Code, listener: (packet: PacketStartsWith<Code>) => void): this
  once(listener: (packet: ResponsePacket) => void): this
  once(...args: any[]): this {
    const { code, listener } = ProdeskelWebSocket.getListener(args)
    this.ws.once(code, listener)
    return this
  }

  async start(): Promise<boolean> {
    await this.assertServerReady()
    this.assertServerNotError()
    this.assertServerLoggedIn()

    const that = this
    return new Promise<boolean>((res, rej) => {
      if (this.__state === State.SYNCING) return res(true)

      this.on('sync_status', function listener(packet) {
        switch (packet.response) {
          case 'sync_status:already_running':
          case 'sync_status:started':
            break
          default:
            return
        }

        that.off('sync_status', listener)
        // that.setState(State.SYNCING)
        res(true)
      })

      // const onStop = () => {
      //   if (this.__state == State.SYNCING)
      //     this.setState(State.IDLE)
      // }
      // this.once('sync_status:finished', onStop)
      // this.once('sync_status:stopped', onStop)

      this.ws.send(JSON.stringify({
        command: 'start'
      } satisfies CommandPacket.Generic<'start'>))

      setTimeout(() => rej(ErrorTimeout), this.connectionTimeout)
    })
  }

  async stop(): Promise<boolean> {
    await this.assertServerReady()
    this.assertServerNotError()
    this.assertServerLoggedIn()

    const that = this
    return new Promise((res, rej) => {
      if (this.__state === State.IDLE) return res(true)

      this.on('sync_status', function listener(packet) {
        switch (packet.response) {
          case 'sync_status:no_running_task':
          case 'sync_status:finished':
          case 'sync_status:stopped':
            break
          default:
            return
        }

        that.off('sync_status', listener)
        // that.setState(State.IDLE)
        res(true)
      })

      this.ws.send(JSON.stringify({
        command: 'stop'
      } satisfies CommandPacket.Generic<'stop'>))

      setTimeout(() => rej(ErrorTimeout), this.connectionTimeout)
    })
  }

  private static getListener(args: any[]): { code: EventName, listener: (...args: any[]) => void } {
    if (typeof args[0] == 'string') {
      const code = assert<UnprefixedEventName>(args[0])
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

  get connection(): typeof this.ws {
    return this.ws
  }
}

export enum State {
  INITIAL,
  CONNECTED,
  IDLE,
  SYNCING,
  ERROR,
  CLOSED
}

export const EventNamePrefix: string = 'prodeskel'
type UnprefixedEventName = Explode<ResponseCode> | ResponseCode | 'ready' | 'message' | 'state_change'
export type EventName = `${typeof EventNamePrefix}:${UnprefixedEventName}`

type Explode<T extends string, Acc extends string = ''> =
  T extends `${infer L}:${infer R}` ? `${Acc}${L}` | Explode<R, `${Acc}${L}:`> : never
type PacketStartsWith<C extends UnprefixedEventName> =
  C extends 'message' ?
  ResponsePacket :
  C extends 'state_change' ?
  State :
  Extract<ResponsePacket, { response: Extract<ResponseCode, C | `${C}:${string}`> }>

export const getEventName = <T extends UnprefixedEventName>(name: T): `${typeof EventNamePrefix}:${T}` => `${EventNamePrefix}:${name}`

export const ErrorInvalidServer: Error = new TypeError("Server is not a valid DIGIDES Prodeskel server")
export const ErrorConnectionClosed: Error = new TypeError("Connection is closed")
export const ErrorNotAuthenticated: Error = new TypeError("Server not authenticated yet")
export const ErrorTimeout: Error = new TypeError("Connection timed out")

export type { CommandPacket, ResponseCode, ResponsePacket, WebSocketLike, WebsocketData }