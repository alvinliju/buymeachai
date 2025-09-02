
'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'


export default function SettingsPage() {
  const [creator, setCreator] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch creator data
    fetch('/api/creator')
      .then(res => res.json())
      .then(data => setCreator(data))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await fetch('/api/update-creator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creator),
      })
      alert('Settings updated successfully!')
    } catch (error) {
      alert('Failed to update settings')
    } finally {
      setLoading(false)
    }
  }

  if (!creator) return <div>Loading...</div>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Same form fields as setup page */}
            {/* But pre-filled with creator data */}
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}