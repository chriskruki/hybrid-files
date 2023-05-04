import { useState } from 'react'
import { PAGES } from './utils/constants'
import { SqlSettingsProvider } from './context/SqlContext'

import FilesPage from './pages/FilesPage'
import LoginPage from './pages/LoginPage'
import ProvidersPage from './pages/ProvidersPage'
import JobsPage from './pages/JobsPage'
import GradientLayout from './layouts/GradientLayout'

function App() {
  const [currPage, setCurrPage] = useState(PAGES.LOGIN)

  return (
    <SqlSettingsProvider>
      <GradientLayout>
        <LoginPage currPage={currPage} setCurrPage={setCurrPage} />
        <FilesPage currPage={currPage} setCurrPage={setCurrPage} />
        <JobsPage currPage={currPage} setCurrPage={setCurrPage} />
        <ProvidersPage currPage={currPage} setCurrPage={setCurrPage} />
      </GradientLayout>
    </SqlSettingsProvider>
  )
}
export default App
