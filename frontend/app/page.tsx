// app/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FormInput } from '@/components/FormInput'
import { DifficultySelector } from '@/components/DifficultySelector'
import { FileUpload } from '@/components/FileUpload'
import { SelectInput } from '@/components/SelectInput'
import { Button } from '@/components/ui/button'
import { SimulationSettings } from '@/lib/types'
import { FormTextArea } from '@/components/FormTextArea'

export default function HomePage() {
  const router = useRouter()
  const [settings, setSettings] = useState<SimulationSettings>({
    difficulty: 'easy',
    prospectRole: '',
    companyName: '',
    callType: 'cold',
    enableCoaching: true,
    notes: '',
  })
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Store settings for persona generation
      sessionStorage.setItem('simulationSettings', JSON.stringify(settings))
      
      // Navigate to persona generation page
      // The persona page will make the API call
      router.push('/persona')
    } catch (error) {
      console.error('Error:', error)
      // toast.error('Failed to start interview')
      setIsLoading(false)
    }
  }

  const isFormValid = settings.prospectRole && settings.companyName

  return (
    <div className="min-h-screen bg-palette-background-blue flex items-center justify-center p-8">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">
            Enter Interview Details
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <FormInput
            label="Prospect Role"
            value={settings.prospectRole}
            onChange={(value) =>
              setSettings({ ...settings, prospectRole: value })
            }
            placeholder="e.g., VP of Engineering"
            required
          />

          <FormInput
            label="Company Name"
            value={settings.companyName}
            onChange={(value) =>
              setSettings({ ...settings, companyName: value })
            }
            placeholder="e.g., Acme Corp"
            required
          />

          <SelectInput
            label="Call type"
            value={settings.callType}
            onChange={(value) =>
              setSettings({ ...settings, callType: value as any })
            }
            options={['cold', 'follow-up', 'closing']}
          />

          <DifficultySelector
            value={settings.difficulty}
            onChange={(value) =>
              setSettings({ ...settings, difficulty: value })
            }
          />

          <FileUpload
            label="Previous client calls"
            onChange={setUploadedFile}
          />
          <FormTextArea
            label="Notes & Guidelines (Optional)"
            value={settings.notes || ''}
            onChange={(value) =>
              setSettings({ ...settings, notes: value })
            }
            placeholder="Example: Focus on our new AI features, emphasize ROI within 6 months, avoid discussing pricing until they show interest..."
            rows={5}
            maxLength={500}
          />

          <Button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full py-4 text-base mt-4"
          >
            {isLoading ? 'Starting Interview...' : 'Start Interview'}
          </Button>
        </form>
      </div>
    </div>
  )
}