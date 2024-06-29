import type { tags } from 'typia'

export type CommandCode = 'identify_yourself' | 'start' | 'stop' | 'auth'

export namespace CommandPacket {
  export type Generic<Code extends CommandCode> = {
    command: Code
  }

  export interface Auth extends Generic<'auth'> {
    username: string & tags.MinLength<3>
    password: string & tags.MinLength<3>
    schema: string & tags.MinLength<3>
  }
}

export type CommandPacket =
  | CommandPacket.Generic<Exclude<CommandCode, 'auth'>>
  | CommandPacket.Auth