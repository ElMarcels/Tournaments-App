import Link from 'next/link'

interface Tournament {
  id: string
  name: string
  game: string
  status: string
  format: string
  max_teams: number
  start_date: string | null
  tournament_participants?: { count: number }[]
}

export default function TournamentCard({ tournament }: { tournament: Tournament }) {
  const participantCount = tournament.tournament_participants?.[0]?.count || 0

  return (
    <Link href={`/tournaments/${tournament.id}`}>
      <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6 hover:border-purple-600 transition-colors cursor-pointer h-full">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-bold text-white">{tournament.name}</h3>
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${
              tournament.status === 'OPEN'
                ? 'bg-green-900/50 text-green-300'
                : tournament.status === 'RUNNING'
                ? 'bg-yellow-900/50 text-yellow-300'
                : tournament.status === 'FINISHED'
                ? 'bg-gray-800 text-gray-400'
                : 'bg-purple-900/50 text-purple-300'
            }`}
          >
            {tournament.status}
          </span>
        </div>

        <p className="text-gray-400 text-sm mb-4">{tournament.game}</p>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">{tournament.format}</span>
          <span className="text-gray-400">
            {participantCount}/{tournament.max_teams} teams
          </span>
        </div>

        {tournament.start_date && (
          <p className="text-gray-500 text-xs mt-3">
            Starts: {new Date(tournament.start_date).toLocaleDateString()}
          </p>
        )}
      </div>
    </Link>
  )
}
