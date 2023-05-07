import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect, useRef } from 'react'

const RowDropdown = ({ children, rowInfo }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false)
    }
  }

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <div
        ref={dropdownRef}
        className="btn w-full text-sm text-gray-300 border-sky-700 border rounded p-2 flex justify-center items-center relative cursor-pointer"
        onClick={toggleOpen}
      >
        <div className="flex gap-2 justify-center items-center">
          <div>Action</div>
          <FontAwesomeIcon icon={faAngleDown} className="m-0" />
        </div>
        {isOpen && (
          <div className="absolute top-[105%] w-[105%] gap-1 z-30 flex flex-col p-1 border-b-y rounded fade-in bg-gray-800">
            {children(rowInfo)}
          </div>
        )}
      </div>
    </>
  )
}

export default RowDropdown
