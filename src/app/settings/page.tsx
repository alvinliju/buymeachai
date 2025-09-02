import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { UserProfile } from '@clerk/nextjs'

export default async function SettingsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/login')
  }

  const { data: creator } = await supabase
    .from('creators')
    .select('*')
    .eq('clerk_user_id', userId)
    .single()

  if (!creator) {
    redirect('/dashboard/setup')
  }

  // Call Clerk API to get profile pic (same as user page)
  let avatarUrl = '/default-avatar.png'
  let clerkDisplayName = creator.display_name
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
      clerkDisplayName = `${clerkUser.first_name || ''} ${clerkUser.last_name || ''}`.trim() || creator.display_name
    }
  } catch (error) {
    console.error('Failed to fetch from Clerk:', error)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={avatarUrl}
                alt={clerkDisplayName}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold">{clerkDisplayName}</h3>
                <p className="text-gray-600">@{creator.username}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <p className="text-gray-700">{creator.bio || 'No bio added yet'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Clerk Profile Management */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-full">
              <UserProfile 
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none border-0 w-full"
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">UPI ID</label>
              <p className="text-gray-700">{creator.upi_id || 'Not set'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bank Account</label>
              <p className="text-gray-700">
                {creator.bank_account_number ? `****${creator.bank_account_number.slice(-4)}` : 'Not set'}
              </p>
            </div>
            <Link 
              href="/settings/payment"
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Update Payment Info
            </Link>
          </CardContent>
        </Card>

        {/* Account Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Account Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                    ₹{Math.floor(creator.total_earnings || 0)}
                </p>
                <p className="text-sm text-gray-600">Total Earnings</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{creator.supporter_count || 0}</p>
                <p className="text-sm text-gray-600">Total Supporters</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Public Page Link */}
        <Card>
          <CardHeader>
            <CardTitle>Your Public Page</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Share your page with supporters:</p>
                <p className="text-orange-600">buymeachai.com/{creator.username}</p>
              </div>
              <Link 
                href={`/${creator.username}`}
                target="_blank"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                View Page
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
