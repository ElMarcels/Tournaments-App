'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function JoinTournamentButton({ tournamentId }: { tournamentId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleJoin = async () => {
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { error: insertError } = await supabase
      .from('tournament_participants')
      .insert({
        tournament_id: tournamentId,
        user_id: user.id,
        status: 'PENDING_APPROVAL',
      })

    if (insertError) {
      if (insertError.code === '23505') {
        setError('You are already registered for this tournament.')
      } else {
        setError(insertError.message)
      }
    } else {
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <div>
      <button
        onClick={handleJoin}
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg transition-colors"
      >
        {loading ? 'Joining...' : 'Join Tournament'}
      </button>
      {error && (
        <p className="text-red-400 text-sm mt-2">{error}</p>
      )}
    </div>
  )
}
