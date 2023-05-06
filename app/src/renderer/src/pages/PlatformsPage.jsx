import { Fragment, useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import { INIT_PLATFORM, PAGES } from '../utils/constants'
import { useSqlSettings, useSqlSettingsUpdate } from '../context/SqlContext'
import DarkTable from '../components/Table'
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
  const [modalContent, setModalContent] = useState()
  const [modalTitle, setModalTitle] = useState("")
  const [platformHolder, setPlatformHolder] = useState({...INIT_PLATFORM})


  const toggleModalOpen = () => setModalOpen(!modalOpen)
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
  const getPlatforms = () => {
    const payload = {}
    try {
      window.api
        .sqlBridge('getPlatforms', payload)
        .then((res) => {
          if (res.success) {
            updateSqlSettings('log', 'Platform fetch success')
            setPlatformList(res.data)
          } else {
            useState([])
            // setResMsg('Platform fetch failed')
            updateSqlSettings('log', 'Platform fetch failed')
            console.error('Platform fetch failed')
          }
        })
        .catch((reason) => {
          setResMsg(reason)
        })
    } catch (e) {
      console.error('Sql Bridge access error')
      updateSqlSettings('log', 'Sql Bridge access error')
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
            updateSqlSettings('log', 'Platform created')
            getPlatforms()
          } else {
            updateSqlSettings('log', 'Platform creation failed')
          }
          setModalOpen(false)
        })
        .catch((reason) => {
          setResMsg(reason)
        })
    } catch (e) {
      updateSqlSettings('log', 'Sql Bridge access error')
      setModalOpen(false)
    }
  }

  // Only trigger if pageVisible changes
  useEffect(() => {
    if (pageVisible && sqlSettings.connected) {
      getPlatforms()
    }
  }, [pageVisible])

  const newPlatformContent = (
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
        <div className={`btn w-full flex justify-center items-center text-center m-0`}>
          <h1>{resMsg}</h1>
        </div>
        <h1 className={`overflow-auto max-w-[200px] m-0 text-center`}>{resMsg}</h1>
      </div>
    </form>
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
            title={'New Platform'}
            content={modalContent}
          >
            <button
              className={`btn h-fit w-full p-2`}
              onClick={() => {
                setModalContent(newPlatformContent)
                setModalOpen(true)
                setModalTitle("New Platform")
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
            {platformList && platformList.length && (
              <DarkTable headers={Object.keys(platformList[0])} list={platformList} />
            )}
          </div>
        </div>
      </Fragment>
    )
  )
}
