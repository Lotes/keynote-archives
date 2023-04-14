import { DropZone } from "@/components/DropZone";
import { useEffect, useState } from "react";
import Head from "next/head";
import { Inspector } from "@/components/Inspector";

export default function Home() {
  const [name, setName] = useState<string | undefined>();
  const [url, setUrl] = useState<string | undefined>();

  return (
    <>
      <Head>
        <title>{name ?? "Keynote inspector"}</title>
      </Head>
      {url && name ? (
        <Inspector name={name} url={url} onUnload={() => {
          setName(undefined);
          setUrl(undefined);
        }}/>
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
