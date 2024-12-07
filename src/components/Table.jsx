import React from "react";

const Table = ({ headers, data, actions }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="table-auto w-full text-left">
        <thead>
          <tr className="bg-blue-600 text-white">
            {headers.map((header, index) => (
              <th key={index} className="px-4 py-2">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-100">
              {Object.values(item).map((value, idx) => (
                <td key={idx} className="px-4 py-2">
                  {value}
                </td>
              ))}
              {actions && (
                <td className="px-4 py-2">
                  <div className="flex space-x-2">
                    {actions.map((action, idx) => (
                      <button
                        key={idx}
                        className={`${action.className} px-2 py-1 rounded-md`}
                        onClick={() => action.onClick(item)}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td
                colSpan={headers.length + (actions ? 1 : 0)}
                className="text-center py-4"
              >
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
