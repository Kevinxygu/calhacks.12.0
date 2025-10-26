// app/feedback/page.tsx
'use client'

import { ArrowUp, ArrowDown } from 'lucide-react'

interface ScoreCard {
  score: number
  change: number
  label: string
}

export default function FeedbackPage() {
  const scores: ScoreCard[] = [
    { score: 67, change: 10, label: 'Opening' },
    { score: 87, change: 2, label: 'Objection Handling' },
    { score: 91, change: -5, label: 'Closing' },
    { score: 75, change: -10, label: 'Listening' },
  ]

  const strengths = [
    {
      timestamp: '08:25',
      text: 'Really good job mapping the customer\'s pain point to Nerve\'s product offering. This was a key moment that captures what the customer was looking for',
    },
    {
      timestamp: '09:33',
      text: 'Solid closer; use this phrase next time in your pitches! You said "We are the dashboard for tomorrow" which the client repeated and resonated with',
    },
  ]

  const weaknesses = [
    {
      timestamp: '03:03',
      text: 'This is incorrect based on Nerve\'s product requirements. You mentioned it covers SOC 2 compliance, when it\'s actually HIPAA',
      link: 'Nerve\'s product requirements',
    },
  ]

  const suggestions = [
    {
      timestamp: '05:07',
      text: 'It was a good touch that you touched on Nerve as the product of choice. However, Ethos might have been a better choice since they were looking for only-digital solutions.',
      links: ['Nerve', 'Ethos'],
    },
  ]

  return (
    <div className="min-h-screen bg-palette-background-blue p-8">
      <div className="max-w-7xl mx-auto">
        {/* Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {scores.map((score) => (
            <div
              key={score.label}
              className="border border-white/20 rounded-lg p-6 flex flex-col items-center"
            >
              <div className="text-5xl font-bold text-white mb-2">
                {score.score}
              </div>
              <div className="flex items-center gap-1 mb-2">
                {score.change > 0 ? (
                  <>
                    <ArrowUp className="w-4 h-4 text-palette-green" />
                    <span className="text-palette-green text-sm font-medium">
                      +{score.change}%
                    </span>
                  </>
                ) : (
                  <>
                    <ArrowDown className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-sm font-medium">
                      {score.change}%
                    </span>
                  </>
                )}
              </div>
              <div className="text-white/80 text-sm">{score.label}</div>
            </div>
          ))}
        </div>

        {/* Strengths */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Strengths</h2>
          <div className="space-y-4">
            {strengths.map((item, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-palette-green" />
                <div>
                  <span className="text-white font-medium">{item.timestamp}</span>
                  <span className="text-white/80"> - {item.text}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Weaknesses */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Weaknesses</h2>
          <div className="space-y-4">
            {weaknesses.map((item, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-red-400" />
                <div>
                  <span className="text-white font-medium">{item.timestamp}</span>
                  <span className="text-white/80"> - {item.text.split(item.link)[0]}</span>
                  <a href="#" className="text-white underline">
                    {item.link}
                  </a>
                  <span className="text-white/80">{item.text.split(item.link)[1]}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Suggestions */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Suggestions</h2>
          <div className="space-y-4">
            {suggestions.map((item, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-yellow-400" />
                <div>
                  <span className="text-white font-medium">{item.timestamp}</span>
                  <span className="text-white/80"> - </span>
                  {item.text.split(item.links[0])[0]}
                  <a href="#" className="text-white underline">
                    {item.links[0]}
                  </a>
                  {item.text.split(item.links[0])[1].split(item.links[1])[0]}
                  <a href="#" className="text-white underline">
                    {item.links[1]}
                  </a>
                  {item.text.split(item.links[1])[1]}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}