export type CommandCode = 'identify_yourself' | 'start' | 'stop' | 'auth'

export namespace CommandPacket {
  export type Generic<Code extends CommandCode> = {
    command: Code
  }

  export interface Auth extends Generic<'auth'> {
    username: string
    password: string
    schema: string
  }
}

export type CommandPacket =
  | CommandPacket.Generic<Exclude<CommandCode, 'auth'>>
  | CommandPacket.Auth
