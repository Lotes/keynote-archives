import JSZip = require("jszip");
import { INDEX_DIR } from "./constants";

export interface ZipEntry {
  name: string;
  data: Uint8Array;
  index: number;
  maximum: number;
}

export async function* unzip(data: Uint8Array): AsyncIterableIterator<ZipEntry> {
  const content = await JSZip.loadAsync(data);
  let index = 0;
  const entries = Object.entries(content.files);
  for (const [name, file] of entries) {
    const data = await file.async('uint8array');
    yield { name, data, index, maximum: entries.length };
    index++;
  }
}

export function isIwaFile(name: string) {
  return name.startsWith(INDEX_DIR) && name.endsWith('.iwa');
}
