import { MessageType } from "@protobuf-ts/runtime";
import { ArchiveInfo, MessageInfo } from "../generated/TSPArchiveMessages";
import { Uint8ArrayReader } from "./reader";

export interface Registry {
  [index: number]: MessageType<object>;
}

export interface IwaObject {
  identifier?: bigint;
  shouldMerge?: boolean;
  offset: number;
  length: number;
  messages: IwaMessage[];
}

export interface IwaMessage {
  info: MessageInfo;
  offset: number;
  length: number;
  data: unknown;
}

export async function* splitObjectsAs(chunk: Uint8Array, registry: Registry): AsyncIterableIterator<IwaObject> {
  const reader = new Uint8ArrayReader(chunk);
  while(!reader.eof()) {
    const offset = reader.pos;
    let archiveInfo: ArchiveInfo;
    try {
      const length = reader.readVarint32();
      const buffer = reader.readBytes(length).slice();
      archiveInfo = ArchiveInfo.fromBinary(buffer);
    } catch (e) {
      console.error('Error while parsing archive info! ', e);
      return
    }
    const messages: IwaMessage[] = [];
    for (const [index, messageInfo] of Object.entries(archiveInfo.messageInfos)) {
      try {
        const offset = reader.pos;
        const messageType = registry[messageInfo.type];
        const messagePayload = reader.readBytes(messageInfo.length).slice();
        const message = messageType.fromBinary(messagePayload);
        messages.push({
          info: messageInfo,
          offset,
          length: reader.pos - offset,
          data: message
        });
      } catch (e) {
        console.error('Error while parsing message! ', index, e);
      }
    }
    const length = reader.pos - offset;
    const object: IwaObject = {
      identifier: archiveInfo.identifier,
      shouldMerge: archiveInfo.shouldMerge,
      offset,
      length,
      messages
    };

    yield object;
  }
}
