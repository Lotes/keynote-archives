import clsx from "clsx";
import { useState } from "react";
import { FileType } from "./statemachine/states";

export type FileTypeCategory = "all" | FileType;

export const FileTypes: Record<FileTypeCategory, string> = {
  all: "All file types",
  image: "Images",
  iwa: "iWork archives",
  other: "Others",
};

export interface SearchBarProps {
  category: FileTypeCategory;
  onCategoryChange: (category: FileTypeCategory) => void;
}

export function SearchBar({ category, onCategoryChange }: SearchBarProps) {
  const [open, setOpen] = useState(() => false);
  return (
    <div className="flex mb-4 w-full">
      <button
        id="dropdown-button"
        onClick={() => setOpen(true)}
        data-dropdown-toggle="dropdown"
        className="h-full flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
        type="button"
      >
        {FileTypes[category]}
        <svg
          aria-hidden="true"
          className="w-4 h-4 ml-1"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
      <div
        id="dropdown"
        className={clsx(
          "z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-auto dark:bg-gray-700 absolute",
          {
            hidden: !open,
          }
        )}
      >
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdown-button"
        >
          {Object.entries(FileTypes)
            .filter(([key]) => key !== category)
            .map(([key, label]) => (
              <li key={key}>
                <button
                  type="button"
                  className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => {
                    onCategoryChange(key as FileTypeCategory);
                    setOpen(false);
                  }}
                >
                  {label}
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
