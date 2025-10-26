// form area component to render for notes
interface FormTextAreaProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  maxLength?: number
  required?: boolean
}

export function FormTextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  maxLength,
  required = false,
}: FormTextAreaProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-white">
          {label}
        </label>
        {maxLength && (
          <span className="text-xs text-white/40">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        maxLength={maxLength}
        className="px-4 py-3 bg-transparent border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-palette-green focus:ring-1 focus:ring-palette-green transition-colors resize-none"
      />
    </div>
  )
}