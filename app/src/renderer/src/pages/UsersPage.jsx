import { Fragment, useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import { INIT_USER, PAGES } from '../utils/constants'
import { useSqlSettings, useSqlSettingsUpdate } from '../context/SqlContext'
import LeftIsland from '../components/LeftIsland'
import StaticModal from '../components/StaticModal'
import FormInput from '../components/FormInput'
import RowDropdown from '../components/RowDropdown'
import UsersTable from '../components/UsersTable'

export default function UsersPage({ currPage, setCurrPage }) {
  const pageVisible = currPage === PAGES.USERS
  const sqlSettings = useSqlSettings()
  const updateSqlSettings = useSqlSettingsUpdate()
  const [resMsg, setResMsg] = useState('')
  const [userList, setUserList] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [modalContentKey, setModalContentKey] = useState()
  const [modalTitle, setModalTitle] = useState('')
  const [userHolder, setUserHolder] = useState(INIT_USER)

  // Only trigger if pageVisible changes
  useEffect(() => {
    if (pageVisible && sqlSettings.connected) {
      getUsers(true)
    }
  }, [pageVisible])

  // Reset to inital blank values
  const resetUserHolder = () => {
    setUserHolder(INIT_USER)
    setResMsg('')
  }

  const updateUserHolder = (key, val) => {
    if (!(key in userHolder)) {
      console.error(`Key [${key}] error in user holder update`)
    }
    setUserHolder((prev) => {
      return {
        ...prev,
        [key]: val
      }
    })
  }

  // Fetch all users and store in userList
  const getUsers = (doLog) => {
    const payload = {}
    try {
      window.api
        .sqlBridge('getUserGroups', payload)
        .then((res) => {
          if (res.success) {
            if (doLog) {
              updateSqlSettings('log', 'User fetch success', true)
            }
            setUserList(res.data)
          } else {
            updateSqlSettings('log', 'User fetch failed', false)
            console.error('User fetch failed: ' + res.errMsg)
          }
        })
        .catch((reason) => {
          setResMsg(reason)
          updateSqlSettings('log', 'User fetch error', false)
          console.error('User fetch failed: ' + reason)
        })
    } catch (e) {
      console.error('Sql Bridge access error')
      updateSqlSettings('log', 'Sql Bridge access error', false)
    }
  }

  // Edit a user
  const editUser = (e) => {
    e.preventDefault()
    const payload = userHolder
    try {
      window.api
        .sqlBridge('editUser', payload)
        .then((res) => {
          if (res.success) {
            updateSqlSettings('log', 'User edit success', true)
            getUsers(false)
            setModalOpen(false)
            resetUserHolder()
          } else {
            updateSqlSettings('log', 'User edit failed', false)
            setResMsg(`User edit failed: ${res.errMsg}`)
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

  // Insert new user
  const insertUser = (e) => {
    e.preventDefault()
    const payload = userHolder
    try {
      window.api
        .sqlBridge('insertUser', payload)
        .then((res) => {
          if (res.success) {
            updateSqlSettings('log', `User ${payload.username} created`, true)
            getUsers(false)
            setModalOpen(false)
            resetUserHolder()
          } else {
            updateSqlSettings('log', 'User creation failed', false)
            setResMsg(`User creation failed: ${res.errMsg}`)
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

  // Delete user
  const deleteUser = (e) => {
    e.preventDefault()
    const payload = userHolder
    try {
      window.api
        .sqlBridge('deleteUser', payload)
        .then((res) => {
          if (res.success) {
            updateSqlSettings('log', `User ${payload.username} deleted`, true)
            getUsers(false)
            setModalOpen(false)
            resetUserHolder()
          } else {
            updateSqlSettings('log', 'User deletion failed', false)
            setResMsg(`User deletion failed: ${res.errMsg}`)
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
    newUserContent: (
      <form onSubmit={insertUser}>
        <div className="grid grid-cols-1 max-w-[500px] gap-4">
          <FormInput
            label="Username"
            name="name"
            type="text"
            value={userHolder.username}
            onChange={(e) => {
              updateUserHolder('username', e.target.value)
            }}
          />
          <FormInput
            label="Password"
            name="name"
            type="text"
            value={userHolder.password}
            onChange={(e) => {
              updateUserHolder('password', e.target.value)
            }}
          />
          <button type="submit" className="fbtn p-2 w-full">
            Submit
          </button>
          <h1 className={`overflow-auto max-w-[200px] m-0 text-center`}>{resMsg}</h1>
        </div>
      </form>
    ),
    editUserContent: (
      <form onSubmit={editUser}>
        <div className="grid grid-cols-1 max-w-[500px] gap-4">
          <FormInput
            label="Username"
            name="name"
            type="text"
            value={userHolder.username}
            onChange={(e) => {
              updateUserHolder('username', e.target.value)
            }}
          />
          <FormInput
            label="Password"
            name="name"
            type="text"
            value={userHolder.password}
            onChange={(e) => {
              updateUserHolder('password', e.target.value)
            }}
          />
          <button type="submit" className="fbtn p-2 w-full">
            Submit
          </button>
          <h1 className={`max-w-[200px] m-0 text-center`}>{resMsg}</h1>
        </div>
      </form>
    ),
    deleteUserContent: (
      <div className="flex flex-col max-w-[500px] gap-2">
        <div className="flex gap-2">
          <button onClick={deleteUser} className="btn p-2 w-full bg-green-600">
            Confirm
          </button>
          <button
            onClick={() => {
              setModalOpen(false)
              resetUserHolder()
            }}
            className="btn p-2 w-full bg-red-600"
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
          setModalContentKey('editUserContent')
          setModalOpen(true)
          setModalTitle(`Edit User '${rowInfo.username}'`)
          setUserHolder(rowInfo)
        }}
      >
        Edit
      </button>
      <button
        className="btn w-full text-sm text-gray-300 border-sky-700 border rounded p-2 flex gap-2 justify-center items-center relative"
        onClick={() => {
          setModalContentKey('deleteUserContent')
          setModalOpen(true)
          setModalTitle(`Delete User '${rowInfo.username}'?`)
          setUserHolder(rowInfo)
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
          <button className={`btn h-fit w-full p-2`} onClick={getUsers}>
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
                resetUserHolder()
                setModalContentKey('newUserContent')
                setModalOpen(true)
                setModalTitle('New User')
              }}
            >
              New User
            </button>
          </StaticModal>
        </LeftIsland>
        {/* Right Group */}
        <div className="flex flex-col flex-1 gap-4">
          <NavBar currPage={currPage} setCurrPage={setCurrPage} />
          <div className="flex flex-1 overflow-auto paragraph island max-h-100">
            <UsersTable userList={userList} dropdownElems={dropdownElems}/>
          </div>
        </div>
      </Fragment>
    )
  )
}
