import { Fragment, useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import Logo from '../components/logo'
import { PAGES } from '../utils/constants'
import { useSqlSettings } from '../context/SqlContext'
import DarkTable from '../components/Table'

export default function PlatformsPage({ currPage, setCurrPage }) {
  const sqlSettings = useSqlSettings()
  const [resMsg, setResMsg] = useState('') // Create res msg in bottom bar?
  const [platformList, setPlatformList] = useState('') // Create res msg in bottom bar?
  const pageVisible = currPage === PAGES.PLATFORMS

  const getPlatforms = () => {
    const payload = {}
    window.api
      .sqlBridge('getPlatforms', payload)
      .then((res) => {
        if (res.success) {
          console.log(res.data)
          setPlatformList(res.data)
        } else {
          setResMsg('Platform fetch failed')
        }
      })
      .catch((reason) => {
        setResMsg(reason)
      })
  }



  useEffect(() => {
    getPlatforms()
    // if (pageVisible && sqlSettings.connected) {
    // }
  }, [])

  return (
    pageVisible && (
      <Fragment>
        <div className="flex flex-col w-[200px] island gap-2">
          <Logo />
          <div className="m-3 p-0 border-b-2 border-b-black"></div>
        </div>
        {/* Right Group */}
        <div className="flex flex-col flex-1 gap-4">
          <NavBar currPage={currPage} setCurrPage={setCurrPage} />
          <div className="flex flex-1 overflow-y-auto paragraph island">
            {resMsg}
            {platformList.length && (
              <DarkTable headers={Object.keys(platformList[0])} list={platformList}/>
            )}
          </div>
        </div>
      </Fragment>
    )
  )
}
