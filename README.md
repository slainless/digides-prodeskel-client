# digides-prodeskel-ws

Basic WebSocket client implementations for DIGIDES Prodeskel Service.

This package should provide browser-compliant client (extending browser's WebSocket)
and to-be-added later, advanced client for server-side usage.

## Features

This package is basically just an extension to base `WebSocket` class, with
some added methods to allow easier integration:

- `ready()`: Throws error in case of invalid prodeskel server, closed, or error on initialization.
  Internally, server will do an initialization and custom handshake. This method can be used to track whether
  the server has completed this process. Manual event handling can also be used to subscribe to this internal
  process, using `ws.on(getEventName('ready'), () => {})`.
- `login()`: Provides easy in-connection authentication.
  This method will call `ready()` internally so it's safe to be called directly without invoking `ready()`.
- `on()`, `once()`, `off()`: Provides event listener handling shortcut for the underneath websocket.
- `start()`: Start synchronization process. Will return true without network call if already synchronizing
  or when server responds with `sync_status:already_running|started`.
- `stop()`: Stop synchronization process. Will return false without network call if idle
  or when server responds with `sync_status:stopped|finished|no_running_task`.

## Usage

For now, this package provides implementation for browser usage,
which can be imported from `digides-prodeskel-ws/browser`.

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

  ws.on('sync_task', (packet) => {
    updateProgress(packet)
  })

  ws.on('sync_status', (packet) => {
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

## Underlying connection

Underlying connection is intentionally exposed, to allow manual control over it in case more advanced
usage is needed, for example, manual event handling. The connection should be accessible from
`ProdeskelWebSocket.connection`.

Also, correct event code can be acquired from `getEventName`, exported by `./core` or by each platform specific
module.

```ts
import { getEventName, ProdeskelWebSocket } from 'digides-prodeskel-ws'

async function createClient(credential) {
  const ws = new ProdeskelWebSocket('wss://service.id/ws')
  await ws.login(credential.username, credential.password, credential.schema)

  // Connection at the very least should be returning WebSocketLike.
  ws.connection.on(getEventName('message'), (packet) => {
    console.log(packet)
  })
}
```

## Development

- Developed in Bun environment
- Data validation with `typia`.
