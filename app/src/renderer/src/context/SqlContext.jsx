import React, { useContext, useState } from 'react'

const SqlSettingsContext = React.createContext('default')
const SqlSettingsUpdateContext = React.createContext('default')

export function useSqlSettings() {
  return useContext(SqlSettingsContext)
}
export function useSqlSettingsUpdate() {
  return useContext(SqlSettingsUpdateContext)
}
export function SqlSettingsProvider({ children }) {
  const [sqlSettings, setSqlSettings] = useState({
    connected: false,
    status: 'Not Initialized',
    username: 'root',
    password: '',
    resMsg: ''
  })

  const updateSqlSettings = (key, value) => {
    if (!(key in sqlSettings)) {
      console.error(`Key [${key}] error in sqlSettings update`)
    }
    setSqlSettings((prev) => {
      return {
        ...prev,
        [key]: value
      }
    })
  }

  return (
    <SqlSettingsContext.Provider value={sqlSettings}>
      <SqlSettingsUpdateContext.Provider value={updateSqlSettings}>
        {children}
      </SqlSettingsUpdateContext.Provider>
    </SqlSettingsContext.Provider>
  )
}
