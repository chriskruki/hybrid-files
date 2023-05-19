import { Fragment, useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import { INIT_GROUP, PAGES } from '../utils/constants'
import { useSqlSettings, useSqlSettingsUpdate } from '../context/SqlContext'
import DarkTable from '../components/tables/HyTable'
import LeftIsland from '../components/LeftIsland'
import StaticModal from '../components/StaticModal'
import FormInput from '../components/FormInput'
import GroupsTable from '../components/tables/GroupsTable'
import RowDropdown from '../components/RowDropdown'

export default function GroupsPage({ currPage, setCurrPage }) {
  const pageVisible = currPage === PAGES.GROUPS
  const sqlSettings = useSqlSettings()
  const updateSqlSettings = useSqlSettingsUpdate()
  const [groupList, setgroupList] = useState([])
  const [resMsg, setResMsg] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalContentKey, setModalContentKey] = useState()
  const [modalTitle, setModalTitle] = useState('')
  const [groupHolder, setGroupHolder] = useState(INIT_GROUP)

  // Only trigger if pageVisible changes
  useEffect(() => {
    if (pageVisible && sqlSettings.connected) {
      getGroups(true)
    }
  }, [pageVisible])

  // Reset to inital blank values
  const resetGroupHolder = () => {
    setGroupHolder(INIT_GROUP)
    setResMsg('')
  }

  const updateGroupHolder = (key, val) => {
    if (!(key in groupHolder)) {
      console.error(`Key [${key}] error in group holder update`)
    }
    setGroupHolder((prev) => {
      return {
        ...prev,
        [key]: val
      }
    })
  }

  // Fetch all platforms and store in groupList
  const getGroups = (doLog) => {
    const payload = {}
    try {
      window.api
        .sqlBridge('getGroups', payload)
        .then((res) => {
          if (res.success) {
            if (doLog) {
              updateSqlSettings('log', 'Group fetch success', true)
            }
            setgroupList(res.data)
          } else {
            updateSqlSettings('log', 'Group fetch failed', false)
            console.error('Group fetch failed: ' + res.errMsg)
          }
        })
        .catch((reason) => {
          setResMsg(reason)
          updateSqlSettings('log', 'Group fetch error', false)
        })
    } catch (e) {
      updateSqlSettings('log', 'Sql Bridge access error', false)
    }
  }

  // Edit a group
  const editGroup = (e) => {
    e.preventDefault()
    const payload = groupHolder
    try {
      window.api
        .sqlBridge('editGroup', payload)
        .then((res) => {
          if (res.success) {
            updateSqlSettings('log', 'Group edit success', true)
            getGroups(false)
            setModalOpen(false)
            resetGroupHolder()
          } else {
            updateSqlSettings('log', 'Group edit failed', false)
            setResMsg(`Group edit failed: ${res.errMsg || ''}`)
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

  // Insert new group
  const insertGroup = (e) => {
    e.preventDefault()
    const payload = groupHolder
    try {
      window.api
        .sqlBridge('insertGroup', payload)
        .then((res) => {
          if (res.success) {
            updateSqlSettings('log', `Group ${payload.name} created`, true)
            getGroups(false)
            setModalOpen(false)
            resetGroupHolder()
          } else {
            setResMsg(`Group creation failed: ${res.errMsg || ''}`)
            updateSqlSettings('log', 'Group creation failed', false)
          }
        })
        .catch((reason) => {
          setResMsg(reason)
          updateSqlSettings('log', 'Group creation error', false)
        })
    } catch (e) {
      updateSqlSettings('log', 'Sql Bridge access error', false)
      setModalOpen(false)
    }
  }

  // Delete group
  const deleteGroup = (e) => {
    e.preventDefault()
    const payload = groupHolder
    try {
      window.api
        .sqlBridge('deleteGroup', payload)
        .then((res) => {
          if (res.success) {
            updateSqlSettings('log', `Group ${payload.name} deleted`, true)
            getGroups(false)
            setModalOpen(false)
            resetGroupHolder()
          } else {
            updateSqlSettings('log', 'Group deletion failed', false)
            setResMsg(`Group deletion failed: ${res.errMsg || ''}`)
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
    newGroupContent: (
      <form onSubmit={insertGroup}>
        <div className="grid grid-cols-1 max-w-[500px] gap-4">
          <FormInput
            label="Name"
            name="name"
            type="text"
            value={groupHolder.name}
            onChange={(e) => {
              updateGroupHolder('name', e.target.value)
            }}
          />
          <FormInput
            label="Description"
            name="name"
            type="text"
            value={groupHolder.description}
            onChange={(e) => {
              updateGroupHolder('description', e.target.value)
            }}
          />
          <button type="submit" className="fbtn p-2 w-full">
            Submit
          </button>
          <h1 className={`overflow-auto max-w-[200px] m-0 text-center`}>{resMsg}</h1>
        </div>
      </form>
    ),
    editGroupContent: (
      <form onSubmit={editGroup}>
        <div className="grid grid-cols-1 max-w-[500px] gap-4">
          <FormInput
            label="Name"
            name="name"
            type="text"
            value={groupHolder.name}
            onChange={(e) => {
              updateGroupHolder('name', e.target.value)
            }}
          />
          <FormInput
            label="Description"
            name="name"
            type="text"
            value={groupHolder.description}
            onChange={(e) => {
              updateGroupHolder('description', e.target.value)
            }}
          />
          <button type="submit" className="fbtn p-2 w-full">
            Submit
          </button>
          <h1 className={`overflow-auto max-w-[200px] m-0 text-center`}>{resMsg}</h1>
        </div>
      </form>
    ),
    deleteGroupContent: (
      <div className="flex flex-col max-w-[500px] gap-2">
        <div className="flex gap-2">
          <button className="btn p-2 w-full bg-green-600" onClick={deleteGroup}>
            Confirm
          </button>
          <button
            className="btn p-2 w-full bg-red-600"
            onClick={() => {
              setModalOpen(false)
              resetGroupHolder()
            }}
          >
            Cancel
          </button>
        </div>
        <div className="flex">
          <h1 className={`max-w-[200px] m-0 text-center`}>{resMsg}</h1>
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
          setModalContentKey('editGroupContent')
          setModalOpen(true)
          setModalTitle(`Edit Group '${rowInfo.name}'`)
          setGroupHolder(rowInfo)
        }}
      >
        Edit
      </button>
      <button
        className="btn w-full text-sm text-gray-300 border-sky-700 border rounded p-2 flex gap-2 justify-center items-center relative"
        onClick={() => {
          setResMsg('')
          setModalContentKey('deleteGroupContent')
          setModalOpen(true)
          setModalTitle(`Delete Group '${rowInfo.name}'?`)
          setGroupHolder(rowInfo)
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
          <button className={`btn h-fit w-full p-2`} onClick={getGroups}>
            Refresh Data
          </button>
          <StaticModal
            closeOnClick
            open={modalOpen}
            setOpen={setModalOpen}
            title={modalTitle}
            content={modalContentList[modalContentKey]}
          >
            <button
              className={`btn h-fit w-full p-2`}
              onClick={() => {
                resetGroupHolder()
                setModalContentKey('newGroupContent')
                setModalOpen(true)
                setModalTitle('New Group')
              }}
            >
              New Group
            </button>
          </StaticModal>
        </LeftIsland>
        {/* Right Group */}
        <div className="flex flex-col flex-1 gap-4">
          <NavBar currPage={currPage} setCurrPage={setCurrPage} />
          <div className="flex flex-1 overflow-y-auto paragraph island">
            <GroupsTable groupList={groupList} dropdownElems={dropdownElems} />
          </div>
        </div>
      </Fragment>
    )
  )
}
