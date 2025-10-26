// app/persona/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

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

  useEffect(() => {
    // Rotate through phrases
    const phraseInterval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % loadingPhrases.length)
    }, 2000)

    // Simulate persona generation (3-5 seconds)
    const timeout = setTimeout(() => {
      // In real app, this would wait for backend response
      router.push('/simulation')
    }, 5000)

    return () => {
      clearInterval(phraseInterval)
      clearTimeout(timeout)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-palette-background-blue flex flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center gap-6">
        {/* Loading GIF/Animation */}
        <div className="relative w-32 h-32">
          {/* Replace with your actual loading.gif */}
          <div className="w-full h-full rounded-full border-4 border-palette-green/20 border-t-palette-green animate-spin" />
        </div>

        {/* Rotating phrases */}
        <p className="text-xl text-white font-medium animate-fade-in">
          {loadingPhrases[currentPhrase]}
        </p>

        <p className="text-sm text-white/60 mt-4">
          Generating your AI prospect...
        </p>
      </div>
    </div>
  )
}