// app/simulation/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Video, VideoOff, Mic, MicOff, MonitorUp, MessageSquare, Phone } from 'lucide-react'
import { Message, Persona } from '@/lib/types'

export default function SimulationPage() {
  const router = useRouter()
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [callDuration, setCallDuration] = useState(0)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [persona, setPersona] = useState<Persona | null>(null)
  const [greetingAudio, setGreetingAudio] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const greetingAudioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize persona and greeting audio
  useEffect(() => {
    // Load persona from sessionStorage
    const personaStr = sessionStorage.getItem('persona')
    const audioStr = sessionStorage.getItem('greetingAudio')

    let loadedPersona: Persona | null = null

    if (personaStr) {
      loadedPersona = JSON.parse(personaStr) as Persona
      setPersona(loadedPersona)
      console.log('Loaded persona:', loadedPersona)
    } else {
      console.warn('No persona found in sessionStorage')
    }

    if (audioStr) {
      setGreetingAudio(audioStr)
      
      // Play greeting audio automatically after a short delay
      setTimeout(() => {
        const audio = new Audio(audioStr)
        greetingAudioRef.current = audio
        
        audio.play().catch((err) => {
          console.error('Failed to play greeting audio:', err)
          // Browser might block autoplay - user needs to interact first
        })

        // Add greeting message to transcript when audio starts
        audio.onplay = () => {
          setMessages([
            {
              sender: 'ai',
              text: `[Audio greeting playing from ${loadedPersona?.name || 'AI Prospect'}]`,
              timestamp: Date.now(),
            },
          ])
        }
      }, 1000) // 1 second delay to let the page load
    }
  }, [])

  // Initialize camera
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user',
          },
          audio: true,
        })

        streamRef.current = stream

        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (error) {
        console.error('Error accessing camera:', error)
        setCameraError('Unable to access camera. Please check permissions.')
      }
    }

    initCamera()

    // Cleanup: stop camera when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      // Stop greeting audio if playing
      if (greetingAudioRef.current) {
        greetingAudioRef.current.pause()
        greetingAudioRef.current = null
      }
    }
  }, [])

  // Handle video toggle
  useEffect(() => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = isVideoOn
      }
    }
  }, [isVideoOn])

  // Handle audio toggle
  useEffect(() => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !isMuted
      }
    }
  }, [isMuted])

  // Call timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleHangUp = () => {
    // Stop camera before leaving
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }

    // Stop greeting audio if still playing
    if (greetingAudioRef.current) {
      greetingAudioRef.current.pause()
    }

    // Store transcript for feedback page
    sessionStorage.setItem('transcript', JSON.stringify(messages))
    sessionStorage.setItem('callDuration', callDuration.toString())
    router.push('/feedback')
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-palette-background-blue flex flex-col p-6">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Video Area */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Main video screen */}
          <div className="relative flex-1 bg-blue-200 rounded-lg overflow-hidden min-h-[500px]">
            {/* AI Prospect Avatar */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-48 h-48 rounded-full bg-blue-400 flex items-center justify-center text-white text-6xl font-bold shadow-lg">
                {persona ? getInitials(persona.name) : 'AI'}
              </div>
              {persona && (
                <div className="mt-6 text-center">
                  <p className="text-2xl font-semibold text-gray-800">
                    {persona.name}
                  </p>
                  <p className="text-lg text-gray-600">
                    {persona.role} at {persona.company}
                  </p>
                </div>
              )}
            </div>

            {/* User's live video (picture-in-picture) */}
            <div className="absolute bottom-4 right-4 w-40 h-28 rounded-lg overflow-hidden border-2 border-white/20 bg-black">
              {isVideoOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <VideoOff className="w-8 h-8 text-white/60" />
                </div>
              )}

              {cameraError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-2">
                  <p className="text-xs text-white text-center">{cameraError}</p>
                </div>
              )}
            </div>

            {/* Call timer */}
            <div className="absolute top-4 left-4 px-4 py-2 bg-black/50 rounded-lg text-white text-sm font-medium">
              {formatTime(callDuration)}
            </div>

            {/* Microphone status indicator */}
            {isMuted && (
              <div className="absolute top-4 right-4 px-4 py-2 bg-red-500/80 rounded-lg text-white text-sm font-medium flex items-center gap-2">
                <MicOff className="w-4 h-4" />
                <span>Muted</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Chat Transcript */}
        <div className="flex flex-col border border-white/20 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-white/20 bg-white/5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {persona?.name || 'AI Prospect'}
                </h3>
                <p className="text-sm text-white/60">
                  {persona?.role || 'Sales Prospect'} at {persona?.company || 'Company'}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/5">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-white/40 text-sm">
                  Transcript will appear here...
                </p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-sm font-semibold text-white">
                    {msg.sender === 'user' 
                      ? 'You' 
                      : persona?.name || 'AI Prospect'}
                  </p>
                  <p className="text-sm text-white/80">{msg.text}</p>
                </div>
              ))
            )}
          </div>

          {/* Info footer */}
          <div className="p-3 border-t border-white/20 bg-white/5">
            <p className="text-xs text-white/40 text-center">
              {persona?.difficulty 
                ? `Difficulty: ${persona.difficulty.charAt(0).toUpperCase() + persona.difficulty.slice(1)}`
                : 'AI-powered practice call'}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={() => setIsVideoOn(!isVideoOn)}
          className={`p-4 rounded-lg transition-colors ${
            isVideoOn
              ? 'bg-white/10 hover:bg-white/20'
              : 'bg-red-500 hover:bg-red-600'
          }`}
          title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
        >
          {isVideoOn ? (
            <Video className="w-6 h-6 text-white" />
          ) : (
            <VideoOff className="w-6 h-6 text-white" />
          )}
        </button>

        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-4 rounded-lg transition-colors ${
            !isMuted
              ? 'bg-white/10 hover:bg-white/20'
              : 'bg-red-500 hover:bg-red-600'
          }`}
          title={!isMuted ? 'Mute microphone' : 'Unmute microphone'}
        >
          {!isMuted ? (
            <Mic className="w-6 h-6 text-white" />
          ) : (
            <MicOff className="w-6 h-6 text-white" />
          )}
        </button>

        <button 
          className="p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          title="Share screen (coming soon)"
        >
          <MonitorUp className="w-6 h-6 text-white" />
        </button>

        <button 
          className="p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          title="Toggle chat"
        >
          <MessageSquare className="w-6 h-6 text-white" />
        </button>

        {/* Hang up button */}
        <button
          onClick={handleHangUp}
          className="px-12 py-4 bg-red-500 hover:bg-red-600 rounded-lg transition-colors flex items-center gap-2 shadow-lg"
        >
          <Phone className="w-6 h-6 text-white rotate-[135deg]" />
          <span className="text-white font-medium">End Call</span>
        </button>
      </div>

      {/* View Feedback link */}
      <div className="text-center mt-4">
        <button
          onClick={handleHangUp}
          className="text-white/60 hover:text-white text-sm transition-colors underline"
        >
          View Feedback
        </button>
      </div>
    </div>
  )
}