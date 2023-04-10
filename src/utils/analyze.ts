import { MessageType } from "@protobuf-ts/runtime";
import { ArchiveInfo } from "../generated/TSPArchiveMessages";
import { Registry, Uint8ArrayReader } from ".";

export interface AnalyzerGraph {
  buffer: Uint8Array;
  nodes: Map<number, PositionNode>;
}

export interface PositionNode {
  offset: number;
  outedges: Edge[];
  inedges: Edge[];
}

export interface EdgeBase {
  type: 'gap'|'type';
  length: number;// = endExcl-start
  start: number;
  endExcl: number;
}
export interface GapEdge extends EdgeBase {
  type: 'gap';
}

export interface TypeEdge extends EdgeBase {
  type: 'type';
  messageType: string;
}
export type Edge = GapEdge|TypeEdge;

export type NodePath = Edge[];

interface StackFrame {
  node: PositionNode;
  outEdgeIndex: number;
}

export function analyzeChunkFor(chunk: Uint8Array, registry: Registry): NodePath {
  const graph: AnalyzerGraph = {
    buffer: chunk,
    nodes: new Map(),
  }
  const reader = new Uint8ArrayReader(chunk);
  scanForArchiveInfos(reader, registry, graph);
  return findPath(graph, chunk);
}

function findPath(graph: AnalyzerGraph, chunk: Uint8Array): NodePath {
  let node = graph.nodes.get(0)!;
  const end = graph.nodes.get(chunk.length)!;
  const stack: StackFrame[] = [{
    node,
    outEdgeIndex: 0,
  }];
  do {
    const top = stack.length - 1;
    const frame = stack[top];
    if (frame.outEdgeIndex < frame.node.outedges.length) {
      const edge = frame.node.outedges[frame.outEdgeIndex];
      frame.outEdgeIndex++;
      node = graph.nodes.get(edge.endExcl)!;
      stack.push({
        node,
        outEdgeIndex: 0,
      });
    } else {
      stack.pop();
    }
  } while (node !== end);

  return stack.map((_, index) => {
    if(index === stack.length - 1) {
      return undefined;
    }
    const current = stack[index].node.outedges;
    const next = stack[index + 1].node.inedges;
    return current.find(edge => next.includes(edge));
  }).filter(p => p).map(p => p!);
}

function scanForArchiveInfos(reader: Uint8ArrayReader, registry: Registry, graph: AnalyzerGraph) {
  let gapStart = 0;
  let gapLength = 0;
  reader.pos = gapStart + gapLength;
  while (reader.pos < reader.buf.length) {
    let [success, metadata] = tryReadArchiveInfo(reader, registry);
    if (success) {
      if (gapLength > 0) {
        const edge = addGap(graph, gapStart, gapLength);
        gapStart = edge.endExcl;
        gapLength = 0;
      }
      addType(graph, metadata!.offset, metadata!.length, metadata!.messageType);
    } else {
      gapLength++;
      reader.pos = gapStart + gapLength;
    }
  }
  if(gapLength > 0) {
    addGap(graph, gapStart, gapLength);
  }
}

function tryReadArchiveInfo(reader: Uint8ArrayReader, registry: Registry) {
  const offset = reader.pos;
  try {
    const archiveInfoLength = reader.readVarint32();
    const archiveInfoBuffer = reader.readBytes(archiveInfoLength).slice();
    const archiveInfo = ArchiveInfo.fromBinary(archiveInfoBuffer);
    for (const messageInfo of archiveInfo.messageInfos) {
      const messageBuffer = reader.readBytes(messageInfo.length).slice();
      registry[messageInfo.type].fromBinary(messageBuffer);
    }
    const length = reader.pos - offset;
    if (archiveInfo.messageInfos.length === 0) {
      throw new Error('No messages found');
    }
    return [true, {
      offset,
      length,
      messageType: 'ArchiveInfo'
    }] as const
  } catch {
    reader.pos = offset;
    return [false, undefined] as const;
  }
}

function tryRead(reader: Uint8ArrayReader, messageTypes: MessageType<object>[]) {
  const position = reader.pos;
  for (const messageType of messageTypes) {
    try {
      const offset = reader.pos;
      const messageLength = reader.readVarint32();
      const messageBuffer = reader.readBytes(messageLength).slice();
      messageType.fromBinary(messageBuffer);
      const length = reader.pos - offset;
      return [true, {
        offset,
        length,
        messageType: messageType.typeName
      }] as const
    } catch {
      reader.pos = position;
      return [false, undefined] as const;
    }  
  }
  return [false, undefined] as const;
}


function ensureNode(graph: AnalyzerGraph, offset: number): PositionNode {
  if (!graph.nodes.has(offset)) {
    graph.nodes.set(offset, {
      offset,
      outedges: [],
      inedges: [],
    });
  }
  return graph.nodes.get(offset)!;
}

function addGap(graph: AnalyzerGraph, start: number, length: number) {
  const startNode = ensureNode(graph, start);
  const end = start + length;
  const endNode = ensureNode(graph, end);
  const edge: GapEdge = {
    type: 'gap',
    length,
    start,
    endExcl: end,
  }
  startNode.outedges.push(edge);
  endNode.inedges.push(edge);
  return edge;
}

function addType(graph: AnalyzerGraph, start: number, length: number, messageType: string) {
  const startNode = ensureNode(graph, start);
  const end = start + length;
  const endNode = ensureNode(graph, end);
  const edge: TypeEdge = {
    type: 'type',
    length,
    start,
    endExcl: end,
    messageType,
  }
  startNode.outedges.push(edge);
  endNode.inedges.push(edge);
  return edge;
}