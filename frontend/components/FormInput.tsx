// components/simulation/FormInput.tsx
interface FormInputProps {
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
}

export function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-white">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="px-4 py-3 bg-transparent border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-palette-green focus:ring-1 focus:ring-palette-green transition-colors"
      />
    </div>
  )
}