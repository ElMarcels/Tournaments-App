import { createClient } from '@/lib/supabase/server'
import TournamentCard from '@/components/TournamentCard'
import Link from 'next/link'

export default async function TournamentsPage() {
  const supabase = await createClient()

  const { data: tournaments, error } = await supabase
    .from('tournaments')
    .select(`
      *,
      tournament_participants(count)
    `)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-purple-500">Tournaments</h1>
          <Link
            href="/tournaments/create"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Create Tournament
          </Link>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg mb-6">
            Error loading tournaments: {error.message}
          </div>
        )}

        {!tournaments || tournaments.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-4">No tournaments found.</p>
            <p className="text-gray-500">Create the first tournament to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
