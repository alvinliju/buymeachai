import { NextRequest } from 'next/server'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const { amount, creatorId } = await request.json()
    
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `chai_${Date.now()}`,
    })

    return Response.json(order)
  } catch (error) {
    return Response.json({ error: 'Failed to create order' }, { status: 500 })
  }
}