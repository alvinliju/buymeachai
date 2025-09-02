
import { supabase } from '@/lib/supabase'
import ChaiButton from '@/components/ChaiButton'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface Support {
  supporter_name: string
  message: string | null
  amount: number
  created_at: string
}

export default async function CreatorPage({ 
  params 
}: { 
  params: Promise<{ username: string }> 
}) {
  const { username } = await params
  
  const { data: creator } = await supabase
    .from('creators')
    .select(`
      *,
      supports (
        supporter_name,
        message,
        amount,
        created_at
      )
    `)
    .eq('username', username)
    .single()

  if (!creator) notFound()

  // Call Clerk API to get profile pic
  let avatarUrl = '/default-avatar.png'
  try {
    const response = await fetch(`https://api.clerk.com/v1/users/${creator.clerk_user_id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (response.ok) {
      const clerkUser = await response.json()
      avatarUrl = clerkUser.image_url || '/default-avatar.png'
    }
  } catch (error) {
    console.error('Failed to fetch from Clerk:', error)
  }

  const recentSupports: Support[] = creator.supports
    ?.sort((a: Support, b: Support) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    ?.slice(0, 10) || []

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Header */}
     

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Creator Header */}
        <div className="text-center mb-12">
          <img
            src={avatarUrl}
            alt={creator.display_name}
            className="w-24 h-24 rounded-full mx-auto mb-6 object-cover border-2 border-gray-100"
          />
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{creator.display_name}</h1>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">{creator.bio}</p>
          <div className="flex justify-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                ₹{Math.floor((creator.total_earnings || 0))}
              </p>
              <p className="text-sm text-gray-600">raised</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{creator.supporter_count || 0}</p>
              <p className="text-sm text-gray-600">supporters</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Payment Form */}
          <div>
            <ChaiButton creatorId={creator.id} creatorName={creator.display_name} />
          </div>

          {/* Recent Supports */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Supporters</h2>
            <div className="space-y-4">
              {recentSupports.length > 0 ? (
                recentSupports.map((support: Support, index: number) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{support.supporter_name}</p>
                        {support.message && (
                          <p className="text-sm text-gray-600 mt-1">{support.message}</p>
                        )}
                      </div>
                      <span className="text-sm font-medium text-orange-600">
                        ₹{support.amount}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 border border-gray-200 rounded-lg bg-gray-50">
                  <p className="text-gray-500">No supporters yet. Be the first!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}