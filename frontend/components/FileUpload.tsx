// components/simulation/FileUpload.tsx
'use client'

import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'

interface FileUploadProps {
  label: string
  accept?: string
  onChange: (file: File | null) => void
}

export function FileUpload({ label, accept = '.mp3,.mp4,.mov', onChange }: FileUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFileName(file?.name || null)
    onChange(file)
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-white">
        {label}
      </label>
      <div
        onClick={() => fileInputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-2 px-4 py-12 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-palette-green transition-colors"
      >
        <Upload className="w-8 h-8 text-white/40" />
        <p className="text-sm text-white/60">
          {fileName || 'Supported file types: mp3, mp4, mov, avi'}
        </p>
        <button
          type="button"
          className="mt-2 px-4 py-2 bg-palette-green text-white rounded-lg text-sm font-medium hover:bg-palette-green/90 transition-colors"
        >
          Upload
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  )
}