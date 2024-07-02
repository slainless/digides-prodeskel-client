import { describe, test, it, beforeAll, afterEach, spyOn, mock } from 'bun:test'
import type { WebSocketLike } from '../../src/core/websocket'

function createMockWS() {
  const addEventListener = mock()
  const removeEventListener = mock()
  const dispatchEvent = mock()

  const on = mock()
  const off = mock()
  const once = mock()
  const send = mock()
  const close = mock()
  const emit = mock()

  return {
    constructor: mock().mockImplementation(() => {
      return {
        addEventListener,
        removeEventListener,
        dispatchEvent,
        on, off, once, send, close, emit
      } satisfies WebSocketLike
    }),
    addEventListener,
    removeEventListener,
    dispatchEvent
  }
}

describe("Prodeskel Web Socket abstract class", () => {
  describe("Init method", () => {
    it.todo("Should be protected")
    it.todo("Should mutate isServerReady")
    it.todo("Should attach permanent listener")

    describe("IsServerReady implementation", () => {
      it.todo("Should attach once listener to close, error, message")
      it.todo("Should reject on timeout")

      it.todo("Should reject on close event")
      it.todo("Should reject on error event")

      it.todo("Should update object state on rejection")

      describe("On open event", () => {
        it.todo("Should send identify yourself command")
        it.todo("Should attach message listener")
        it.todo("Should skip non-identity response")

        describe("On successful identification", () => {
          it.todo("Should update object state")
          it.todo("Should resolve IsServerReady")
          it.todo("Should remove message listener")
          it.todo("Should emit ready event")
        })
      })
    })

    describe("Message listener implementation", () => {
      it.todo("Should only accept response packet")
      it.todo("Should emit prodeskel:message event")
      it.todo("Should emit all event components of the packet")
    })
  })

  describe("isServerValid method", () => {
    it.todo("Should return null on its earliest state")
    it.todo("Should return false on wrong server")
    it.todo("Should return true on right server")
  })

  describe("ready method", () => {
    it.todo("Should throw TypeError if isServerReady is null")
    it.todo("Should throw error on failed init")
    it.todo("Should return void on successful init")
  })

  describe("login method", () => {
    it.todo("Should throw TypeGuard when supplied with invalid credentials")
    it.todo("Should do server readiness check")
    it.todo("Should do error check")
    it.todo("Should immediately return true when state == CONNECTED")

    it.todo("Should send auth command")
    it.todo("Should reject on timeout")
    it.todo("Should resolve to true when response is auth:ok")
    it.todo("Should resolve to false when response is auth:invalid")
    it.todo("Should reject on error, set state to error and close the connection")
  })

  describe("event listener method", () => {
    it.todo("Should call underlying on method")
    it.todo("Should call underlying off method")
    it.todo("Should call underlying once method")
  })

  describe("start method", () => {
    it.todo("Should call underlying on method")
    it.todo("Should call underlying off method")
    it.todo("Should call underlying once method")
  })
})