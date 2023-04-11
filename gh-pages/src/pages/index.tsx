import { DropZone } from "@/components/DropZone";
import { useEffect, useState } from "react";

export default function Home() {
  const [name, setName] = useState<string|undefined>();
  const [url, setUrl] = useState<string|undefined>();

  useEffect(() => {
    setUrl(localStorage.getItem("url") ?? undefined);
    setName(localStorage.getItem("name") ?? undefined);
  }, []);

  useEffect(() => {
    url && localStorage.setItem("url", url);
    name && localStorage.setItem("name", name);
  }, [url]);

  return (
    url
      ? 
      <main className="flex min-h-screen flex-col items-center justify-start p-24">
        {name}
        <button onClick={() => {
          localStorage.setItem('name', undefined!);
          localStorage.setItem('url', undefined!);
          setName(undefined);
          setUrl(undefined);
        }}>Unload</button> 
      </main>
      :
      <DropZone onDrop={async (file) => {
        setUrl(URL.createObjectURL(new Blob([await file.arrayBuffer()])));
        setName(file.name);
      }} />
  )
}
