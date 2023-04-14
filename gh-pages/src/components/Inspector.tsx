import { unzip } from "keynote-archives";
import { Headline } from "./Headline";
import { ProgressBar } from "./ProgressBar";
import { Fragment, Reducer, useEffect, useReducer, useState } from "react";
import { FileFrame } from "./FileFrame";
import { reducer } from "./statemachine/reducer";
import { Action } from "./statemachine/actions";
import { FileState, initialState, InspectorState } from "./statemachine/states";
import _ from "lodash";
import { FileTypeCategory, SearchBar } from "./SearchBar";

export interface InspectorProps {
  name: string;
  url: string;
  onUnload: () => void;
}

export function Inspector({ name, url, onUnload }: InspectorProps) {
  const [category, setCategory] = useState<FileTypeCategory>('all');
  const [maximum, setMaximum] = useState(100);
  const [progress, setProgress] = useState(0);
  const [{ files, status }, dispatch] = useReducer<Reducer<InspectorState, Action>>(
    reducer,
    initialState(name, url)
  );

  const dictionary = _.groupBy(files, (f) =>
    f.path.substring(0, f.path.lastIndexOf("/"))
  );
  const entries = Object.entries(dictionary);

  useEffect(() => {
    if(status !== 'created') {
      return;
    }
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
      <div className="flex flex-row items-center w-full justify-start">
        <Headline name={name} onUnload={onUnload} />
        <SearchBar category={category} onCategoryChange={setCategory}/>
      </div>
      {progress < maximum && (
        <ProgressBar label="Unpacking..." value={progress} maximum={maximum} />
      )}
      {entries.filter(([_, files]) => {
        if (category === 'all') {
          return true;
        }
        return files.some((f) => f.type === category);
      }).map(([path, files]) => (
        <Fragment key={path}>
          <h2 className="text-2xl font-bold">
            <a id={path}></a>
            {path}
          </h2>
          {files.filter(f => category === 'all' || f.type === category).map((f) => (
            <FileFrame key={f.path} file={f.path} />
          ))}
        </Fragment>
      ))}
    </main>
  );
}
