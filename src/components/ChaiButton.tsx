'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ChaiButtonProps {
  creatorId: string
  creatorName: string
}

declare global {
  interface Window {
    Razorpay: any
  }
}

interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

export default function ChaiButton({ creatorId, creatorName }: ChaiButtonProps) {
  const [amount, setAmount] = useState(50)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  const amounts = [50, 100, 200, 500]

  useEffect(() => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      setRazorpayLoaded(true)
      return
    }

    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => {
      setRazorpayLoaded(true)
    }
    script.onerror = () => {
      console.error('Failed to load Razorpay script')
    }
    document.body.appendChild(script)

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const handlePayment = async () => {
    if (!name.trim()) return
    
    if (!razorpayLoaded) {
      alert('Payment system is loading. Please try again in a moment.')
      return
    }
    
    setLoading(true)
    
    try {
      // Create order
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, creatorId }),
      })
      
      if (!orderRes.ok) {
        throw new Error('Failed to create order')
      }
      
      const order = await orderRes.json()

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: 'BuyMeAChai',
        description: `Support ${creatorName} with chai ☕`,
        handler: async (response: RazorpayResponse) => {
          try {
            // Verify payment
            const verifyRes = await fetch('/api/verify-payments', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...response,
                creatorId,
                supporterName: name,
                message,
                amount,
              }),
            })
            
            if (verifyRes.ok) {
              alert('Thank you for the chai! ☕')
              setName('')
              setMessage('')
              window.location.reload()
            } else {
              throw new Error('Payment verification failed')
            }
          } catch (error) {
            console.error('Payment verification failed:', error)
            alert('Payment completed but verification failed. Please contact support.')
          }
        },
        prefill: { name },
        theme: { color: '#f97316' },
        modal: {
          ondismiss: () => {
            setLoading(false)
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Payment failed:', error)
      alert('Payment failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Buy {creatorName} a chai ☕</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          {amounts.map((amt) => (
            <Button
              key={amt}
              variant={amount === amt ? 'default' : 'outline'}
              onClick={() => setAmount(amt)}
              className="text-sm"
            >
              ₹{amt}
            </Button>
          ))}
        </div>
        
        <Input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        
        <Textarea
          placeholder="Say something nice..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
        />
        
        <Button
          onClick={handlePayment}
          disabled={!name.trim() || loading || !razorpayLoaded}
          className="w-full bg-orange-500 hover:bg-orange-600"
        >
          {!razorpayLoaded 
            ? 'Loading payment system...' 
            : loading 
            ? 'Processing...' 
            : `Support with ₹${amount}`
          }
        </Button>
      </CardContent>
    </Card>
  )
}