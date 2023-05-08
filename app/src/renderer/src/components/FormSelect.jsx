import * as React from 'react'

export default function FormSelect({ label, name, value, onChange, hint, options, className}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm mb-1 font-medium text-white">
        {label}
      </label>
      <select
        id="countries"
        className="rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
        onChange={onChange}
        defaultValue={value}
      >
        {options}
      </select>
      {hint && (
        <label htmlFor={name} className="block mb-1 text-xs font-thin text-gray-400">
          {hint}
        </label>
      )}
    </div>
  )
}
