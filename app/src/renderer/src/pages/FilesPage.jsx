import { Fragment } from 'react'
import NavBar from '../components/NavBar'
import FileDialog from '../components/fileDialog'
import Logo from '../components/logo'
import { PAGES } from '../utils/constants'

export default function FilesPage({ currPage, setCurrPage }) {
  const pageVisible = currPage === PAGES.FILES
  return (
    pageVisible && (
      <Fragment>
        <div className="flex flex-col w-[200px] island gap-2">
          <Logo />
          <div className="m-3 p-0 border-b-2 border-b-black"></div>
        </div>
        {/* Right Group */}
        <div className="flex flex-col flex-1 gap-4">
          <NavBar currPage={currPage} setCurrPage={setCurrPage}/>
          <div className="flex flex-1 overflow-y-auto paragraph island">
            <FileDialog />
          </div>
        </div>
      </Fragment>
    )
  )
}
