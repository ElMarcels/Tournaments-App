import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './LogoutButton'

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('users')
      .select('username, avatar_url, user_role')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return (
    <nav className="bg-[#12121a] border-b border-gray-800 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-purple-500">
          TournamentHub
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/tournaments"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Tournaments
          </Link>
          <Link
            href="/rankings"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Rankings
          </Link>

          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-3">
                {profile?.avatar_url && (
                  <img
                    src={profile.avatar_url}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-gray-300 text-sm">
                  {profile?.username || 'Player'}
                </span>
                <LogoutButton />
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
