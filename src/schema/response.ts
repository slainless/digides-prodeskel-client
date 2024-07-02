export type ResponseCode =
  | 'error'
  // identify response
  | 'identity'
  // auth response
  | 'auth:invalid'
  | 'auth:ok'
  // sync response
  | 'sync_status:started'
  | 'sync_status:already_running'
  | 'sync_status:stopped'
  | 'sync_status:finished'
  | 'sync_status:no_running_task'
  // sync progress response
  | 'sync_task:sync:started'
  | 'sync_task:sync:assigned_op'
  | 'sync_task:sync:conflict'
  | 'sync_task:sync:error'
  | 'sync_task:sync:done'
  | 'sync_task:delete:started'
  | 'sync_task:delete:error'
  | 'sync_task:delete:done'

export namespace SyncTaskProgress {
  export interface Base {
    success: number
    failed: number
    skipped: number
    total: number
    current_id: string
  }

  export interface WithName {
    current_name: string
    current_nik: string
  }

  export interface WithProdeskelKK {
    kode_keluarga: string
    current_prodeskel_ak_id: string
  }

  export interface WithProdeskel {
    current_prodeskel_kk_id: string
    current_prodeskel_ak_id: string
  }
}

export namespace ResponsePacket {
  export type Generic<Code extends ResponseCode> = {
    response: Code
  }

  export interface Error extends Generic<'error'> {
    error: string
    [key: string]: any
  }

  export interface Identity extends Generic<'identity'> {
    version: string
    name: string
  }

  // auth

  export interface AuthInvalid extends Generic<'auth:invalid'> {
    error: string
  }
  export interface AuthOKAlreadyRunning extends Generic<'auth:ok'>, SyncTaskProgress.Base {
    sync_status: 'already_running'
  }
  export interface AuthOKNoRunningTask extends Generic<'auth:ok'> {
    sync_status: 'no_running_task'
  }
  export type AuthOK = AuthOKAlreadyRunning | AuthOKNoRunningTask

  // sync status

  export type SyncStatus = Generic<Extract<ResponseCode, `sync_status:${string}`>>

  // sync task

  type BaseProgress = SyncTaskProgress.Base
  type NamedProgress = BaseProgress & SyncTaskProgress.WithName
  type FullProgress = NamedProgress & SyncTaskProgress.WithProdeskel
  type BaseProgressWithKK = BaseProgress & SyncTaskProgress.WithProdeskelKK

  export interface SyncTaskSyncStarted extends Generic<'sync_task:sync:started'>, NamedProgress { }
  export interface SyncTaskSyncAssignedOp extends Generic<'sync_task:sync:assigned_op'>, NamedProgress {
    assigned_op: 'update' | 'insert' | 'upsert' | 'skipped'
  }
  export interface SyncTaskSyncConflict extends Generic<'sync_task:sync:conflict'>, FullProgress { }
  export interface SyncTaskSyncDone extends Generic<'sync_task:sync:done'>, FullProgress { }
  export interface SyncTaskSyncError extends Generic<'sync_task:sync:error'>, BaseProgress {
    error: string
    [key: string]: any
  }

  type No<T extends { response: string }> = Omit<T, 'response'>
  export interface SyncTaskDeleteStarted extends Generic<'sync_task:delete:started'>, BaseProgressWithKK { }
  export interface SyncTaskDeleteDone extends Generic<'sync_task:delete:done'>, BaseProgressWithKK { }
  export interface SyncTaskDeleteError extends No<SyncTaskSyncError>, Generic<'sync_task:delete:error'> { }
}

export type ResponsePacket =
  | ResponsePacket.Error
  | ResponsePacket.Identity
  | ResponsePacket.AuthInvalid
  | ResponsePacket.AuthOK
  | ResponsePacket.SyncStatus
  | ResponsePacket.SyncTaskSyncStarted
  | ResponsePacket.SyncTaskSyncAssignedOp
  | ResponsePacket.SyncTaskSyncConflict
  | ResponsePacket.SyncTaskSyncDone
  | ResponsePacket.SyncTaskSyncError
  | ResponsePacket.SyncTaskDeleteStarted
  | ResponsePacket.SyncTaskDeleteDone
  | ResponsePacket.SyncTaskDeleteError
