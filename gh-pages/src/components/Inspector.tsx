import { Breadcrumb } from "./Breadcrumb";
import { Headline } from "./Headline";
import { ProgressBar } from "./ProgressBar";

export interface InspectorProps {
  name: string;
  url: string;
  onUnload: () => void;
}

export function Inspector({ name, url, onUnload }: InspectorProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <Headline name={name} onUnload={onUnload} />
      <ProgressBar label="Loading..." value={0} maximum={1} />
      <div>
        <Breadcrumb filePath="aaaa/bbb/ccc.key" />
      </div>
    </main>
  );
}
