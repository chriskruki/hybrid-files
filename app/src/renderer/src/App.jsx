const navBtns = [{ label: 'Button' }, { label: 'Button 2' }]

function App() {
  return (
    <div className="w-full h-full flex bg-gradient-to-t from-sky-600 to-sky-800 p-4 gap-4">
      <div className="flex flex-col w-[200px] island gap-2">
        <div className="flex justify-center border-black rounded border bg-gradient-to-b from-sky-800 to-sky-600  ">
          <h1>Hybrid-Files</h1>
        </div>
        {navBtns.map((val, i) => {
          return (
            <button
              key={i}
              className="w-full rounded border border-slate-500 hover:border-slate-400 text-slate-300 hover:text-slate-100  transition-all"
            >
              {val.label}
            </button>
          )
        })}
        {/* <button className="w-full rounded border border-slate-500 hover:border-slate-400 text-slate-300 hover:text-slate-100  transition-all">
          Option
        </button> */}
      </div>
      <div className="flex flex-col flex-1 gap-4">
        <div className="flex h-16 island">Header</div>
        <div className="flex flex-1 overflow-y-auto paragraph island"></div>
      </div>
    </div>
  )
}

export default App
