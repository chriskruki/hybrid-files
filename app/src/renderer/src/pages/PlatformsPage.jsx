import { Fragment, useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import { INIT_PLATFORM, PAGES } from '../utils/constants'
import { useSqlSettings, useSqlSettingsUpdate } from '../context/SqlContext'
import DarkTable from '../components/HyTable'
import LeftIsland from '../components/LeftIsland'
import StaticModal from '../components/StaticModal'
import FormInput from '../components/FormInput'

export default function PlatformsPage({ currPage, setCurrPage }) {
  const pageVisible = currPage === PAGES.PLATFORMS
  const sqlSettings = useSqlSettings()
  const updateSqlSettings = useSqlSettingsUpdate()
  const [resMsg, setResMsg] = useState('')
  const [platformList, setPlatformList] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [modalContentKey, setModalContentKey] = useState()
  const [modalTitle, setModalTitle] = useState('')
  const [platformHolder, setPlatformHolder] = useState(INIT_PLATFORM)

  const toggleModalOpen = () => setModalOpen(!modalOpen)

  // Reset to inital blank values
  const resetPlatformHolder = () => {
    setPlatformHolder(INIT_PLATFORM)
  }

  const updatePlatformHolder = (key, val) => {
    if (!(key in platformHolder)) {
      console.error(`Key [${key}] error in newPlatform update`)
    }
    setPlatformHolder((prev) => {
      return {
        ...prev,
        [key]: val
      }
    })
  }

  // Fetch all platforms and store in platformList
  const getPlatforms = (doLog) => {
    const payload = {}
    try {
      window.api
        .sqlBridge('getPlatforms', payload)
        .then((res) => {
          if (res.success) {
            if (doLog) {
              updateSqlSettings('log', 'Platform fetch success', true)
            }
            console.log(res.data)
            setPlatformList(res.data)
          } else {
            setResMsg('Platform fetch failed')
            updateSqlSettings('log', 'Platform fetch failed', false)
            console.error('Platform fetch failed: ' + res.errMsg)
          }
        })
        .catch((reason) => {
          setResMsg(reason)
          updateSqlSettings('log', 'Platform fetch error', false)
        })
    } catch (e) {
      console.error('Sql Bridge access error')
      updateSqlSettings('log', 'Sql Bridge access error', false)
    }
  }

  // Edit a platform
  const editPlaform = (e) => {
    e.preventDefault()
    const payload = platformHolder
    try {
      window.api
        .sqlBridge('editPlatform', payload)
        .then((res) => {
          if (res.success) {
            updateSqlSettings('log', 'Platform edit success', true)
            getPlatforms(false)
            setModalOpen(false)
            resetPlatformHolder()
          } else {
            updateSqlSettings('log', 'Platform edit failed', false)
            setResMsg(`Platform edit failed: ${res.errMsg}`)
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
  const insertPlatform = (e) => {
    e.preventDefault()
    const payload = platformHolder
    try {
      window.api
        .sqlBridge('insertPlatform', payload)
        .then((res) => {
          if (res.success) {
            updateSqlSettings('log', `Platform ${payload.name} created`, true)
            getPlatforms(false)
            setModalOpen(false)
            resetPlatformHolder()
          } else {
            updateSqlSettings('log', 'Platform creation failed', false)
            setResMsg(`Platform creation failed: ${res.errMsg}`)
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

  // Delete platform
  const deletePlatform = (e) => {
    e.preventDefault()
    const payload = platformHolder
    try {
      window.api
        .sqlBridge('deletePlatform', payload)
        .then((res) => {
          if (res.success) {
            updateSqlSettings('log', `Platform ${payload.name} deleted`, true)
            getPlatforms(false)
            setModalOpen(false)
            resetPlatformHolder()
          } else {
            updateSqlSettings('log', 'Platform deletion failed', false)
            setResMsg(`Platform deletion failed: ${res.errMsg}`)
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

  // Only trigger if pageVisible changes
  useEffect(() => {
    if (pageVisible && sqlSettings.connected) {
      getPlatforms(true)
    }
  }, [pageVisible])

  // Store modal contents in list for refernce (breaks if using state)
  const modalContentList = {
    newPlatformContent: (
      <form onSubmit={insertPlatform}>
        <div className="grid grid-cols-1 max-w-[500px] gap-4">
          <FormInput
            label="Name"
            hint="Name of the platform - anything"
            name="name"
            type="text"
            value={platformHolder.name}
            onChange={(e) => {
              updatePlatformHolder('name', e.target.value)
            }}
          />
          <FormInput
            label="Type"
            hint="Type of Platform (local, cloud)"
            name="type"
            type="text"
            value={platformHolder.type}
            onChange={(e) => {
              updatePlatformHolder('type', e.target.value)
            }}
          />
          <FormInput
            label="Schema"
            hint="Schema for URI (Ex. file://) - exclude '://'"
            name="schema"
            type="text"
            value={platformHolder.schema}
            onChange={(e) => {
              updatePlatformHolder('schema', e.target.value)
            }}
          />
          <FormInput
            label="Status"
            hint="Status of the platform (active, unactive)"
            name="status"
            type="text"
            value={platformHolder.status}
            onChange={(e) => {
              updatePlatformHolder('status', e.target.value)
            }}
          />

          <button type="submit" className="fbtn p-2 w-full">
            Submit
          </button>
          <h1 className={`overflow-auto max-w-[200px] m-0 text-center`}>{resMsg}</h1>
        </div>
      </form>
    ),
    editPlatformContent: (
      <form onSubmit={editPlaform}>
        <div className="grid grid-cols-1 max-w-[500px] gap-4">
          <FormInput
            label="Name"
            hint="Name of the platform - anything"
            name="name"
            type="text"
            value={platformHolder.name}
            onChange={(e) => {
              updatePlatformHolder('name', e.target.value)
            }}
          />
          <FormInput
            label="Type"
            hint="Type of Platform (local, cloud)"
            name="type"
            type="text"
            value={platformHolder.type}
            onChange={(e) => {
              updatePlatformHolder('type', e.target.value)
            }}
          />
          <FormInput
            label="Schema"
            hint="Schema for URI (Ex. file://) - exclude '://'"
            name="schema"
            type="text"
            value={platformHolder.schema}
            onChange={(e) => {
              updatePlatformHolder('schema', e.target.value)
            }}
          />
          <FormInput
            label="Status"
            hint="Status of the platform (active, unactive)"
            name="status"
            type="text"
            value={platformHolder.status}
            onChange={(e) => {
              updatePlatformHolder('status', e.target.value)
            }}
          />

          <button type="submit" className="fbtn p-2 w-full">
            Submit
          </button>
          <h1 className={`overflow-auto max-w-[200px] m-0 text-center`}>{resMsg}</h1>
        </div>
      </form>
    ),
    deletePlaformContent: (
      <div className="flex max-w-[500px] gap-2">
        <button onClick={deletePlatform} className="btn p-2 w-full bg-green-600">
          Confirm
        </button>
        <button
          onClick={() => {
            setModalOpen(false)
            resetPlatformHolder()
          }}
          className="btn p-2 w-full bg-red-600"
        >
          Cancel
        </button>
        <h1 className={`overflow-auto max-w-[200px] m-0 text-center`}>{resMsg}</h1>
      </div>
    )
  }

  const dropdownElems = (rowInfo) => (
    <Fragment>
      <button
        className="btn w-full text-sm text-gray-300 border-sky-700 border rounded p-2 flex gap-2 justify-center items-center relative"
        onClick={() => {
          setModalContentKey('editPlatformContent')
          setModalOpen(true)
          setModalTitle(`Edit Platform '${rowInfo.name}'`)
          setPlatformHolder(rowInfo)
        }}
      >
        Edit
      </button>
      <button
        className="btn w-full text-sm text-gray-300 border-sky-700 border rounded p-2 flex gap-2 justify-center items-center relative"
        onClick={() => {
          setModalContentKey('deletePlaformContent')
          setModalOpen(true)
          setModalTitle(`Delete Platform '${rowInfo.name}'?`)
          setPlatformHolder(rowInfo)
        }}
      >
        Delete
      </button>
    </Fragment>
  )

  return (
    pageVisible && (
      <Fragment>
        {/* Left Group */}
        <LeftIsland>
          <button className={`btn h-fit w-full p-2`} onClick={getPlatforms}>
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
                resetPlatformHolder()
                setModalContentKey('newPlatformContent')
                setModalOpen(true)
                setModalTitle('New Platform')
              }}
            >
              New Platform
            </button>
          </StaticModal>
        </LeftIsland>
        {/* Right Group */}
        <div className="flex flex-col flex-1 gap-4">
          <NavBar currPage={currPage} setCurrPage={setCurrPage} />
          <div className="flex flex-1 overflow-y-auto paragraph island">
            {platformList && platformList.length ? (
              <DarkTable
                headers={Object.keys(platformList[0])}
                list={platformList}
                dropdownElems={dropdownElems}
              />
            ) : 
            (
              <div>No data to show {`:(`}</div>
            )}
          </div>
        </div>
      </Fragment>
    )
  )
}
