import { isIwaFile, unzip } from './unzip';
import { dechunk } from './dechunk';
import { IwaObject, splitObjects } from './split';
import { uncompress } from './uncompress';

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
      for await(const snappyChunk of dechunk(entry.data)) {
        const objects: IwaObject[] = [];
        const chunk = await uncompress(snappyChunk);
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