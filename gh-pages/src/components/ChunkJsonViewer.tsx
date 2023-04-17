import { asJson, KeynoteArchives, splitObjectsAs } from "keynote-archives";
import { useEffect, useState } from "react";

export interface ChunkJsonViewerProps {
  data: Uint8Array;
}

interface JsonObject {
  id: string;
  text: string;
}

export function ChunkJsonViewer({data}: ChunkJsonViewerProps) {
  const [list, setList] = useState<JsonObject[]>(() => []);

  useEffect(() => {
      (async function() {
        try{
          for await (const obj of splitObjectsAs(data, KeynoteArchives)) {
            const id = obj.identifier?.toString() ?? "null"
            const json = {
              messages: obj.messages.map(m => {
                const archive = KeynoteArchives[m.info.type as keyof typeof KeynoteArchives];
                return {
                  typeName: archive.typeName,
                  typeId: m.info.type,
                  data: m.data,
                };
              }),
            };
            const text = json.messages.length === 1 ? asJson(json.messages[0]) : asJson(json);
            setList(previous => [...previous, {
              id,
              text,
            }]);
          }
        } catch(e) {
          console.error(e);
        }
      })();
  }, []);

  return <div>
    {list.map(v => <pre key={v.id} className="font-mono text-xs">{v.id} =&gt; {v.text}</pre>)}
  </div>;
}