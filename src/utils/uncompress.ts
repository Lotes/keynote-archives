import { uncompress as unsnappy } from "snappyjs";

export async function uncompress(data: Uint8Array): Promise<Uint8Array> {
  const buffer = Buffer.from(data);
  return await unsnappy(buffer);
}