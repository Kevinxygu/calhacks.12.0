// types for frontend

// settings fo the settings simulation
export interface SimulationSettings {
    difficulty: 'easy' | 'medium' | 'harsh' // choosable based on user preference for practice
    prospectRole: string // e.g. director, PM, engineer, etc,
    companyName: string // e.g. Amazon
    callType: 'cold' | 'follow-up' | 'closing' // type of sales call
    enableCoaching: boolean // whether to enable real-time coaching feedback
}

// persona info for the AI prospect
export interface Persona {
    name: string
    role: string // job title
    company: string
    personality: string // brief description of personality traits
    communciationStyle: string // e.g. formal, casual, direct, etc
    currentSituation: string // context for the call, what kind of problems do they have?
    objections: string[] // common objections they might raise during the call. What kind of questions do you want to practice asking against?
    difficulty: 'easy' | 'medium' | 'harsh' // difficulty level based on settings
    voiceId: string // voice identifier for elevenlabs
    confidenceScore: number // how confident the AI is in its responses (affects hesitations, filler words, etc. for elevenlabs
}

// messages for transcript / call log
export interface Message {
    sender: 'user' | 'ai'
    text: string
    timestamp: number
}

// feedback response from coaching API
export interface FeedbackResponse {
    score: number
    // breakdown of different metrics from the call
    breakdown: {
        opening: number
        objectionHandling: number
        closing: number
        listening: number
    }

    strengths: string[]
    improvements: string[]
    suggestions: Message[]
    metrics: {
        talkRatio: number
        fillerWords: number
        questionsAsked: number
    }
}

// websocket messages
export interface WSMessage {
    type: 'ready' | 'transcriptUpdate' | 'aiResponse' | 'callEnd' | 'coachTip'
}

