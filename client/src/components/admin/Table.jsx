const Table = ({ columns, data, actions }) => {
  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((col) => (
              <th key={col} className="px-4 py-2 text-left">{col}</th>
            ))}
            {actions && <th className="px-4 py-2">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              {columns.map((col, idx) => (
                <td key={idx} className="px-4 py-2">{row[col]}</td>
              ))}
              {actions && (
                <td className="px-4 py-2 space-x-2">
                  {actions.map((ActionBtn, idx) => (
                    <ActionBtn key={idx} row={row} />
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
