import { KeynoteArchives } from "../generated";
import { ArchiveInfo } from "../generated/TSPArchiveMessages";
import { Uint8ArrayReader } from "./reader";

export interface IwaObject {
  id: bigint;
  messages: IwaMessage[];
}

export interface IwaMessage {
  type: keyof typeof KeynoteArchives;
  data: unknown;
}

export async function* splitObjects(chunk: Uint8Array): AsyncIterableIterator<IwaObject> {
  const reader = new Uint8ArrayReader(chunk);
  while(!reader.eof()) {
    let archiveInfo: ArchiveInfo;
    try {
      const archiveInfoLength = reader.readVarint32();
      archiveInfo = ArchiveInfo.fromBinary(reader.readBytes(archiveInfoLength).slice());
    } catch (e) {
      console.error('Error while parsing archive info! ', e);
      return
    }
    const object: IwaObject = {
      id: archiveInfo.identifier ?? -1n,
      messages: []
    };
    for (const [index, messageInfo] of Object.entries(archiveInfo.messageInfos)) {
      try {
        const messageType = KeynoteArchives[messageInfo.type as keyof typeof KeynoteArchives];
        const messagePayload = reader.readBytes(messageInfo.length).slice();
        const message = messageType.fromBinary(messagePayload);
        object.messages.push({type: messageInfo.type as keyof typeof  KeynoteArchives, data: message});
      } catch (e) {
        console.error('Error while parsing message! ', index, e);
      }
    }
    yield object;
  }
}
