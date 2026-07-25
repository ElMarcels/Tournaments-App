import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TournamentHub',
  description: 'Global platform for managing esports tournaments',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0f] text-white">
        {children}
      </body>
    </html>
  )
}
