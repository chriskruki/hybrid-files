import { NAVBTNS } from '../utils/constants'

export default function NavBar({ currPage, setCurrPage }) {
  
  return (
    <div
      className="flex h-[75px] island justify-start items-center gap-2"
    >
      {NAVBTNS.map((val, i) => {
        const selected = currPage === val.page ? "filled" : ""
        return (
          <button key={i} className={`btn ${selected} h-10 w-[100px]`} onClick={() => setCurrPage(val.page)}>
            {val.label}
          </button>
        )
      })}
    </div>
  )
}
