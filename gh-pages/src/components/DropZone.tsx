import clsx from "clsx"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"

export interface DropZoneProps {
  onDrop: (acceptedFile: File) => void
}

export function DropZone({onDrop: outerOnDrop}: DropZoneProps) {
  const onDrop = useCallback((files: File[]) => outerOnDrop(files[0]), [])
  const {getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject} = useDropzone({
    onDrop, 
    accept: {
      'application/keynote': [".key"],
      'application/vnd.apple.keynote': [".key"],
    },
    multiple: false
  })

  return (
    <main className={clsx("flex min-h-screen flex-col items-center justify-start p-24", {
      "border-4 border-gray-500 border-dashed": !isDragActive,
      "border-4 border-red-500 border-dashed cursor-not-allowed": isDragReject,
      "border-4 border-green-500 border-dashed cursor-copy": isDragAccept,
    })} {...getRootProps()}>
      <h1 className="font-bold">Keynote Inspector</h1>
      <p>
        A tool to inspect Keynote presentations. Please drop a Keynote file!
      </p>
      <input {...getInputProps()} />
    </main>
  )  
}
