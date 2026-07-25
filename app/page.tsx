import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Button from '@/components/Button'

export default async function Home() {
  let user = null

  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    // Supabase not configured
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-6xl font-bold text-purple-500 mb-4">TournamentHub</h1>
      <p className="text-gray-400 text-xl mb-8 text-center max-w-md">
        Global platform for managing esports tournaments.
        Compete, organize, and climb the rankings.
      </p>
      <div className="flex gap-4">
        {user ? (
          <Link href="/tournaments">
            <Button variant="primary">Browse Tournaments</Button>
          </Link>
        ) : (
          <Link href="/login">
            <Button variant="primary">Get Started</Button>
          </Link>
        )}
        <Link href="/rankings">
          <Button variant="outline">View Rankings</Button>
        </Link>
      </div>
    </main>
  )
}
