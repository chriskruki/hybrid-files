import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import Modal from '../components/Modal'
import { useSqlSettings, useSqlSettingsUpdate } from '../context/SqlContext'
import { useEffect } from 'react'
import FormInput from '../components/FormInput'

export default function GradientLayout({ children }) {
  const sqlSettings = useSqlSettings()
  const updateSqlSettings = useSqlSettingsUpdate()

  // Request MySQL Connection using credentials
  const requestConnection = (e) => {
    if (e) e.preventDefault()
    updateSqlSettings('resMsg', 'Attempting to connect')
    updateSqlSettings('connected', false)
    try {
      window.api
        .sqlBridge('establishCon', sqlSettings)
        .then((res) => {
          updateSqlSettings('connected', res.success)
          updateSqlSettings('resMsg', `${res.msg}`)
          updateSqlSettings('status', res.success ? 'Connected' : 'Disconnected')
        })
        .catch((res) => {
          updateSqlSettings('connected', false)
          updateSqlSettings('status', 'Disconnected')
          updateSqlSettings('resMsg', `${res}`)
        })
    } catch (err) {
      updateSqlSettings('connected', false)
      updateSqlSettings('status', 'Disconnected')
      updateSqlSettings('resMsg', `${err}`)
    }
  }

  const statusTextColor = sqlSettings.connected ? 'text-green-400' : 'text-red-400'
  const statusBgColor = sqlSettings.connected ? 'bg-green-700' : 'bg-red-700'

  useEffect(() => {
    requestConnection()
  }, [])

  const settingsContent = (
    <form onSubmit={requestConnection}>
      <div className="flex flex-col gap-2 justify-center items-center">
        {/* Host */}
        <FormInput
          label="Host"
          type="text"
          name="mysql_host"
          value={sqlSettings.host}
          onChange={(e) => {
            updateSqlSettings('host', e.target.value)
          }}
        />
        {/* Database */}
        <FormInput
          label="Database / Schema"
          type="text"
          name="mysql_database"
          value={sqlSettings.database}
          onChange={(e) => {
            updateSqlSettings('database', e.target.value)
          }}
        />

        {/* Username */}
        <FormInput
          label="Username"
          type="text"
          name="mysql_username"
          value={sqlSettings.username}
          onChange={(e) => {
            updateSqlSettings('username', e.target.value)
          }}
        />
        {/* Password */}
        <FormInput
          type="password"
          name="mysql_password"
          placeholder="••••••••"
          value={sqlSettings.password}
          onChange={(e) => {
            updateSqlSettings('password', e.target.value)
          }}
        />

        <button type="submit" className="fbtn p-2 w-full">
          {sqlSettings.connected ? 'Refresh' : 'Connect'}
        </button>
        <div
          className={`btn w-full flex justify-center items-center text-center m-0 ${statusBgColor}`}
        >
          <h1>{sqlSettings.status}</h1>
        </div>
        <h1 className={`${statusTextColor} overflow-auto max-w-[200px] m-0 text-center`}>
          {sqlSettings.resMsg}
        </h1>
      </div>
    </form>
  )

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-t from-sky-600 to-sky-800">
      <div className="flex-1 flex p-4 gap-4 h-full">{children}</div>
      {/* Bottom Bar */}
      <div className="w-full h-[35px] bg-gray-800 flex justify-end items-center text-s">
        {/* SQL Status */}
        <div
          className={`h-full px-2 flex items-center hover:bg-gray-700 cursor-default transition-all ${statusTextColor}`}
        >
          {sqlSettings.connected ? 'MySQL Server connected' : 'MySQL Server disconnected'}
        </div>
        {/* Gear Modal Toggle */}
        <Modal title={'MySQL Settings'} content={settingsContent}>
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
