import { Fragment} from 'react'
import { IwaFileState } from "./statemachine/states";

export interface IWorkArchiveInspectorProps {
  file: IwaFileState;
}

export function IWorkArchiveInspector({file}: IWorkArchiveInspectorProps) {
  const { chunks } = file;
  return <>
    {chunks.map(c => <div>0x{c.startAddress.toString(16)}:</div>).reduce((a,b) => <Fragment>{[a, <hr className='my-2'/>, b]}</Fragment>)}
  </>
}