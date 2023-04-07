import JSZip = require("jszip");
import { INDEX_DIR } from "./constants";

export interface ZipEntry {
  name: string;
  data: Uint8Array;
}

export async function* unzip(data: Uint8Array): AsyncIterableIterator<ZipEntry> {
  const content = await JSZip.loadAsync(data);
  for (const [name, file] of Object.entries(content.files)) {
    const data = await file.async('uint8array');
    yield { name, data };
  }
}

export function isIwaFile(name: string) {
  return name.startsWith(INDEX_DIR) && name.endsWith('.iwa');
}
