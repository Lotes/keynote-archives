import { isIwaFile, unzip } from './unzip';
import { unchunk } from './unchunk';
import { IwaObject, splitObjects } from './split';

export interface ArchiveEntryBase {
  type: 'file' | 'iwa';
  name: string;
}

export interface File extends ArchiveEntryBase {
  type: 'file';
  data: Uint8Array;
}

export interface IwaArchive extends ArchiveEntryBase {
  type: 'iwa';
  chunks: IwaChunk[];
}

export interface IwaChunk {
  objects: IwaObject[];
}

export type ArchiveEntry = File | IwaArchive;

export async function* decode(data: Uint8Array): AsyncIterableIterator<ArchiveEntry> {
  for await(const entry of unzip(data)) {
    if(isIwaFile(entry.name)) {
      const chunks: IwaChunk[] = [];
      for await(const chunk of unchunk(entry.data)) {
        const objects: IwaObject[] = [];
        for await(const message of splitObjects(chunk)) {
          objects.push(message);
        }
        chunks.push({ objects });
      }
      yield {
        type: 'iwa',
        name: entry.name,
        chunks
      };
    } else {
      yield {
        type: 'file',
        ...entry
      };
    }
  }
}