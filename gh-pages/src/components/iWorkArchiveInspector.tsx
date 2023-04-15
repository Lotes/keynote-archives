import { Fragment, useEffect } from "react";
import { ChunkJsonViewer } from "./ChunkJsonViewer";
import { HexViewer } from "./HexViewer";
import { IwaFileState } from "./statemachine/states";

export interface IWorkArchiveInspectorProps {
  file: IwaFileState;
  onToggle: () => void;
}

export function IWorkArchiveInspector({ file, onToggle }: IWorkArchiveInspectorProps) {
  const { chunks } = file;

  return (
    <>
      {!file.open && <button onClick={onToggle}>Open</button>}
      {file.open && chunks
        .map((c, index) => (
          <Fragment key={index}>
            <div className="font-mono text-xs">
              Chunk {index + 1} @ 0x{c.startAddress.toString(16)}:
            </div>
            <div className="grid">
              <div className="grid col-start-1 col-end-2">
                <HexViewer startAddress={c.startAddress} data={c.data} regions={[]}/>
              </div>
              <div className="grid col-start-2 col-end-3">
                <ChunkJsonViewer data={c.data}/>
              </div>
            </div>
          </Fragment>
        ))
        .reduce((a, b) => (
          <Fragment>{[a, <hr className="my-2" />, b]}</Fragment>
        ))}
    </>
  );
}
