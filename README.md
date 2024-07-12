# prodeskel-ws

[![JSR Scope](https://jsr.io/badges/@slainless)](https://jsr.io/@slainless/prodeskel-ws) [![JSR Scope](https://jsr.io/badges/@slainless/prodeskel-ws)](https://jsr.io/@slainless/prodeskel-ws)

Basic WebSocket client implementations for DIGIDES Prodeskel Service.

This package should provide browser-compliant client (extending browser's WebSocket)
and to-be-added later, advanced client for server-side usage.

This package is ESM-only.

IIFE package should be provided soon.

## Features

This package is basically just an extension to base `WebSocket` class, with
some added methods to allow easier integration:

- **`ready()`**: Throws error in case of invalid prodeskel server, closed, or error on initialization.
- **`login()`**: Provides easy in-connection authentication.
- **`on()`, `once()`, `off()`**: Provides event listener handling shortcut for the underneath websocket.
- **`start()`**: Start synchronization process.
- **`stop()`**: Stop synchronization process.
- Many events which can be tapped/listened into, such as `state_change`, `auth`, `sync_task`, etc. It's also possible to listen to derivative/specific event such `sync_task:sync` or `sync_task:sync:started`. [Full event list](./src/schema/response.ts).

## Note

Since the connections are synchronized with each other based on their schema, `start` and `stop` command are shared across
all the other connections with same schema. To put it simply, all connections with same schema are working on the same space and task.
One user can stop a running task and the other user will receive broadcast that the task has been stopped. Progress of the
task are also synchronized so each user with same schema should receive same progress broadcast packets.

The only commands that are locally scoped to connection are `identify_yourself` and (obviously) `auth`.

## Usage

For package installation, please refer to [JSR native imports](https://jsr.io/docs/native-imports) or [JSR npm compat](https://jsr.io/docs/npm-compatibility).

If you prefer to use it directly in browser (or Deno without using native imports), you can also import the project from `esm.sh`:

```ts
import {
  ProdeskelWebSocket,
  State,
} from 'https://esm.sh/jsr/@slainless/prodeskel-ws/browser'
```

For now, this package provides implementation for browser usage,
which can be imported from `@slainless/prodeskel-ws/browser`.

### Examples

A fully working demo, built on top of Carbon and Alpine is available at [slainless/digides-prodeskel-ws-client-demo](https://github.com/slainless/digides-prodeskel-ws-client-demo).

#### Client generation

```ts
import { ProdeskelWebSocket } from '@slainless/prodeskel-ws'

async function createClient() {
  const ws = new ProdeskelWebSocket('wss://service.id/ws')
  await ws.ready()
  return ws
}
```

#### Full usage

```ts
import { ProdeskelWebSocket } from '@slainless/prodeskel-ws'

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
import { getEventName, ProdeskelWebSocket } from '@slainless/prodeskel-ws'

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
