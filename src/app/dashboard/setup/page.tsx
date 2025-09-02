// app/dashboard/setup/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export default function SetupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    bio: '',
    upiId: '',
    accountNumber: '',
    ifscCode: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Directly update creator profile with all details
      const response = await fetch('/api/update-creator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: formData.displayName,
          username: formData.username,
          bio: formData.bio,
          upiId: formData.upiId,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode,
          account_setup_complete: true,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Setup failed')
      }

      alert('Profile setup complete! 🎉')
      router.push('/dashboard')
    } catch (error) {
      console.error('Setup failed:', error)
      alert(error instanceof Error ? error.message : 'Setup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <p className="text-sm text-gray-600">
            Set up your creator profile to start receiving chai donations
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Info */}
            <div>
              <label className="block text-sm font-medium mb-1">Display Name</label>
              <Input
                required
                value={formData.displayName}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  displayName: e.target.value
                }))}
                placeholder="Your display name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <Input
                required
                value={formData.username}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  username: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')
                }))}
                pattern="[a-z0-9]+"
                title="Only lowercase letters and numbers allowed"
                placeholder="yourname"
              />
              <p className="text-xs text-gray-500 mt-1">
                Your page will be: buymeachai.com/{formData.username}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  bio: e.target.value
                }))}
                placeholder="Tell your supporters about yourself..."
                rows={3}
              />
            </div>

            {/* Payment Info */}
            <div className="pt-4 border-t">
              <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
              <p className="text-sm text-gray-600 mb-4">
                We'll use these details for manual payouts (processed weekly)
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">UPI ID (Preferred)</label>
                  <Input
                    required
                    value={formData.upiId}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      upiId: e.target.value
                    }))}
                    placeholder="yourname@upi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Bank Account Number</label>
                  <Input
                    required
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      accountNumber: e.target.value
                    }))}
                    placeholder="Account number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">IFSC Code</label>
                  <Input
                    required
                    value={formData.ifscCode}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      ifscCode: e.target.value.toUpperCase()
                    }))}
                    pattern="^[A-Z]{4}0[A-Z0-9]{6}$"
                    title="Please enter a valid IFSC code"
                    placeholder="SBIN0001234"
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Setting up...' : 'Complete Setup'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}