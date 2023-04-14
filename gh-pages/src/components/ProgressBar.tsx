import { Headline } from "./Headline";

export interface ProgressBarProps {
  label: string;
  value: number;
  maximum: number;
}

export function ProgressBar({ label, maximum, value }: ProgressBarProps) {
  return (
    <>
      <div className="w-full h-4 mb-1 bg-white rounded-full dark:bg-gray-700">
        <div
          className="h-4 bg-blue-600 rounded-full dark:bg-blue-500"
          style={{ width: (100*value/maximum)+"%" }}
        ></div>
      </div>
      <div className="text-center mb-4">{label}</div>
    </>
  );
}
