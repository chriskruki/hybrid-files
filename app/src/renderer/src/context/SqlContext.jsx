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
    username: 'root',
    password: 'cpsc408',
    host: 'localhost',
    database: 'hybridfiles',
    connected: false,
    status: 'Not Initialized',
    resMsg: '',
    log: [],
  })

  const updateSqlSettings = (key, value) => {
    var newVal = value
    if (!(key in sqlSettings)) {
      console.error(`Key [${key}] error in sqlSettings update`)
    }
    if (key === "log") {
      newVal = [...sqlSettings.log]
      if (sqlSettings.log.length > 2) {
        newVal.pop()
        console.log(`After pop: ${newVal}`)
      }
      newVal.unshift(`${value}`)
      console.log(`After unshift: ${newVal}`)
    }
    setSqlSettings((prev) => {
      return {
        ...prev,
        [key]: newVal
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
