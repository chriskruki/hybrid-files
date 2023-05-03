export default function GradientLayout({ children, className, visible }) {
  const visStyle = visible ? { opacity: '1' } : { opacity: '0' }
  return (
    <div
      className={`w-full h-full flex bg-gradient-to-t from-sky-600 to-sky-800 p-4 gap-4 transition-all duration-200  ${className}`}
      style={visStyle}
    >
      {children}
    </div>
  )
}
