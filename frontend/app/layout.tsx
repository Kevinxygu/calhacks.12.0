// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Onest } from 'next/font/google'

const onest = Onest({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dynamic',
  description: 'Practice sales calls with AI-powered prospects that help you win up',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={onest.className}>{children}</body>
    </html>
  )
}