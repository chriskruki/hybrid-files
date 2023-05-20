import { Fragment, useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import { INIT_JOB, INIT_TABLE_CONFIG, PAGES } from '../utils/constants'
import { useSqlSettings, useSqlSettingsUpdate } from '../context/SqlContext'
import LeftIsland from '../components/LeftIsland'
import StaticModal from '../components/StaticModal'
import FormInput from '../components/FormInput'
import RowDropdown from '../components/RowDropdown'
import FilesTable from '../components/tables/FilesTable'

export default function FilesPage({ currPage, setCurrPage }) {
  const pageVisible = currPage === PAGES.FILES
  const sqlSettings = useSqlSettings()
  const updateSqlSettings = useSqlSettingsUpdate()

  const [fileList, setFileList] = useState([])
  const [fileHolder, setFileHolder] = useState(INIT_JOB)
  const [tableConfig, setTableConfig] = useState(INIT_TABLE_CONFIG)
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

  const updateTableConfig = (key, val) => {
    setTableConfig((prev) => {
      return {
        ...prev,
        isChanged: true,
        [key]: val
      }
    })
  }

  // Fetch files
  const getFiles = (doLog = true) => {
    const payload = {
      tableConfig: tableConfig
    }
    try {
      window.api
        .sqlBridge('getFiles', payload)
        .then((res) => {
          if (res.success) {
            if (doLog) {
              updateSqlSettings('log', 'File fetch success', true)
            }
            setFileList(res.data.fileList)
            updateTableConfig('totalRows', res.data.totalRows)
            updateTableConfig('isChanged', false)
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
  const isChangedClass = tableConfig.isChanged ? 'text-red-600 hover:text-red-500' : 'text-white hover:text-gray-200'

  return (
    pageVisible && (
      <Fragment>
        {/* Left File */}
        <LeftIsland>
          <StaticModal
            open={modalOpen}
            setOpen={setModalOpen}
            title={modalTitle}
            content={modalContentList[modalContentKey]}
            closeOnClick={true}
          />
          <button className={` ${isChangedClass} rounded font-bold border border-slate-500 hover:border-slate-400  transition-all h-fit w-full p-2 `} onClick={getFiles}>
            Refresh Data <div className='text-sm'>{`${tableConfig.isChanged ? '(Changes)' : ''}`}</div>
          </button>
          <div className="underline mt-2">Filters</div>
          <FormInput
            label="Name"
            type="text"
            name="filter_name"
            value={tableConfig.filterName}
            onChange={(e) => {
              updateTableConfig('filterName', e.target.value)
            }}
          />
          <FormInput
            label="Extension"
            type="text"
            name="filter_extension"
            value={tableConfig.filterExtension}
            onChange={(e) => {
              updateTableConfig('filterExtension', e.target.value)
            }}
          />
        </LeftIsland>
        {/* Right File */}
        <div className="flex flex-col flex-1 gap-4">
          <NavBar currPage={currPage} setCurrPage={setCurrPage} />
          <div className="flex flex-1 paragraph island overflow-auto">
            <FilesTable
              fileList={fileList}
              dropdownElems={dropdownElems}
              tableConfig={tableConfig}
              updateTableConfig={updateTableConfig}
              getFiles={getFiles}
            />
          </div>
        </div>
      </Fragment>
    )
  )
}
