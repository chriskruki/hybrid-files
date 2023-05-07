import React from 'react'
import RowDropdown from './RowDropdown'

const DarkTable = ({ headers, list, dropdownElems }) => {
  const actionHeader = [...headers, 'Action']
  const headerClasses = [...headers.map(v => ''), 'w-[60px]']
  return (
    <table className="min-w-full divide-y divide-gray-700 table-auto overflow-auto">
      <thead className="bg-gray-800">
        <tr>
          {actionHeader.map((header, idx) => (
            <th
              key={header}
              className={`px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider ${headerClasses[idx]}`}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-gray-700 divide-y divide-gray-700 align-top odd:bg-slate-500">
        {list.length ? (
          list.map((item, idx) => (
            <tr key={idx}>
              {Object.values(item).map((value, index) => {
                var displayVal = value
                // console.log(typeof value)
                // if (typeof value === Date) {
                //     displayVal = new Date(value.toISOString())
                // }
                return (
                  <td key={`${idx}-${index}`} className={`px-6 py-4 w-fit`}>
                    <div className="text-sm text-gray-300 border-sky-700 border rounded p-2">{`${displayVal}`}</div>
                  </td>
                )
              })}
              <td className="px-6 py-4 whitespace-nowrap w-fit">
                <RowDropdown rowInfo={item}>
                  {dropdownElems}
                </RowDropdown>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td>No data fetched</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default DarkTable
