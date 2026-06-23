interface Column {
  key: string;
  label: string;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

interface Props {
  columns: Column[];
  data: Record<string, unknown>[];
}

export default function AdminTable({ columns, data }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-beige/15">
            {columns.map((col) => (
              <th
                key={col.key}
                className="whitespace-nowrap px-3 py-3 text-[9px] font-semibold uppercase tracking-[0.12em] text-taupe/70"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-3 py-10 text-center text-sm text-taupe"
              >
                No data yet.
              </td>
            </tr>
          )}
          {data.map((row, i) => (
            <tr
              key={i}
              className="border-b border-beige/8 transition-colors hover:bg-cream/30"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-3 py-3 text-charcoal/80">
                  {col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
