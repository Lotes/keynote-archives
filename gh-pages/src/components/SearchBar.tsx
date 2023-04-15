import clsx from "clsx";
import { useState } from "react";
import { FileType } from "./statemachine/states";

export type FileTypeCategory = "all" | FileType;

export const FileTypes: Record<FileTypeCategory, string> = {
  all: "All file types",
  image: "Images",
  iwa: "iWork archives",
  xml: "XML files",
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
        className="h-full flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
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
          "z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 relative",
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
      <div className="relative w-full">
        <input
          type="search"
          id="search-dropdown"
          className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
          required
        />
        <button
          type="submit"
          className="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
          <span className="sr-only">Search</span>
        </button>
      </div>
    </div>
  );
}
