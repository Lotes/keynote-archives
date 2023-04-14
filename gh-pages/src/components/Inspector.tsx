import { unzip } from "keynote-archives";
import { Headline } from "./Headline";
import { ProgressBar } from "./ProgressBar";
import { Fragment, Reducer, useEffect, useReducer, useState } from "react";
import { FileFrame } from "./FileFrame";
import { reducer } from "./statemachine/reducer";
import { Action } from "./statemachine/actions";
import { FileState, initialState, InspectorState } from "./statemachine/states";
import _ from "lodash";

export interface InspectorProps {
  name: string;
  url: string;
  onUnload: () => void;
}

export function Inspector({ name, url, onUnload }: InspectorProps) {
  const [maximum, setMaximum] = useState(100);
  const [progress, setProgress] = useState(0);
  const [{ files }, dispatch] = useReducer<Reducer<InspectorState, Action>>(
    reducer,
    initialState(name, url)
  );

  const dictionary = _.groupBy(files, (f) =>
    f.path.substring(0, f.path.lastIndexOf("/"))
  );
  const entries = Object.entries(dictionary);

  useEffect(() => {
    (async () => {
      const data = await fetch(url);
      const buffer = await data.arrayBuffer();
      for await (const file of unzip(new Uint8Array(buffer))) {
        setMaximum(file.maximum);
        setProgress(file.index + 1);
        dispatch({
          type: "add-file",
          data: file.data,
          path: file.name,
        });
      }
    })();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <Headline name={name} onUnload={onUnload} />
      {progress < maximum && (
        <ProgressBar label="Unpacking..." value={progress} maximum={maximum} />
      )}
      {entries.map(([path, files]) => (
        <Fragment key={path}>
          <h2 className="text-2xl font-bold">
            <a name={path}></a>
            {path}
          </h2>
          {files.map((f) => (
            <FileFrame key={f.path} file={f.path} />
          ))}
        </Fragment>
      ))}
    </main>
  );
}
