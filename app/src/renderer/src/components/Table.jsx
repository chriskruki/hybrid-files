import React from 'react'

const DarkTable = ({ headers, list }) => {
  return (
    <table className="min-w-full divide-y divide-gray-700">
      <thead className="bg-gray-800">
        <tr>
          {headers.map((header) => (
            <th
              key={header}
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-gray-900 divide-y divide-gray-700">
        {list.map((item, idx) => (
          <tr key={idx}>
            {Object.values(item).map((value, index) => {
                var displayVal = value
                // console.log(typeof value)
                // if (typeof value === Date) {
                //     displayVal = new Date(value.toISOString())
                // }
              return (
                <td key={`${idx}-${index}`} className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{`${displayVal}`}</div>
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default DarkTable
