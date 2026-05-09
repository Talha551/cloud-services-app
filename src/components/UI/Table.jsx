export default function Table({ columns, data, onRowClick }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[#2a2d3e]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#2a2d3e] bg-[#0f1117]">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide whitespace-nowrap"
                style={{ width: col.width }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="text-center py-12 text-slate-600">
                No records found
              </td>
            </tr>
          )}
          {data.map((row, i) => (
            <tr
              key={row.id ?? i}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-[#1e2130] hover:bg-[#1a1d2a] transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-slate-300 whitespace-nowrap">
                  {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
