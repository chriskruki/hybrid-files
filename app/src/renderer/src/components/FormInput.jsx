export default function FormInput({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  hint,
  className,
  disabled,
  required
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm mb-1 font-medium text-white">
        {label}
      </label>

      <input
        type={type}
        name={name}
        id={name}
        className="rounded-lg w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-sky-600"
        placeholder={placeholder || ''}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
      />
      {hint && (
        <label htmlFor={name} className="block mb-1 text-xs font-thin text-gray-400">
          {hint}
        </label>
      )}
    </div>
  )
}
