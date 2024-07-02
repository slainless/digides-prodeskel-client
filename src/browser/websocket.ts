import type { ResponsePacket, WebSocketLike, WebsocketData } from '../core'

export class ResponseEvent extends Event {
  constructor(eventName: string, public readonly data?: ResponsePacket) {
    super(eventName)
  }
}

export class EventEmitterWebSocket extends WebSocket implements WebSocketLike {
  private listenerMap: Record<string, WeakMap<Function, any>> = {}

  constructor(url: string, procotols?: string | string[]) {
    super(url, procotols)
  }

  on(event: 'message', listener: (data: WebsocketData) => void): void
  on(event: 'close', listener: () => void): void
  on(event: 'error', listener: () => void): void
  on(event: 'open', listener: () => void): void
  on(event: string, listener: (data?: any) => void): void {
    if(this.listenerMap[event]?.has(listener)) return
    if(this.listenerMap[event] == null)
      this.listenerMap[event] = new WeakMap<Function, Function>()
    
    const listenerBridge = EventEmitterWebSocket.createListenerBridge(listener)
    this.listenerMap[event].set(listener, listenerBridge)
    super.addEventListener(event, listenerBridge)
  }

  off(event: string, listener: (data?: any) => void): void {
    if(this.listenerMap[event] == null) return
    const listenerBridge = this.listenerMap[event].get(listener)
    if(listenerBridge == null) return

    super.removeEventListener(event, listenerBridge)
    this.listenerMap[event].delete(listener)
  }

  once(event: 'message', listener: (data: WebsocketData) => void): void
  once(event: 'close', listener: () => void): void
  once(event: 'error', listener: () => void): void
  once(event: 'open', listener: () => void): void
  once(event: string, listener: (data?: any) => void): void {
    const listenerBridge = EventEmitterWebSocket.createListenerBridge(listener)
    super.addEventListener(event, listenerBridge, { once: true })
  }

  send(data: WebsocketData): void {
    super.send(data)
  }

  emit(event: string, data?: any): void {
    super.dispatchEvent(new ResponseEvent(event, data))
  }

  private static createListenerBridge(listener: Function) {
    return (data: Event | MessageEvent) => {
      if(data instanceof MessageEvent || data instanceof ResponseEvent) 
        listener(data.data)
      else listener()
    }
  }
}