import Logo from "./Logo";

export default function LeftIsland({children}) {
  return (
    <div className="flex flex-col w-[200px] island gap-2 justify-start items-center">
      <Logo />
      <div className="m-3 p-0 border-b-2 border-b-gray-500 w-full"></div>
      {children}
    </div>
  )
}
