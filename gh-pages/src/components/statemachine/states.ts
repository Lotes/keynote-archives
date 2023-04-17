export type UnpackStatus = 'created' | 'unpacking' | 'ready';
export interface InspectorState {
  name: string;
  url: string;
  status: UnpackStatus;
  files: FileState[];
}

export type FileType = 'iwa' | 'image' | 'other';

export interface FileStateBase {
  path: string;
  type: FileType;
  status: UnpackStatus;
}

export interface IwaFileState extends FileStateBase {
  type: 'iwa';
  open: boolean;
  chunks: ChunkState[];
  buffer: Uint8Array
}

export interface ChunkState {
  startAddress: number;
  data: Uint8Array;
}

export interface ImageFileState extends FileStateBase {
  type: 'image';
  url: string;
}

export interface OtherFileState extends FileStateBase {
  type: 'other';
  buffer: Uint8Array;
}

export type FileState = IwaFileState | ImageFileState | OtherFileState;

export function initialState(name: string, url: string): InspectorState {
  return {
    name,
    url,
    status: "created",
    files: []
  };
}