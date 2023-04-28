import FileDialog from "./components/fileDialog"

const navBtns = [{ label: 'Files' }, { label: 'Jobs' }, { label: 'Providers' }]

function App() {
  return (
    <div className="w-full h-full flex bg-gradient-to-t from-sky-600 to-sky-800 p-4 gap-4">
      {/* Left Group */}
      <div className="flex flex-col w-[200px] island gap-2">
        <div className="flex h-10 justify-center items-center border-black rounded border bg-gradient-to-b from-sky-800 to-sky-600  ">
          <h1 className="text-lg">Hybrid-Files</h1>
        </div>
        <div className="m-3 p-0 border-b-2 border-b-black"></div>
        {navBtns.map((val, i) => {
          return (
            <button key={i} className="btn h-10 w-full">
              {val.label}
            </button>
          )
        })}
      </div>
      {/* Right Group */}
      <div className="flex flex-col flex-1 gap-4">
        <div className="flex h-[75px] island justify-start items-center">
          <FileDialog/>
        </div>
        <div className="flex flex-1 overflow-y-auto paragraph island"></div>
      </div>
    </div>
  )
}

export default App
