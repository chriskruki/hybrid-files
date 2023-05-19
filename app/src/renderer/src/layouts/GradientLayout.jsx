import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faHistory } from '@fortawesome/free-solid-svg-icons'
import Modal from '../components/Modal'
import { useSqlSettings, useSqlSettingsUpdate } from '../context/SqlContext'
import { useEffect, useState } from 'react'
import FormInput from '../components/FormInput'

export default function GradientLayout({ children }) {
  const sqlSettings = useSqlSettings()
  const updateSqlSettings = useSqlSettingsUpdate()
  const [fadeIn, setFadeIn] = useState(false)

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
          if (res.success) {
            updateSqlSettings('log', 'SQL Connection Success', true)
          } else {
            updateSqlSettings('log', 'SQL Connection Failed', false)
          }
        })
        .catch((res) => {
          updateSqlSettings('connected', false)
          updateSqlSettings('status', 'Disconnected')
          updateSqlSettings('resMsg', `${res}`)
          updateSqlSettings('log', 'SQL Connection Failed', false)
        })
    } catch (err) {
      updateSqlSettings('connected', false)
      updateSqlSettings('status', 'Disconnected')
      updateSqlSettings('resMsg', `${err}`)
      updateSqlSettings('log', 'SQL Connection Failed', false)
    }
  }

  const statusTextColor = sqlSettings.connected ? 'text-green-400' : 'text-red-400'
  const statusBgColor = sqlSettings.connected ? 'bg-green-700' : 'bg-red-700'

  // Request connection with default settings once
  useEffect(() => {
    requestConnection()
  }, [])

  // Handle log fade in
  useEffect(() => {
    setFadeIn(true)
    const id = setTimeout(() => {
      setFadeIn(false)
    }, 500)

    return () => {
      clearTimeout(id)
    }
  }, [sqlSettings.log])

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
          label="Password"
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
    <div className="w-full h-full flex flex-col bg-gradient-to-t from-sky-900 to-sky-500">
      <div className="flex-1 flex p-4 gap-4 h-full overflow-auto">{children}</div>
      {/* Bottom Bar */}
      <div className="w-full h-[35px] bg-gray-800 flex justify-between items-center py-0">
        {/* Log Section */}
        <div className="flex h-full gap-2 m-0 py-1 items-center overflow-hidden">
          <FontAwesomeIcon icon={faHistory} className="pl-2" />
          {sqlSettings.log.map((logItem, idx) => {
            var fade
            // Cannot do string interpolation with tailwind styles
            switch (idx) {
              case 0:
                fade = 'opacity-100'
                break
              case 1:
                fade = 'opacity-80'
                break
              case 2:
                fade = 'opacity-60'
                break
              case 3:
                fade = 'opacity-40'
                break
              case 4:
                fade = 'opacity-20'
                break
              case 5:
                fade = 'opacity-10'
                break
              default:
                'opacity-100'
            }

            return (
              <div
                key={idx}
                className={`font-light font-sm p-1 border-l border-r rounded transition-all cursor-default
                  ${fade} hover:opacity-100
                  ${logItem.success ? 'bg-green-700/75' : 'bg-red-700/75'}
                  ${fadeIn && idx !== 0 ? 'drop-in' : ''}
                  ${fadeIn && idx === 0 ? 'zoom-in' : ''}
                `}
                // style={{ opacity: fade }}
              >
                {logItem.value}
              </div>
            )
          })}
        </div>
        {/* SQL Status Section */}
        <div className="flex justify-center items-center h-full">
          {/* SQL Status */}
          <div
            className={`h-full text-s px-2 flex items-center hover:bg-gray-700 cursor-default transition-all ${statusTextColor}`}
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
    </div>
  )
}
