export type ActionType = 'add-file'|'add-chunk';

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

export type Action = AddFileAction | AddChunkAction;
