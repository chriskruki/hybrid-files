import { useState } from 'react'
import { PAGES } from './utils/constants'
import { SqlSettingsProvider } from './context/SqlContext'

import FilesPage from './pages/FilesPage'
import LoginPage from './pages/LoginPage'
import PlatformsPage from './pages/PlatformsPage'
import JobsPage from './pages/JobsPage'
import UsersPage from './pages/UsersPage'
import GroupsPage from './pages/GroupsPage'
import GradientLayout from './layouts/GradientLayout'

function App() {
  const [currPage, setCurrPage] = useState(PAGES.JOBS)

  return (
    <SqlSettingsProvider>
      <GradientLayout>
        <LoginPage currPage={currPage} setCurrPage={setCurrPage} />
        <FilesPage currPage={currPage} setCurrPage={setCurrPage} />
        <JobsPage currPage={currPage} setCurrPage={setCurrPage} />
        <PlatformsPage currPage={currPage} setCurrPage={setCurrPage} />
        <UsersPage currPage={currPage} setCurrPage={setCurrPage} />
        <GroupsPage currPage={currPage} setCurrPage={setCurrPage} />
      </GradientLayout>
    </SqlSettingsProvider>
  )
}
export default App
