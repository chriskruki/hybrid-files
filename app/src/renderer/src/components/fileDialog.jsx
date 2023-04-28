import { useState } from 'react'

const FileDialog = () => {
  const [selectedDir, setSelectedDir] = useState('')
  const [fileList, setFileList] = useState([])

  const handleOpenDialog = async () => {
    try {
      const result = await window.api.openDialog({
        title: 'Select a media folder',
        buttonLabel: 'Select',
        properties: ['openDirectory', 'multiSelections']
      })
      console.log(result)
      for (let path of result) {
        console.log(path)
      }
      if (result) {
        setSelectedDir(result[0])
        const files = await getFilesInDirectory(result[0])
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
    <div>
      <button className="btn h-15 p-2" onClick={handleOpenDialog}>
        Open Directory
      </button>
      {selectedDir && (
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
      )}
    </div>
  )
}

export default FileDialog
