import Image from "next/image";

export interface HeadlineProps {
  name: string;
  onUnload: () => void;
}

export function Headline({ name, onUnload }: HeadlineProps) {
  return (
    <h1 className="font-bold mb-4">
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
        onClick={onUnload}
      >
        Unload
      </button>
    </h1>
  );
}
