import { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareXmark } from '@fortawesome/free-solid-svg-icons'

// Open state is handled externally
const StaticModal = ({ content, children, title, open, setOpen, closeOnClick }) => {
  const modalRef = useRef(null)

  // Handle fade in animation state
  const [fadeIn, setFadeIn] = useState(false)
  useEffect(() => {
    setFadeIn(true)
    const id = setTimeout(() => {
      setFadeIn(false)
    }, 200)

    return () => {
      clearTimeout(id)
    }
  }, [open])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  const handleClickOutside = (event) => {
    if (closeOnClick && modalRef.current && !modalRef.current.contains(event.target)) {
      setOpen(false)
    }
  }

  return (
    <>
      {children}
      {open && (
        <div
          className={`fixed inset-0 left-0 z-50 overflow-hidden flex justify-center items-center bg-gray-700/75 text-base fade-in`}
        >
          <div ref={modalRef} className={`relative island zoom-in max-h-[700px] overflow-auto`}>
            <div onClick={() => setOpen(false)} className="fixed top-1 right-2 cursor-pointer hover:text-sky-400 transition-all">
              <FontAwesomeIcon icon={faSquareXmark} className="m-0" />
            </div>
            <div className="flex flex-col justify-center items-center gap-3">
              <h1 className="px-2 text-xl font-bold text-white text-center">{title}</h1>
              {content}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default StaticModal
