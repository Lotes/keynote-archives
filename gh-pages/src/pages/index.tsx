import { DropZone } from "@/components/DropZone";
import { useEffect, useState } from "react";
import Image from "next/image";
import Head from "next/head";

export default function Home() {
  const [name, setName] = useState<string | undefined>();
  const [url, setUrl] = useState<string | undefined>();

  useEffect(() => {
    setUrl(localStorage.getItem("url") ?? undefined);
    setName(localStorage.getItem("name") ?? undefined);
  }, []);

  useEffect(() => {
    url && localStorage.setItem("url", url);
    name && localStorage.setItem("name", name);
  }, [url]);

  return (
    <>
      <Head>
        <title>{name ?? "Keynote inspector"}</title>
      </Head>
      {url ? (
        <main className="flex min-h-screen flex-col items-center justify-start p-24">
          <h1 className="font-bold">
            <Image
              alt="icon"
              className="inline"
              src="/keynote.png"
              width="32"
              height="32"
            />
            &nbsp;{name}&nbsp;
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
              onClick={() => {
                localStorage.setItem("name", undefined!);
                localStorage.setItem("url", undefined!);
                setName(undefined);
                setUrl(undefined);
              }}
            >
              Unload
            </button>
          </h1>
        </main>
      ) : (
        <DropZone
          onDrop={async (file) => {
            setUrl(URL.createObjectURL(new Blob([await file.arrayBuffer()])));
            setName(file.name);
          }}
        />
      )}
    </>
  );
}
