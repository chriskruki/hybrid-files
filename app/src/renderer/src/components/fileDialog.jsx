import { useState } from 'react'

export default function FileDialog({ className, label, name, hint, selectedDir, setSelectedDir }) {
  // const [selectedDir, setSelectedDir] = useState('')
  const [fileList, setFileList] = useState([])

  const handleOpenDialog = async () => {
    try {
      const params = {
        title: 'Select a media folder',
        buttonLabel: 'Select',
        properties: ['openDirectory']
        // properties: ['openDirectory', 'multiSelections']
      }
      const selectedDirs = await window.api.openDialog(params)
      // console.log(selectedDirs)
      if (selectedDirs) {
        setSelectedDir(selectedDirs[0])
        const files = await getFilesInDirectory(selectedDirs[0])
        setFileList(files)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getFilesInDirectory = async (dirPath) => {
    try {
      const files = await window.api.readdir(dirPath)
      return files
      //   .filter((file) => {
      //     return ['.mp4', '.avi', '.mov'].includes(file.slice(-4))
      //   })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm mb-1 font-medium text-white">
        {label}
      </label>
      <div className="flex gap-1">
        <button
          id={name}
          className="rounded-lg w-fit p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white text-sm"
          onClick={handleOpenDialog}
        >
          Choose
        </button>
        <div
          className="rounded-lg w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white overflow-auto"
        >
          {selectedDir}
        </div>
      </div>

      {hint && (
        <label htmlFor={name} className="block mb-1 text-xs font-thin text-gray-400">
          {hint}
        </label>
      )}
      <label htmlFor={name} className="block mb-1 text-xs font-thin text-gray-400">
        {fileList.length} files selected
      </label>
      {/* {selectedDir && (
        <div>
          <h2>Selected Directory:</h2>
          <p>{selectedDir}</p>
        </div>
      )}
      {fileList.length > 0 && (
        <div>
          <h2>Files:</h2>
          <ul>
            <pre>
              {fileList.map((file, index) => (
                <li key={index}>{JSON.stringify(file, null, 2)}</li>
              ))}
            </pre>
          </ul>
        </div>
      )} */}
    </div>
  )
}
