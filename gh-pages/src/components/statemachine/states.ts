export type UnpackStatus = 'created' | 'unpacking' | 'ready';
export interface InspectorState {
  name: string;
  url: string;
  status: UnpackStatus;
  files: FileState[];
}

export interface FileStateBase {
  path: string;
  type: 'xml'|'iwa'|'image'|'other';
  status: UnpackStatus;
}

export interface IwaFileState extends FileStateBase {
  type: 'iwa';
  chunks: ChunkState[];
}

export interface ChunkState {
  
}

export interface XmlFileState extends FileStateBase {
  type: 'xml';
  content: string;
}

export interface ImageFileState extends FileStateBase {
  type: 'image';
  url: string;
}

export interface OtherFileState extends FileStateBase {
  type: 'other';
  buffer: ArrayBuffer;
}

export type FileState = IwaFileState | XmlFileState | ImageFileState | OtherFileState;

export function initialState(name: string, url: string): InspectorState {
  return {
    name,
    url,
    status: "created",
    files: []
  };
}