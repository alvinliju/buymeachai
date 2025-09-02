import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/login')
  }

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
    .eq('clerk_user_id', userId)
    .single()

  // If no creator record, show setup message instead of redirecting
  if (!creator?.account_setup_complete) {
    redirect('/dashboard/setup')
  }

  const recentSupports = creator.supports
    ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    ?.slice(0, 20) || []

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              ₹{Math.floor(creator.total_earnings / 100)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Supporters</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{creator.supporter_count}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Page</CardTitle>
          </CardHeader>
          <CardContent>
            <a 
              href={`/${creator.username}`}
              className="text-blue-600 hover:underline"
              target="_blank"
            >
              buymeachai.com/{creator.username}
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Recent Supports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Supporters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSupports.map((support, index) => (
              <div key={index} className="flex justify-between items-start p-4 border rounded">
                <div>
                  <p className="font-semibold">{support.supporter_name}</p>
                  {support.message && (
                    <p className="text-sm text-gray-600 mt-1">{support.message}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(support.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  ₹{support.amount}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}