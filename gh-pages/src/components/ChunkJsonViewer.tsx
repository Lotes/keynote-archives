import { asJson, KeynoteArchives, splitObjectsAs } from "keynote-archives";
import { useEffect, useState } from "react";

export interface ChunkJsonViewerProps {
  data: Uint8Array;
}

export function ChunkJsonViewer({data}: ChunkJsonViewerProps) {
  const [list, setList] = useState<string[]>(() => []);

  useEffect(() => {
      (async function() {
        try{
          for await (const obj of splitObjectsAs(data, KeynoteArchives)) {
            const jsons = obj.messages.map(v => asJson(v.data));
            setList(previous => [...previous, ...jsons]);
          }
        } catch(e) {
          setList(['Error:'+(e as any['message'])]);
        }
      })();
  }, []);

  return <div>
    {list.map((v, i) => <pre key={i} className="font-mono text-xs">{v}</pre>)}
  </div>;
}