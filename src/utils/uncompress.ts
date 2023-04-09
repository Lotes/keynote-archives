import { uncompress as unsnappy } from "snappy";

export async function uncompress(data: Uint8Array): Promise<Uint8Array> {
  const buffer = Buffer.from(data);
  const result = await unsnappy(buffer, { asBuffer: true });
  return result.valueOf() as Uint8Array;
}