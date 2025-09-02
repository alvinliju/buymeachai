import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      creatorId,
      supporterName,
      message,
      amount,
    } = await request.json()

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return Response.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Save support to database
    const { error } = await supabase.from('supports').insert({
      creator_id: creatorId,
      supporter_name: supporterName,
      message,
      amount,
      payment_id: razorpay_payment_id,
    })

    if (error) throw error

    // Update creator stats
    await supabase.rpc('increment_creator_stats', {
      creator_id: creatorId,
      amount_to_add: amount,
    })

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: 'Payment verification failed' }, { status: 500 })
  }
}