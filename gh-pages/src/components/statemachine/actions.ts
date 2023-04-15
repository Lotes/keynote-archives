export type ActionType = 'add-file'|'add-chunk'|'toggle-file';

export interface ActionBase {
  type: ActionType;
}

export interface AddFileAction extends ActionBase {
  type: 'add-file';
  path: string;
  data: Uint8Array;
}

export interface AddChunkAction extends ActionBase {
  type: 'add-chunk';
  path: string;
  startAddress: number;
  data: Uint8Array;
}

export interface ToggleFileAction extends ActionBase {
  type: 'toggle-file';
  path: string;
}

export type Action = AddFileAction | AddChunkAction | ToggleFileAction;
