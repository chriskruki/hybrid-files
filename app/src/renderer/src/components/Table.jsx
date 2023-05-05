import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import React from 'react'

const DarkTable = ({ headers, list }) => {
  const actionHeader = [...headers, 'Action']
  return (
    <table className="min-w-full divide-y divide-gray-700 table-auto overflow-auto">
      <thead className="bg-gray-800">
        <tr>
          {actionHeader.map((header) => (
            <th
              key={header}
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
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
                  <td key={`${idx}-${index}`} className="px-6 py-4 w-fit">
                    <div className="text-sm text-gray-300 border-sky-700 border rounded p-2">{`${displayVal}`}</div>
                  </td>
                )
              })}
              <td className="px-6 py-4 whitespace-nowrap w-fit">
                <button className="btn w-full text-sm text-gray-300 border-sky-700 border rounded p-2 flex gap-2 justify-center items-center">
                  <div className="flex gap-2 justify-center items-center">
                    <div>Action</div>
                    <FontAwesomeIcon icon={faAngleDown} className="m-0"/>
                  </div>
                </button>
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
