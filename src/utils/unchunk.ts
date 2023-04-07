import { uncompress } from "snappy";
import { Uint8ArrayReader } from "./reader";

export async function* unchunk(iwaFile: Uint8Array): AsyncIterableIterator<Uint8Array> {
  const reader = new Uint8ArrayReader(iwaFile);
  while(!reader.eof()) {
    const snappyFirstByte = reader.readUint8();
    if(snappyFirstByte !== 0) {
      throw new Error('Invalid snappy first byte, must be zero.');
    }
    const chunkLength = reader.readUint24();
    const chunkReader = reader.readBytes(chunkLength);
    const compressed = Buffer.from(chunkReader.slice());
    const uncompressed = await uncompress(compressed, {asBuffer: true});
    yield uncompressed.valueOf() as Uint8Array;
  }
}
