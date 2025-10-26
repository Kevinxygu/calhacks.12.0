// components/simulation/SelectInput.tsx
interface SelectInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
}

export function SelectInput({
  label,
  value,
  onChange,
  options,
  placeholder,
}: SelectInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-white">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-3 bg-transparent border border-white/20 rounded-lg text-white focus:outline-none focus:border-palette-green focus:ring-1 focus:ring-palette-green transition-colors appearance-none cursor-pointer"
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option} value={option} className="bg-palette-background-blue">
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}