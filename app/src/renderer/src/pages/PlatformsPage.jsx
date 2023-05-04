import { Fragment, useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import { PAGES } from '../utils/constants'
import { useSqlSettings } from '../context/SqlContext'
import DarkTable from '../components/Table'
import LeftIsland from '../components/LeftIsland'
import Modal from '../components/Modal'
import FormInput from '../components/FormInput'

export default function PlatformsPage({ currPage, setCurrPage }) {
  const sqlSettings = useSqlSettings()
  const [resMsg, setResMsg] = useState('') // Create res msg in bottom bar?
  const [platformList, setPlatformList] = useState([]) // Create res msg in bottom bar?
  const [newPlatform, setNewPlatform] = useState({
    name: '',
    type: '',
    schema: '',
    status: '',
    auth_id: '',
    auth_pass: '',
    reqMsg: '',
    reqInProg: false,
    reqSuccess: false
  })
  const updateNewPlatform = (key, val) => {
    if (!(key in newPlatform)) {
      console.error(`Key [${key}] error in newPlatform update`)
    }
    setNewPlatform((prev) => {
      return {
        ...prev,
        [key]: val
      }
    })
  }
  const pageVisible = currPage === PAGES.PLATFORMS

  const getPlatforms = () => {
    const payload = {}
    try {
      window.api
        .sqlBridge('getPlatforms', payload)
        .then((res) => {
          if (res.success) {
            console.log(res.data)
            setPlatformList(res.data)
          } else {
            useState([])
            setResMsg('Platform fetch failed')
            console.error('Platform fetch failed')
          }
        })
        .catch((reason) => {
          setResMsg(reason)
        })
    } catch (e) {
      console.error('Sql Bridge access error')
    }
  }

  const insertPlatform = (e) => {
    e.preventDefault()
    const payload = newPlatform
    try {
      window.api
        .sqlBridge('insertPlatform', payload)
        .then((res) => {
          if (res.success) {
            console.log(res.data)
            setResMsg('Platform created')
          } else {
            setResMsg('Platform failed to create')
            console.error('Platform failed to create')
          }
        })
        .catch((reason) => {
          setResMsg(reason)
        })
    } catch (e) {
      console.error('Sql Bridge access error')
    }
  }

  // Only trigger if pageVisible changes
  useEffect(() => {
    if (pageVisible && sqlSettings.connected) {
      getPlatforms()
    }
  }, [pageVisible])

  return (
    pageVisible && (
      <Fragment>
        {/* Left Group */}
        <LeftIsland>
          <button className={`btn h-fit w-full p-2`} onClick={getPlatforms}>
            Refresh Data
          </button>
          <Modal
            title={'New Platform'}
            content={
              <form onSubmit={insertPlatform}>
                <div className="grid grid-cols-1 max-w-[500px] gap-4">
                  <FormInput
                    label="Name"
                    hint="Name of the platform - anything"
                    name="name"
                    type="text"
                    value={newPlatform.name}
                    onChange={(e) => {
                      updateNewPlatform('name', e.target.value)
                    }}
                  />
                  <FormInput
                    label="Type"
                    hint="Type of Platform (local, cloud)"
                    name="type"
                    type="text"
                    value={newPlatform.type}
                    onChange={(e) => {
                      updateNewPlatform('type', e.target.value)
                    }}
                  />
                  <FormInput
                    label="Schema"
                    hint="Schema for URI (Ex. file://) - exclude '://'"
                    name="schema"
                    type="text"
                    value={newPlatform.schema}
                    onChange={(e) => {
                      updateNewPlatform('schema', e.target.value)
                    }}
                  />
                  <FormInput
                    label="Status"
                    hint="Status of the platform (active, unactive)"
                    name="status"
                    type="text"
                    value={newPlatform.status}
                    onChange={(e) => {
                      updateNewPlatform('status', e.target.value)
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
            }
          >
            {(toggleOpen) => (
              <button className={`btn h-fit w-full p-2`} onClick={toggleOpen}>
                New Platform
              </button>
            )}
          </Modal>
        </LeftIsland>
        {/* Right Group */}
        <div className="flex flex-col flex-1 gap-4">
          <NavBar currPage={currPage} setCurrPage={setCurrPage} />
          <div className="flex flex-1 overflow-y-auto paragraph island">
            {resMsg}
            {platformList && platformList.length && (
              <DarkTable headers={Object.keys(platformList[0])} list={platformList} />
            )}
          </div>
        </div>
      </Fragment>
    )
  )
}
