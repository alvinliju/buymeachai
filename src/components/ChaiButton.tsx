import { supabase } from '@/lib/supabase'
import ChaiButton from '@/components/ChaiButton'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { notFound } from 'next/navigation'

export default async function CreatorPage({ params }: { params: { username: string } }) {
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
    .eq('username', params.username)
    .single()

  if (!creator) notFound()

  const recentSupports = creator.supports
    ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    ?.slice(0, 10) || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Creator Header */}
        <div className="text-center mb-8">
          <img
            src={creator.avatar_url || '/default-avatar.png'}
            alt={creator.display_name}
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold">{creator.display_name}</h1>
          <p className="text-gray-600 mt-2">{creator.bio}</p>
          <div className="flex justify-center gap-4 mt-4">
            <Badge variant="secondary">
              ₹{Math.floor(creator.total_earnings / 100)} raised
            </Badge>
            <Badge variant="secondary">
              {creator.supporter_count} supporters
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div>
            <ChaiButton creatorId={creator.id} creatorName={creator.display_name} />
          </div>

          {/* Recent Supports */}
          <div>
            <h2 className="text-xl font-bold mb-4">Recent Supporters</h2>
            <div className="space-y-3">
              {recentSupports.map((support, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{support.supporter_name}</p>
                        {support.message && (
                          <p className="text-sm text-gray-600 mt-1">{support.message}</p>
                        )}
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        ₹{support.amount}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}