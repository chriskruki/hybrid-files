import { Fragment, useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import { INIT_JOB, INIT_PLATFORM, MEDIA_TYPES, PAGES } from '../utils/constants'
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

export default function JobsPage({ currPage, setCurrPage }) {
  const pageVisible = currPage === PAGES.JOBS
  const sqlSettings = useSqlSettings()
  const updateSqlSettings = useSqlSettingsUpdate()

  const [jobList, setJobList] = useState([])
  const [jobHolder, setJobHolder] = useState(INIT_JOB)
  const [resMsg, setResMsg] = useState('')
  const [localPlatformList, setPlatformList] = useState([])
  const [groupList, setGroupList] = useState([])

  const [modalOpen, setModalOpen] = useState(false)
  const [modalContentKey, setModalContentKey] = useState()
  const [modalTitle, setModalTitle] = useState('')

  // Only trigger if pageVisible changes
  useEffect(() => {
    if (pageVisible && sqlSettings.connected) {
      getJobs(true)
      getLocalPlatforms()
      getGroups()
    }
  }, [pageVisible])

  // Reset to inital blank values
  const resetJobHolder = () => {
    setJobHolder(INIT_PLATFORM)
  }

  const updateJobHolder = (key, val) => {
    // if (!(key in jobHolder)) {
    //   console.error(`Key [${key}] error in jobHolder update`)
    // }
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
      } else {
        console.error('getLocalPlatforms failed')
      }
    } catch (e) {
      console.error('Sql Bridge access error')
      updateSqlSettings('log', 'Sql Bridge access error', false)
    }
  }

  // Fetch groups for choices
  const getGroups = async () => {
    const payload = {}
    try {
      const res = await window.api.sqlBridge('getGroups', payload)
      if (res.success) {
        setGroupList(res.data)
      } else {
        console.error('getGroups failed')
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
      return window.api
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

  // Edit a job - if not yet run
  const editJob = (e) => {
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

  // Insert new job
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

  const onNewJobSubmit = (e) => {
    e.preventDefault()
    setResMsg('')
    setModalContentKey('orchestrateLocalIndex')
    setModalOpen(true)
    setModalTitle(`Orchestrate Job`)
    updateJobHolder('fileTypes', MEDIA_TYPES)
  }

  // Store modal contents in list for refernce (breaks if using state)
  const modalContentList = {
    newJobContent: (
      <form onSubmit={onNewJobSubmit}>
        <div className="flex flex-col justify-center items-center max-w-[500px] gap-4">
          {/* Basic Info Section */}
          <div className="grid grid-cols-2 w-full gap-4 justify-center items-start">
            <FormInput
              label="Name"
              hint="Name of the job - custom"
              name="name"
              type="text"
              required
              value={jobHolder.name}
              onChange={(e) => {
                updateJobHolder('name', e.target.value)
              }}
            />
            <FormSelect
              label={'Type'}
              name={'job_type'}
              value={jobHolder.type}
              required
              onChange={(e) => {
                e.preventDefault()
                updateJobHolder('type', e.target.value)
              }}
              options={
                <Fragment>
                  <option></option>
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
            <div className="flex flex-col fade-in w-full h-full gap-4 ">
              <div className="w-full flex justify-between items-center gap-4">
                <FormSelect
                  label="Local Platform"
                  hint="Platform that files reside on"
                  name="src_platform"
                  className="w-1/2 h-full"
                  required
                  value={jobHolder.src_platform}
                  onChange={(e) => {
                    updateJobHolder('src_platform', e.target.value)
                  }}
                  options={localPlatformList.map((val) => {
                    return (
                      <option key={val.platform_id} value={val.platform_id}>
                        {val.name}
                      </option>
                    )
                  })}
                />
                <FormSelect
                  label="File Groups"
                  hint="Groups that can see the ingested files"
                  name="job_group"
                  required
                  className="w-1/2 h-full"
                  value={jobHolder.job_group}
                  onChange={(e) => {
                    updateJobHolder('job_group', e.target.value)
                  }}
                  options={groupList.map((val) => {
                    return (
                      <option key={val.group_id} value={val.group_id}>
                        {val.name}
                      </option>
                    )
                  })}
                />
              </div>
              {/* Media Types */}
              <div className="w-full">
                <label className="block text-sm mb-1 font-medium text-white">Media Types</label>
                <div className="flex justify-center rounded-lg w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white gap-1 overflow-auto">
                  {MEDIA_TYPES.map((val) => {
                    return (
                      <div key={val} className="rounded p-1 bg-gray-500">
                        {val}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
          {/* Submit Buttons */}
          <div className="flex gap-2 w-full h-full">
            <button
              className="fbtn p-2 w-full"
              onClick={(e) => {
                e.preventDefault()
                resetJobHolder()
                setModalOpen(false)
              }}
            >
              Cancel
            </button>
            <button type="submit" className="fbtn p-2 w-full">
              Next
            </button>
          </div>
        </div>
      </form>
    ),
    orchestrateLocalIndex: (
      <Fragment>
        <div
          className="absolute top-1 left-2 cursor-pointer hover:text-sky-400 transition-all"
          onClick={(e) => {
            e.preventDefault()
            setModalContentKey('newJobContent')
          }}
        >
          <FontAwesomeIcon icon={faArrowCircleLeft} />
        </div>
        <div className="flex flex-col justify-center items-center w-[750px] gap-4">
          <div className="flex gap-4 w-full justify-center items-center">
            <FileDialog
              className="w-1/2"
              label={'Directory'}
              jobHolder={jobHolder}
              updateJobHolder={updateJobHolder}
              required
            />
            <button
              className="fbtn p-2 h-fit w-fit"
              onClick={async (e) => {
                console.log(jobHolder.fileTypes)
                const res = await window.api.readDir(
                  jobHolder.src_path,
                  jobHolder.fileTypes,
                  jobHolder.dirRecursive
                )
                updateJobHolder('fileList', res.data)
              }}
            >
              Load Files
            </button>
          </div>
          <div className="p-1 border border-gray-600">
            {jobHolder.fileList && jobHolder.fileList.length} files
          </div>
          <div className="flex flex-col overflow-auto relative max-w-full max-h-[300px] border-2 p-2 border-gray-800 rounded overflow">
            <FilePreviewTable dataList={jobHolder.fileList ? jobHolder.fileList : []} />
          </div>
          {/* Bottom Buttons */}
          <div className="flex gap-2 w-1/2">
            <button
              className="fbtn p-2 flex-1"
              onClick={(e) => {
                e.preventDefault()
                resetJobHolder()
                setModalOpen(false)
              }}
            >
              Cancel
            </button>
            <button type="submit" className="fbtn p-2 flex-1">
              Commit
            </button>
          </div>
        </div>
      </Fragment>
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
