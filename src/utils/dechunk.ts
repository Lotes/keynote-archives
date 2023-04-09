import { Uint8ArrayReader } from "./reader";

export async function* dechunk(iwaFile: Uint8Array): AsyncIterableIterator<Uint8Array> {
  const reader = new Uint8ArrayReader(iwaFile);
  while(!reader.eof()) {
    const snappyFirstByte = reader.readUint8();
    if(snappyFirstByte !== 0) {
      throw new Error('Invalid snappy first byte, must be zero.');
    }
    const chunkLength = reader.readUint24();
    yield reader.readBytes(chunkLength).slice();
  }
}
