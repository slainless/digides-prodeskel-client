# digides-prodeskel-ws

Basic WebSocket client implementations for DIGIDES Prodeskel Service.

This package should provide browser-compliant client (extending browser's WebSocket)
and more advanced client for server-side usage (implementation to be extended: to be determined).

## Features

This package is basically just an extension to base `WebSocket` class, with
some added methods to allow easier integration:

- `ready()`: Throws error in case of invalid prodeskel server, closed, or error on initialization.
  Internally, server will do an initialization and custom handshake. This method can be used to track whether
  the server has completed this process. Manual event handling can also be used to subscribe to this internal
  process, using `ws.on(getEventName('ready'), () => {})`.
- `login()`: Provides easy in-connection authentication.
  This method will call `ready()` internally so it's safe to be called directly without invoking `ready()`.
- `onResponse()`, `onceResponse()`, `offResponse()`: Provides quick shortcut to `WebSocket.on|once|off`
  and fully typed for DIGIDES prodeskel communication.
- `start()`: Start synchronization process. Will return true without network call if already synchronizing
  or when server responds with `sync_status:already_running|started`.
- `stop()`: Stop synchronization process. Will return false without network call if idle
  or when server responds with `sync_status:stopped|finished|no_running_task`.

## Usage

The package should provide `WebSocket` implementation based on the environment being used.
It should export DOM's WebSocket when targeting browser, but should export
a more powerful WebSocket implementation when targeting server-side usage.

Usage examples:

### Client generation

```ts
import { ProdeskelWebSocket } from 'digides-prodeskel-ws'

async function createClient() {
  const ws = new ProdeskelWebSocket('wss://service.id/ws')
  await ws.ready()
  return ws
}
```

### Full usage

```ts
import { ProdeskelWebSocket } from 'digides-prodeskel-ws'

...

async function createClient(server, credential) {
  const ws = new ProdeskelWebSocket(server)
  await ws.login(credential.username, credential.password, credential.schema)

  ws.onResponse('sync_task', (packet) => {
    updateProgress(packet)
  })

  ws.onResponse('sync_status', (packet) => {
    updateStatus(packet)
  })

  return ws
}

...

let [ws, setWs] = useState()

return <div>
  <input onChange={(e) => {
    createClient(e.target.value, credential)
      .then(setWs)
  }}/>
  <button onClick={() => ws?.start()}>Start<button>
  <button onClick={() => ws?.stop()}>Stop<button>
  <div id="output"></div>
</div>
```

## Manual event handling

Event handling can also be done manually. Correct event code can be acquired from `getEventName`.
It should be noted however, that the native method is not fully typed for DIGIDES prodeskel communication
as compared to provided helper methods.

```ts
import { getEventName, ProdeskelWebSocket } from 'digides-prodeskel-ws'

async function createClient(credential) {
  const ws = new ProdeskelWebSocket('wss://service.id/ws')
  await ws.login(credential.username, credential.password, credential.schema)

  ws.on(getEventName('message'), (packet) => {
    console.log(packet)
  })
}
```

## Development

Developed in Bun environment and using `typia` for data validation.
