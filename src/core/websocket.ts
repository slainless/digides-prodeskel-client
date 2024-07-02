/// <reference types="node" />

export type WebsocketData = Buffer | ArrayBuffer | Uint8Array | string | Blob | ArrayBufferView
export interface WebSocketLike extends EventTarget {
  on(event: 'message', listener: (data: WebsocketData) => void): void
  on(event: 'close', listener: () => void): void
  on(event: 'error', listener: () => void): void
  on(event: 'open', listener: () => void): void
  on(event: string, listener: (data?: any) => void): void

  off(event: string, listener: (data?: any) => void): void

  once(event: 'message', listener: (data: WebsocketData) => void): void
  once(event: 'close', listener: () => void): void
  once(event: 'error', listener: () => void): void
  once(event: 'open', listener: () => void): void
  once(event: string, listener: (data?: any) => void): void

  send(data: WebsocketData): void
  close(): void

  emit(event: string, data?: any): void
}