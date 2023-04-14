export type ActionType = 'add-file';

export interface ActionBase {
  type: ActionType;
}

export interface AddFileAction extends ActionBase {
  type: 'add-file';
  path: string;
  data: Uint8Array;
}

export type Action = AddFileAction;