import { createClient } from '@/lib/supabase/server'

export default async function RankingsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('get_global_rankings')

  const rankings = data?.rankings || []

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-500 mb-8">Global Rankings</h1>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg mb-6">
            Error loading rankings: {error.message}
          </div>
        )}

        {!rankings || rankings.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No rankings available yet.</p>
            <p className="text-gray-500">Complete tournaments to earn points!</p>
          </div>
        ) : (
          <div className="bg-[#12121a] border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold">#</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold">Player/Team</th>
                  <th className="text-center py-4 px-6 text-gray-400 font-semibold">Score</th>
                  <th className="text-center py-4 px-6 text-gray-400 font-semibold">Wins</th>
                  <th className="text-center py-4 px-6 text-gray-400 font-semibold">Losses</th>
                  <th className="text-center py-4 px-6 text-gray-400 font-semibold">Tournaments</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((r: any, index: number) => (
                  <tr
                    key={`${r.entity_name}-${r.entity_type}`}
                    className="border-b border-gray-800/50 hover:bg-[#1a1a2e] transition-colors"
                  >
                    <td className="py-4 px-6">
                      <span
                        className={`font-bold ${
                          index === 0
                            ? 'text-yellow-400'
                            : index === 1
                            ? 'text-gray-300'
                            : index === 2
                            ? 'text-amber-600'
                            : 'text-gray-500'
                        }`}
                      >
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-white font-semibold">{r.entity_name}</p>
                        <p className="text-gray-500 text-sm">{r.entity_type}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-purple-400 font-bold">{r.total_score}</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-green-400">{r.total_wins}</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-red-400">{r.total_losses}</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-gray-300">{r.tournament_count}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
