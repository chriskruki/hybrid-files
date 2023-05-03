import NavBar from '../components/NavBar'
import FileDialog from '../components/fileDialog'
import Logo from '../components/logo'
import GradientLayout from '../layouts/GradientLayout'
import { PAGES } from '../utils/constants'

export default function JobsPage({ currPage, setCurrPage }) {
  const pageVisible = currPage === PAGES.JOBS
  return (
    pageVisible && (
      <GradientLayout visible={pageVisible}>
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
      </GradientLayout>
    )
  )
}
