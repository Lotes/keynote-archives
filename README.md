# keynote-archives

Utilities to process Keynote presentations (*.key).

Protobuf files were taken from  [psobot](https://github.com/psobot) / [keynote-parser](https://github.com/psobot/keynote-parser).
Read more about the iWorkArchive format [here](https://github.com/obriensp/iWorkFileFormat). Generated by Keynote version 12.2.1 (current as of December 2022).

## How to use?

```
npm install keynote-archives
```

Then import the package and unzip the inner files, unchunk the single IWA files and split each chunk into objects.

```ts
import { unzip, isIwaFile, dechunk, uncompress, splitObjectsAs, KeynoteArchives } from 'keynote-archives';

export async function decode(data: Uint8Array): void {
  for await(const entry of unzip(data)) {
    if(isIwaFile(entry.name)) {
      for await(const snappyChunk of dechunk(entry.data)) {
        const chunk = await uncompress(snappyChunk.data);
        for await(const message of splitObjectsAs(chunk, KeynoteArchives)) {
          ...
        }
      }
    }
  }
}
```

## Documentation

This package provides asynchronous functions to read IWA format. Here is a small overview about the terminology:

![Terminology](./docs/terminology.svg)

Here is what they do in detail:

1. `unzip`: opens an `Uint8Array` as Zip file and returns multiple file entries, until `EOF`.
2. `dechunk`: opens an `Uint8Array` as IWA file and returns multiple [Snappy](https://www.npmjs.com/package/snappy)-compressed chunks as `Uint8Array`, until `EOF`.
3. `uncompress`: opens an `Uint8Array` as Snappy chunk and returns uncompressed data as `Uint8Array`.
4. `splitObjects`: opens an Uint8 array as IWA file chunk and returns multiple Protobuf-decoded IWA (JSON) objects, until `EOF` or error.
5. `decode`: (everything at once) opens an Uint8 array as Zip file and returns multiple `ArchiveEntry`s containing either a file or a list of IWA chunks with multiple IWA objects associated with an IWA file.

You will also get access to all archives types:

* `AllArchives` is a list of all archives.
* for each Protobuf package `XXX`, you will get:
  * a list of all package-related archives `XXX$Archives`
  * a namespace `XXX` with all archives `XXX.yyy`
* a map for all Keynote archives by type number `KeynoteArchives`

## Workflow for contributors

```
npm install                      //Initialize NPM package...
npm run clean                    //Clean artifacts from last build
npm run generate-ts-from-proto   //Generate Typescript files from Protobuf files...
npm run generate-index-from-ts   //Create the index...
npm run build                    //Transpile to Javascript...
```

## License

[MIT license](LICENSE)
