import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faL } from '@fortawesome/free-solid-svg-icons'
import Modal from '../components/Modal'
import { useState } from 'react'

export default function GradientLayout({ children }) {
  const [sqlSettings, setSqlSettings] = useState({
    connected: false,
    username: '',
    password: ''
  })
  const updateSqlSettings = (key, value) => {
    if (!(key in sqlSettings)) {
      console.error(`Bad key access in SQL Settings update. Key: ${key}`)
    }
    setSqlSettings((prev) => {
      return {
        ...prev,
        [key]: value
      }
    })
  }

  const content = (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2">
        {/* Username */}
        <div>
          <label
            htmlFor="mysql_username"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            MySQL Username
          </label>
          <input
            type="text"
            name="mysql_username"
            id="mysql_username"
            className="rounded-lg block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="BoatyMcBoatFace"
            required=""
            value={sqlSettings.username}
            onChange={(e) => {
              updateSqlSettings('username', e.target.value)
            }}
          />
        </div>
        {/* Password */}
        <div>
          <label
            htmlFor="mysql_password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            MySQL Username
          </label>
          <input
            type="password"
            name="mysql_password"
            id="mysql_password"
            className="rounded-lg block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="••••••••"
            required=""
            value={sqlSettings.password}
            onChange={(e) => {
              updateSqlSettings('password', e.target.value)
            }}
          />
        </div>
      </div>
      {JSON.stringify(sqlSettings)}
    </div>
  )

  return (
    <div className={`w-full h-full flex flex-col bg-gradient-to-t from-sky-600 to-sky-800`}>
      <div className="flex-1">{children}</div>
      <div className="w-full h-[25px] bg-gray-800 flex justify-end items-center text-xs">
        <div className="h-full px-2 flex items-center hover:bg-gray-700 cursor-default transition-all">
          MySQL Server disconnected
        </div>
        <Modal title={'MySQL Settings'} content={content}>
          {(toggleOpen) => (
            <div
              onClick={toggleOpen}
              className="h-full px-2 flex items-center hover:bg-gray-700 cursor-pointer transition-all"
            >
              <FontAwesomeIcon icon={faGear} />
            </div>
          )}
        </Modal>
      </div>
    </div>
  )
}
