import { Uint8ArrayReader } from "./reader";

export interface SnappyChunk {
  data: Uint8Array;
  offset: number;
  originalLength: number;
}

export async function* dechunk(iwaFile: Uint8Array): AsyncIterableIterator<SnappyChunk> {
  const reader = new Uint8ArrayReader(iwaFile);
  while(!reader.eof()) {
    const offset = reader.pos;
    const snappyFirstByte = reader.readUint8();
    if(snappyFirstByte !== 0) {
      throw new Error('Invalid snappy first byte, must be zero.');
    }
    const chunkLength = reader.readUint24();
    yield {
      offset,
      data: reader.readBytes(chunkLength).slice(),
      originalLength: chunkLength + 4
    };
  }
}
