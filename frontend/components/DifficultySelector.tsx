// components/simulation/DifficultySelector.tsx
interface DifficultySelectorProps {
  value: 'easy' | 'medium' | 'harsh'
  onChange: (value: 'easy' | 'medium' | 'harsh') => void
}

export function DifficultySelector({ value, onChange }: DifficultySelectorProps) {
  const options: Array<'easy' | 'medium' | 'harsh'> = ['easy', 'medium', 'harsh']

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-white">
        Client Difficulty
      </label>
      <div className="flex gap-3">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`px-6 py-2 rounded-lg font-medium capitalize transition-all ${
              value === option
                ? 'bg-palette-green text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}