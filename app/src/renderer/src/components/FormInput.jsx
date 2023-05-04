export default function FormInput({ label, name, type, placeholder, value, onChange, hint }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm mb-1 font-medium text-white">
        {label}
      </label>

      <input
        type={type}
        name={name}
        id={name}
        className="rounded-lg block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        placeholder={placeholder || ''}
        value={value}
        onChange={onChange}
      />
      {hint && (
        <label htmlFor={name} className="block mb-1 text-xs font-thin text-gray-400">
          {hint}
        </label>
      )}
    </div>
  )
}
