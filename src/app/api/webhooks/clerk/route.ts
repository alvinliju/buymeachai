import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Fix: await headers() for Next.js 15
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', { status: 400 })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: any

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', { status: 400 })
  }

  const { id } = evt.data
  const eventType = evt.type

  if (eventType === 'user.created') {
    const { email_addresses, first_name, last_name, image_url } = evt.data
    
    // Create username from email
    const username = email_addresses[0].email_address.split('@')[0].toLowerCase()
    
    console.log('Creating user with avatar:', image_url) // Debug log
    
    await supabase.from('creators').insert({
      clerk_user_id: id,
      username,
      display_name: `${first_name} ${last_name}`.trim() || username,
      avatar_url: image_url, // 🎯 Store the avatar URL here!
    })
  }

  // Handle avatar updates when user updates their profile
  if (eventType === 'user.updated') {
    const { image_url } = evt.data
    
    console.log('Updating user avatar:', image_url) // Debug log
    
    await supabase
      .from('creators')
      .update({ avatar_url: image_url })
      .eq('clerk_user_id', id)
  }

  return new Response('', { status: 200 })
}