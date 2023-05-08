import { Fragment, useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import { INIT_JOB, INIT_PLATFORM, PAGES } from '../utils/constants'
import { useSqlSettings, useSqlSettingsUpdate } from '../context/SqlContext'
import LeftIsland from '../components/LeftIsland'
import StaticModal from '../components/StaticModal'
import FormInput from '../components/FormInput'
import PlatformsTable from '../components/PlatformsTable'
import RowDropdown from '../components/RowDropdown'
import JobsTable from '../components/JobsTable'
import FormSelect from '../components/FormSelect'
import FileDialog from '../components/fileDialog'

export default function JobsPage({ currPage, setCurrPage }) {
  const pageVisible = currPage === PAGES.JOBS
  const sqlSettings = useSqlSettings()
  const updateSqlSettings = useSqlSettingsUpdate()

  const [jobList, setJobList] = useState([])
  const [jobHolder, setJobHolder] = useState(INIT_JOB)
  const [resMsg, setResMsg] = useState('')
  const [localPlatformList, setPlatformList] = useState([])

  const [modalOpen, setModalOpen] = useState(false)
  const [modalContentKey, setModalContentKey] = useState()
  const [modalTitle, setModalTitle] = useState('')

  // Only trigger if pageVisible changes
  useEffect(() => {
    if (pageVisible && sqlSettings.connected) {
      getJobs(true)
      getLocalPlatforms()
    }
  }, [pageVisible])

  // Reset to inital blank values
  const resetJobHolder = () => {
    setJobHolder(INIT_PLATFORM)
  }

  const updateJobHolder = (key, val) => {
    if (!(key in jobHolder)) {
      console.error(`Key [${key}] error in jobHolder update`)
    }
    setJobHolder((prev) => {
      return {
        ...prev,
        [key]: val
      }
    })
  }

  // Fetch local platforms for choices
  const getLocalPlatforms = async () => {
    const payload = {
      type: 'local'
    }
    try {
      const res = await window.api.sqlBridge('getLocalPlatforms', payload)
      if (res.success) {
        setPlatformList(res.data)
        console.log(res)
      }
    } catch (e) {
      console.error('Sql Bridge access error')
      updateSqlSettings('log', 'Sql Bridge access error', false)
    }
  }

  // Fetch all platforms and store in jobList
  const getJobs = (doLog) => {
    const payload = {}
    try {
      window.api
        .sqlBridge('getJobs', payload)
        .then((res) => {
          if (res.success) {
            if (doLog) {
              updateSqlSettings('log', 'Job fetch success', true)
            }
            setJobList(res.data)
          } else {
            setResMsg('Job fetch failed')
            updateSqlSettings('log', 'Job fetch failed', false)
            console.error('Job fetch failed: ' + res.errMsg)
          }
        })
        .catch((reason) => {
          setResMsg(reason)
          updateSqlSettings('log', 'Job fetch error', false)
        })
    } catch (e) {
      console.error('Sql Bridge access error')
      updateSqlSettings('log', 'Sql Bridge access error', false)
    }
  }

  // Edit a platform
  const editPlaform = (e) => {
    e.preventDefault()
    const payload = jobHolder
    try {
      window.api
        .sqlBridge('editPlatform', payload)
        .then((res) => {
          if (res.success) {
            updateSqlSettings('log', 'Job edit success', true)
            getJobs(false)
            setModalOpen(false)
            resetJobHolder()
          } else {
            updateSqlSettings('log', 'Job edit failed', false)
            setResMsg(`Job edit failed: ${res.errMsg}`)
          }
        })
        .catch((reason) => {
          setResMsg(reason)
        })
    } catch (e) {
      updateSqlSettings('log', 'Sql Bridge access error', false)
      setModalOpen(false)
    }
  }

  // Insert new platform
  const insertJob = (e) => {
    e.preventDefault()
    const payload = jobHolder
    try {
      window.api
        .sqlBridge('insertJob', payload)
        .then((res) => {
          if (res.success) {
            updateSqlSettings('log', `Job ${payload.name} created`, true)
            getJobs(false)
            setModalOpen(false)
            resetJobHolder()
          } else {
            updateSqlSettings('log', 'Job creation failed', false)
            setResMsg(`Job creation failed: ${res.errMsg}`)
          }
        })
        .catch((reason) => {
          setResMsg(reason)
        })
    } catch (e) {
      updateSqlSettings('log', 'Sql Bridge access error', false)
      setModalOpen(false)
    }
  }

  // Store modal contents in list for refernce (breaks if using state)
  const modalContentList = {
    newJobContent: (
      <div className="flex flex-col justify-center items-center max-w-[500px]">
        {/* Basic Info Section */}
        <div className="grid grid-cols-2 w-full gap-4 justify-center items-start">
          <FormInput
            label="Name"
            hint="Name of the platform"
            name="name"
            type="text"
            value={jobHolder.name}
            onChange={(e) => {
              updateJobHolder('name', e.target.value)
            }}
          />
          <FormSelect
            label={'Type'}
            name={'job_type'}
            value={jobHolder.type}
            onChange={(e) => {
              e.preventDefault()
              updateJobHolder('type', e.target.value)
            }}
            options={
              <Fragment>
                <option selected></option>
                <option value="local_index">Local Index</option>
                <option disabled value="platform_transition">
                  Platform Transition
                </option>
              </Fragment>
            }
          />
          <h1 className={`overflow-auto max-w-[200px] m-0 text-center`}>{resMsg}</h1>
        </div>
        {/* Local Index Section */}
        {jobHolder.type === 'local_index' && (
          <div className="w-full fade-in flex justify-between items-center gap-2">
            <FormSelect
              label="Src Platform"
              hint="Name of the platform"
              name="name"
              value={jobHolder.src_platform}
              className='w-1/2 h-full'
              onChange={(e) => {
                updateJobHolder('name', e.target.value)
              }}
              options={localPlatformList.map((val) => {
                return (
                  <option key={val.platform_id} value={val.platform_id}>{val.name}</option>
                )
              })}
            />
            <FileDialog className='w-1/2' label={'Choose Directory'} />
          </div>
        )}
        <div className="w-1/2 h-full">
          <button type="submit" className="fbtn p-2 w-full">
            Stage
          </button>
        </div>
      </div>
    )
  }

  const dropdownElems = (rowInfo) => (
    <RowDropdown>
      <button
        className="btn w-full text-sm text-gray-300 border-sky-700 border rounded p-2 flex gap-2 justify-center items-center relative"
        onClick={() => {
          setResMsg('')
          setModalContentKey('editPlatformContent')
          setModalOpen(true)
          setModalTitle(`Edit Job '${rowInfo.name}'`)
          setJobHolder(rowInfo)
        }}
      >
        Edit
      </button>
      <button
        className="btn w-full text-sm text-gray-300 border-sky-700 border rounded p-2 flex gap-2 justify-center items-center relative"
        onClick={() => {
          setResMsg('')
          setModalContentKey('deletePlaformContent')
          setModalOpen(true)
          setModalTitle(`Delete Job '${rowInfo.name}'?`)
          setJobHolder(rowInfo)
        }}
      >
        Delete
      </button>
    </RowDropdown>
  )

  return (
    pageVisible && (
      <Fragment>
        {/* Left Group */}
        <LeftIsland>
          <button className={`btn h-fit w-full p-2`} onClick={getJobs}>
            Refresh Data
          </button>
          <StaticModal
            open={modalOpen}
            setOpen={setModalOpen}
            title={modalTitle}
            content={modalContentList[modalContentKey]}
          >
            <button
              className={`btn h-fit w-full p-2`}
              onClick={() => {
                resetJobHolder()
                setModalContentKey('newJobContent')
                setModalOpen(true)
                setModalTitle('New Job')
              }}
            >
              New Job
            </button>
          </StaticModal>
        </LeftIsland>
        {/* Right Group */}
        <div className="flex flex-col flex-1 gap-4">
          <NavBar currPage={currPage} setCurrPage={setCurrPage} />
          <div className="flex flex-1 overflow-y-auto paragraph island">
            <JobsTable jobList={jobList} dropdownElems={dropdownElems} />
          </div>
        </div>
      </Fragment>
    )
  )
}
