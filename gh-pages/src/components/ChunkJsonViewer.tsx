import { asJson, KeynoteArchives, splitObjectsAs } from "keynote-archives";
import { useEffect, useState } from "react";

export interface ChunkJsonViewerProps {
  data: Uint8Array;
}

export function ChunkJsonViewer({data}: ChunkJsonViewerProps) {
  const [list, setList] = useState<string[]>(() => []);

  useEffect(() => {
    if(data.length > 0) {
      (async function() {
        for await (const obj of splitObjectsAs(data, KeynoteArchives)) {
          const jsons = obj.messages.map(v => asJson(v.data));
          setList(previous => [...previous, ...jsons]);
        }
      })
    }
  }, [data.length]);

  return <div>
    {list.map((v, i) => <pre key={i}>{v}</pre>)}
  </div>;
}