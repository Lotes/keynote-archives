import { Breadcrumb } from "./Breadcrumb";

export interface FileFrameProps {
  children?: React.ReactNode;
  file: string;
}

export function FileFrame({ children, file }: FileFrameProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow md:flex-row dark:border-gray-700 dark:bg-gray-800 w-full p-4 my-2">
      <a name={file}></a>
      <Breadcrumb filePath={file} />
      <hr className="border-gray-200 my-2" />
      {children}
    </div>
  );
}
