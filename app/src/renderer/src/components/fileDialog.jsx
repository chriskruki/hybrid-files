import { useState } from 'react'

export default function FileDialog({
  jobHolder,
  updateJobHolder,
  className,
  label,
  name,
  hint,
  required
}) {
  const [fileList, setFileList] = useState([])

  const handleOpenDialog = async (e) => {
    e.preventDefault()
    try {
      const params = {
        title: 'Select a media folder',
        buttonLabel: 'Select',
        properties: ['openDirectory']
      }
      const selectedDirs = await window.api.openDialog(params)
      if (selectedDirs) {
        updateJobHolder('src_path', selectedDirs[0])
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className={className}>
      {/* Label */}
      <label htmlFor={name} className="block text-sm mb-1 font-medium text-white">
        {label}
      </label>
      {/* Dir Select Section */}
      <div className="flex">
        <button
          id={name}
          className="rounded-lg rounded-r-none border-r border-r-gray-300 w-fit p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white text-sm"
          onClick={handleOpenDialog}
        >
          Choose
        </button>
        <input
          value={jobHolder.src_path}
          onChange={(e) => updateJobHolder('src_path', e.target.value)}
          required={required}
          className="rounded-lg rounded-l-none w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white overflow-auto"
        ></input>
      </div>

      {/* Hint */}
      <div className="flex justify-between items-center mt-1 gap-1">
        {/* Recursive Checkbox */}
        <label className="inline-flex items-center mr-2">
          <input
            value={jobHolder.dirRecursive}
            onChange={(e) => updateJobHolder('dirRecursive', e.target.checked)}
            type="checkbox"
            className="form-checkbox rounded h-5 w-5 text-sky-600 accent-gray-600 bg-gray-700 cursor-pointer transition-all"
          ></input>
          <span className="ml-2 font-thin text-sm text-white">Traverse Recursively</span>
        </label>
      </div>
    </div>
  )
}
