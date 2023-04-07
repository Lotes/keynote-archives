import { createReadStream } from 'fs';
import { readdir, writeFile } from 'fs/promises';
import { CompositeGeneratorNode, NL, toString } from 'langium';
import { basename, resolve } from 'path';
import { createInterface } from 'readline';

async function readCodes() {
  const fileStream = createReadStream(resolve(__dirname, `./protocols/codes.csv`));
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  const prefixes = new Set<string>();
  const result = new Map<number, {prefix: string, datatype: string}>();
  for await (const line of rl) {
    const [code, prefix, datatype] = line.split(';');
    result.set(parseInt(code), {prefix, datatype});
    prefixes.add(prefix);
  }
  return [result, prefixes] as const;
}

async function readTypes() {
  const files = await readdir(resolve(__dirname, './protocols'));
  const allTypes: Map<string, {name: string, types: string[]}[]> = new Map();
  for (const file of files) {
    const name = basename(file, '.proto');
    let prefix: string;
    if(name.startsWith('TSCHPreUFF')) {
      prefix = 'TSCHPreUFF';
    } else {
      const match = /^([A-Z]+)[A-Z][^A-Z]/.exec(name);
      if(!match) {
        continue;
      }    
      prefix = match[1] + (name.endsWith('sos')  ?'SOS':'');
    }
    
    const fileStream = createReadStream(resolve(__dirname, `./generated/${name}.ts`));
    const rl = createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    const types = new Set<string>();
    for await (const line of rl) {
      const match = /^export const \w+ = new (\w+)\$Type\(\);$/.exec(line);
      if (match) {
        types.add(match[1]);
      }
    }
    if(!allTypes.has(prefix)) {
      allTypes.set(prefix, []);
    }
    allTypes.get(prefix)?.push({name, types: [...types]});
  }
  return allTypes;
}

export async function generateIndex() {
  const allTypes = await readTypes();
  const [codes] = await readCodes();
  const generatorNode = new CompositeGeneratorNode();
  const imports = new Map<string, [number, string][]>();
  for (const [code, {prefix, datatype}] of codes) {
    if(prefix === 'package') {
      continue;
    }
    if(allTypes.has(prefix)) {
      const list = allTypes.get(prefix)!;
      let found = false;
      for (const {types, name} of list) {
        if(types.includes(datatype)) {
          if(!imports.has(name)) {
            imports.set(name, []);
          }
          imports.get(name)!.push([code, datatype]);
          found = true;
          break;
        }  
      }
      if(!found) {
        throw new Error(`Unknown type ${datatype} for prefix ${prefix}`);
      }
    } else {
      throw new Error('Unknown prefix: ' + prefix);
    }
  }

  for (const [name] of imports) {
    generatorNode.append(`import * as ${name} from './${name}';`, NL);
  }

  generatorNode.append(`import { MessageType } from '@protobuf-ts/runtime';`, NL, NL);

  let lines: [number,string][] = []
  for (const [name, types] of imports) {
    for (const [code, datatype] of types) {
      lines.push([code, `  ${code}: ${name}.${datatype},`]);
    }
  }
  lines = lines.sort((a,b) => a[0] - b[0]);

  generatorNode.append(`export type KeynoteArchives = {`, NL);
  for (const [_, line] of lines) {
    generatorNode.append(line, NL);
  }
  generatorNode.append(`};`, NL);

  generatorNode.append(NL);
  generatorNode.append(`export type KeynoteArchivesMessageTypes = {`, NL);
  generatorNode.append(`  [K in keyof KeynoteArchives]: MessageType<KeynoteArchives[K]>`, NL);
  generatorNode.append(`}`, NL, NL);

  generatorNode.append(`export const KeynoteArchives: KeynoteArchivesMessageTypes = {`, NL);
  for (const [_, line] of lines) {
    generatorNode.append(line, NL);
  }
  generatorNode.append(`};`, NL);

  await writeFile(resolve(__dirname, 'generated/index.ts'), toString(generatorNode));
}

generateIndex();