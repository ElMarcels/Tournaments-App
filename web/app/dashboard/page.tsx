import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: myParticipations } = await supabase
    .from('tournament_participants')
    .select(`
      *,
      tournament:tournaments(id, name, game, status, format)
    `)
    .eq('user_id', user.id)

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          {profile?.avatar_url && (
            <img
              src={profile.avatar_url}
              alt=""
              className="w-16 h-16 rounded-full"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-white">
              {profile?.username || 'Player'}
            </h1>
            <p className="text-gray-400">
              Role: <span className="text-purple-400">{profile?.user_role || 'USER'}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">My Tournaments</h2>
            {!myParticipations || myParticipations.length === 0 ? (
              <p className="text-gray-400">You haven&apos;t joined any tournaments yet.</p>
            ) : (
              <div className="space-y-3">
                {myParticipations.map((p: any) => (
                  <a
                    key={p.id}
                    href={`/tournaments/${p.tournament?.id}`}
                    className="block bg-[#1a1a2e] rounded-lg p-4 hover:bg-[#22223a] transition-colors"
                  >
                    <p className="text-white font-semibold">{p.tournament?.name}</p>
                    <p className="text-gray-400 text-sm">
                      {p.tournament?.game} &middot; {p.tournament?.status}
                    </p>
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Notifications</h2>
            {!notifications || notifications.length === 0 ? (
              <p className="text-gray-400">No notifications.</p>
            ) : (
              <div className="space-y-3">
                {notifications.map((n: any) => (
                  <div
                    key={n.id}
                    className={`bg-[#1a1a2e] rounded-lg p-4 ${
                      !n.is_read ? 'border-l-4 border-purple-500' : ''
                    }`}
                  >
                    <p className="text-white text-sm">{n.message}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(n.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
