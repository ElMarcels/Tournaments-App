import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import JoinTournamentButton from './JoinTournamentButton'

export default async function TournamentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: tournament, error } = await supabase
    .from('tournaments')
    .select(`
      *,
      tournament_participants(
        *,
        user:users(id, username, avatar_url)
      ),
      matches(*)
    `)
    .eq('id', id)
    .single()

  if (error || !tournament) {
    notFound()
  }

  const { data: { user } } = await supabase.auth.getUser()
  const participantCount = tournament.tournament_participants?.length || 0

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{tournament.name}</h1>
              <p className="text-gray-400">{tournament.game}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                tournament.status === 'OPEN'
                  ? 'bg-green-900/50 text-green-300 border border-green-700'
                  : tournament.status === 'RUNNING'
                  ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-700'
                  : tournament.status === 'FINISHED'
                  ? 'bg-gray-800 text-gray-300 border border-gray-600'
                  : 'bg-purple-900/50 text-purple-300 border border-purple-700'
              }`}
            >
              {tournament.status}
            </span>
          </div>

          {tournament.description && (
            <p className="text-gray-300 mb-6">{tournament.description}</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#1a1a2e] rounded-lg p-4">
              <p className="text-gray-400 text-sm">Format</p>
              <p className="text-white font-semibold">{tournament.format}</p>
            </div>
            <div className="bg-[#1a1a2e] rounded-lg p-4">
              <p className="text-gray-400 text-sm">Teams</p>
              <p className="text-white font-semibold">
                {participantCount} / {tournament.max_teams}
              </p>
            </div>
            <div className="bg-[#1a1a2e] rounded-lg p-4">
              <p className="text-gray-400 text-sm">Start Date</p>
              <p className="text-white font-semibold">
                {tournament.start_date
                  ? new Date(tournament.start_date).toLocaleDateString()
                  : 'TBD'}
              </p>
            </div>
            <div className="bg-[#1a1a2e] rounded-lg p-4">
              <p className="text-gray-400 text-sm">Status</p>
              <p className="text-white font-semibold">{tournament.status}</p>
            </div>
          </div>

          {user && tournament.status === 'OPEN' && participantCount < tournament.max_teams && (
            <JoinTournamentButton tournamentId={tournament.id} />
          )}
        </div>

        <div className="bg-[#12121a] border border-gray-800 rounded-xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">
            Participants ({participantCount})
          </h2>
          {tournament.tournament_participants?.length > 0 ? (
            <div className="space-y-3">
              {tournament.tournament_participants.map((p: any) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 bg-[#1a1a2e] rounded-lg p-3"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                    {p.user?.avatar_url ? (
                      <img
                        src={p.user.avatar_url}
                        alt=""
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <span className="text-white font-bold">
                        {p.user?.username?.[0] || '?'}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-white font-semibold">
                      {p.user?.username || 'Unknown'}
                    </p>
                    <p className="text-gray-400 text-sm">{p.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No participants yet.</p>
          )}
        </div>
      </div>
    </main>
  )
}
