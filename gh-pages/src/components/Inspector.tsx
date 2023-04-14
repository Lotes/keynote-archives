import { unzip } from "keynote-archives";
import { Headline } from "./Headline";
import { ProgressBar } from "./ProgressBar";
import { Reducer, useEffect, useReducer } from "react";
import { FileFrame } from "./FileFrame";
import { reducer } from "./statemachine/reducer";
import { Action } from "./statemachine/actions";
import { initialState, InspectorState } from "./statemachine/states";

export interface InspectorProps {
  name: string;
  url: string;
  onUnload: () => void;
}

export function Inspector({ name, url, onUnload }: InspectorProps) {
  const [{
    files,
    status
  }, dispatch] = useReducer<Reducer<InspectorState, Action>>(reducer, initialState(name, url));

  useEffect(() => {
    (async () => {
      const data = await fetch(url);
      const buffer = await data.arrayBuffer();
      for await (const file of unzip(new Uint8Array(buffer))) {
                
      }
    })();
  }, [url]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <Headline name={name} onUnload={onUnload} />
      <ProgressBar label="Loading..." value={0} maximum={1} />
      <FileFrame file="Index/Slide.iwa"/>
      <FileFrame file="Index/Slide.iwa"/>
    </main>
  );
}
