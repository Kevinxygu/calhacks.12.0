// app/persona/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SimulationSettings, Persona } from '@/lib/types'
import { toast } from 'sonner'

const loadingPhrases = [
  'Brewing coffee...',
  'Ruffling papers...',
  'Opening notes...',
  'Adjusting tie...',
  'Clearing throat...',
  'Heading into the Zoom call...',
  'Reviewing your profile...',
  'Preparing objections...',
]

export default function PersonaPage() {
  const router = useRouter()
  const [currentPhrase, setCurrentPhrase] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Rotate through phrases
    const phraseInterval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % loadingPhrases.length)
    }, 2000)

    // Generate persona
    generatePersona()

    return () => {
      clearInterval(phraseInterval)
    }
  }, [])

  const generatePersona = async () => {
    try {
      // Get settings from sessionStorage
      const settingsStr = sessionStorage.getItem('simulationSettings')
      if (!settingsStr) {
        throw new Error('No settings found')
      }

      const settings: SimulationSettings = JSON.parse(settingsStr)

      // Call backend API to generate persona
      const response = await fetch('http://localhost:8080/api/persona/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        throw new Error('Failed to generate persona')
      }

      const data = await response.json()

      // Store persona and greeting audio
      sessionStorage.setItem('persona', JSON.stringify(data.persona))
      sessionStorage.setItem('greetingAudio', data.greetingAudio)

      // Navigate to simulation
      router.push('/simulation')
    } catch (err) {
      console.error('Error generating persona:', err)
      setError('Failed to generate AI prospect. Please try again.')
      toast.error('Failed to generate AI prospect')
      
      // Redirect back to home after 3 seconds
      setTimeout(() => {
        router.push('/')
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen bg-palette-background-blue flex flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center gap-6">
        {/* Loading spinner */}
        <div className="relative w-32 h-32">
          <div className="w-full h-full rounded-full border-4 border-palette-green/20 border-t-palette-green animate-spin" />
        </div>

        {/* Status text */}
        {error ? (
          <div className="text-center">
            <p className="text-xl text-red-400 font-medium">{error}</p>
            <p className="text-sm text-white/60 mt-2">Redirecting...</p>
          </div>
        ) : (
          <>
            <p className="text-xl text-white font-medium animate-fade-in">
              {loadingPhrases[currentPhrase]}
            </p>
            <p className="text-sm text-white/60 mt-4">
              Generating your AI prospect...
            </p>
          </>
        )}
      </div>
    </div>
  )
}