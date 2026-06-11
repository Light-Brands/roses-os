'use client';

import type { TableContent } from '@/lib/manuals/types';

interface Props {
  content: TableContent;
  onChange: (content: TableContent) => void;
  readOnly: boolean;
}

export default function TableBlock({ content, onChange, readOnly }: Props) {
  const updateHeader = (i: number, v: string) => {
    const header = [...content.header];
    header[i] = v;
    onChange({ ...content, header });
  };
  const updateCell = (r: number, c: number, v: string) => {
    const rows = content.rows.map((row, ri) => (ri === r ? row.map((cell, ci) => (ci === c ? v : cell)) : row));
    onChange({ ...content, rows });
  };
  const addRow = () => onChange({ ...content, rows: [...content.rows, new Array(content.header.length).fill('')] });
  const addCol = () =>
    onChange({
      ...content,
      header: [...content.header, ''],
      rows: content.rows.map((r) => [...r, '']),
    });

  return (
    <div className="my-4 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-stone-100">
          <tr>
            {content.header.map((h, i) => (
              <th key={i} className="border border-stone-300 px-3 py-2 text-left font-semibold">
                {readOnly ? h : (
                  <input
                    type="text"
                    value={h}
                    onChange={(e) => updateHeader(i, e.target.value)}
                    className="bg-transparent w-full font-semibold focus:outline-none"
                    aria-label={`Table header column ${i + 1}`}
                  />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {content.rows.map((row, r) => (
            <tr key={r} className="hover:bg-stone-50">
              {row.map((cell, c) => (
                <td key={c} className="border border-stone-300 px-3 py-2">
                  {readOnly ? cell : (
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => updateCell(r, c, e.target.value)}
                      className="bg-transparent w-full focus:outline-none"
                      aria-label={`Row ${r + 1} column ${c + 1}`}
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {!readOnly && (
        <div className="mt-2 flex gap-2 text-xs text-stone-600">
          <button type="button" onClick={addRow} className="border border-stone-300 rounded px-2 py-1">+ Row</button>
          <button type="button" onClick={addCol} className="border border-stone-300 rounded px-2 py-1">+ Column</button>
        </div>
      )}
      {content.caption ? <p className="mt-2 text-xs italic text-stone-600">{content.caption}</p> : null}
    </div>
  );
}
