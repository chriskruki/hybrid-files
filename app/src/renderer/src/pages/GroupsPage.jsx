import { Fragment } from 'react'
import NavBar from '../components/NavBar'
import Logo from '../components/logo'
import { PAGES } from '../utils/constants'
import LeftIsland from '../components/LeftIsland'

export default function GroupsPage({ currPage, setCurrPage }) {
  const pageVisible = currPage === PAGES.GROUPS
  return (
    pageVisible && (
      <Fragment>
        {/* Left Group */}
        <LeftIsland></LeftIsland>
        {/* Right Group */}
        <div className="flex flex-col flex-1 gap-4">
          <NavBar currPage={currPage} setCurrPage={setCurrPage} />
          <div className="flex flex-1 overflow-y-auto paragraph island"></div>
        </div>
      </Fragment>
    )
  )
}
