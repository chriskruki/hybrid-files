import { Fragment, useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import { INIT_JOB, MEDIA_TYPES, PAGES } from '../utils/constants'
import { useSqlSettings, useSqlSettingsUpdate } from '../context/SqlContext'
import LeftIsland from '../components/LeftIsland'
import StaticModal from '../components/StaticModal'
import FormInput from '../components/FormInput'
import RowDropdown from '../components/RowDropdown'
import JobsTable from '../components/tables/JobsTable'
import FormSelect from '../components/FormSelect'
import FileDialog from '../components/fileDialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons'
import FilePreviewTable from '../components/tables/FilePreviewTable'
import FilesTable from '../components/tables/FilesTable'

export default function FilesPage({ currPage, setCurrPage }) {
  const pageVisible = currPage === PAGES.FILES
  const sqlSettings = useSqlSettings()
  const updateSqlSettings = useSqlSettingsUpdate()

  const [fileList, setFileList] = useState([])
  const [fileHolder, setFileHolder] = useState(INIT_JOB)
  const [resMsg, setResMsg] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [modalContentKey, setModalContentKey] = useState()
  const [modalTitle, setModalTitle] = useState('')

  // Only trigger if pageVisible changes
  useEffect(() => {
    if (pageVisible && sqlSettings.connected) {
      getFiles()
    }
  }, [pageVisible])

  // Reset to inital blank values
  const resetFileHolder = () => {
    setFileHolder(INIT_JOB)
  }

  const updateFileHolder = (key, val) => {
    setFileHolder((prev) => {
      return {
        ...prev,
        [key]: val
      }
    })
  }

  // Fetch files
  const getFiles = (doLog=true) => {
    const payload = {}
    try {
      window.api
        .sqlBridge('getFiles', payload)
        .then((res) => {
          if (res.success) {
            if (doLog) {
              updateSqlSettings('log', 'File fetch success', true)
            }
            setFileList(res.data)
          } else {
            updateSqlSettings('log', 'File fetch failed', false)
            console.error('File fetch failed: ' + res.errMsg)
          }
        })
        .catch((reason) => {
          setResMsg(reason)
          updateSqlSettings('log', 'File fetch error', false)
        })
    } catch (e) {
      updateSqlSettings('log', 'Sql Bridge access error', false)
    }
  }

  const dropdownElems = (rowInfo) => (
    <RowDropdown>
      <button
        className="btn w-full text-sm text-gray-300 border-sky-700 border rounded p-2 flex gap-2 justify-center items-center relative"
        onClick={() => {
          setResMsg('')
          setModalContentKey('previewFile')
          setModalOpen(true)
          setModalTitle(`${rowInfo.name}`)
          setFileHolder(rowInfo)
        }}
      >
        Preview
      </button>
    </RowDropdown>
  )

  const modalContentList = {}

  return (
    pageVisible && (
      <Fragment>
        {/* Left File */}
        <LeftIsland>
          <button className={`btn h-fit w-full p-2`} onClick={getFiles}>
            Refresh Data
          </button>
          <StaticModal
            open={modalOpen}
            setOpen={setModalOpen}
            title={modalTitle}
            content={modalContentList[modalContentKey]}
            closeOnClick={true}
          >
          </StaticModal>
        </LeftIsland>
        {/* Right File */}
        <div className="flex flex-col flex-1 gap-4">
          <NavBar currPage={currPage} setCurrPage={setCurrPage} />
          <div className="flex flex-1 paragraph island overflow-auto">
            <FilesTable fileList={fileList} dropdownElems={dropdownElems} />
          </div>
        </div>
      </Fragment>
    )
  )
}
