import clsx from "clsx";
import { padStart } from "lodash";
import { useMemo } from "react";

export interface HexRegion {
  startAddress: number;
  length: number;
  color: string;
}

export interface HexViewerProps {
  startAddress: number;
  data: Uint8Array;
  regions: HexRegion[];
}

export interface HexRowProps {
  address: number;
  data: number[];
  from: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  to: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

export function HexRow({ address, data, from, to }: HexRowProps) {
  if(data.length !== 8) {
    data = [...data, ...new Array(8 - data.length).fill(0)];
  }
  return (
    <div className="flex flex-row">
      <span className="font-mono text-xs">
        0x{address.toString(16).padStart(6, "0")}&nbsp;
      </span>
      {data.map((d, index) => {
        return (
          <span
            key={index}
            className={clsx("font-mono text-xs block w-fit", {
              "opacity-0": index < from || index > to,
            })}
          >
            {d.toString(16).padStart(2, "0")}
            &nbsp;
          </span>
        );
      })}
      {data.map((d, index) => {
        return (
          <span
            key={index}
            className={clsx("font-mono text-xs block w-fit", {
              "opacity-0": index < from || index > to,
            })}
          >
            {d < 32 || d > 126 ? "." : String.fromCharCode(d)}
          </span>
        );
      })}
    </div>
  );
}

export function HexViewer({ startAddress, data }: HexViewerProps) {
  //Address (2+6, 0x123456) | Hex (8x2) | ASCII (8)
  const rows = useMemo<HexRowProps[]>(() => {
    const rows: HexRowProps[] = [];
    const mod = startAddress % 8;
    let address = startAddress - mod;
    if (mod > 0) {
      const rowData = new Array<number>(8).fill(0);
      for (let i = mod; i < 8; i++) {
        rowData[i] = data[i - mod];
      }
      rows.push({
        address,
        data: rowData,
        from: mod as any,
        to: 7,
      });
      address += 8;
    }
    for (let i = 0; i < data.length; i += 8) {
      const slice = [...data.slice(i + mod, i + 8)];
      rows.push({
        address,
        data: slice,
        from: 0,
        to: (slice.length-1) as any,
      });
      address += 8;
    }
    return rows;
  }, [startAddress, data]);
  return (
    <div className="w-full">
      {rows.map((row) => (
        <HexRow key={row.address} {...row} />
      ))}
    </div>
  );
}
