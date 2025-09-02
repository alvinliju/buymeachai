
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return new Response('Unauthorized', { status: 401 })

    const data = await request.json()
    console.log('Update request data:', data)
    console.log('User ID:', userId)

    // Check if username is available (excluding current user)
    const { data: existing } = await supabase
      .from('creators')
      .select('id')
      .eq('username', data.username)
      .not('clerk_user_id', 'eq', userId)
      .single()

    if (existing) {
      return Response.json(
        { error: 'Username already taken' },
        { status: 400 }
      )
    }

    // Check if creator record exists for this user
    const { data: currentCreator } = await supabase
      .from('creators')
      .select('*')
      .eq('clerk_user_id', userId)
      .single()

    console.log('Current creator record:', currentCreator)

    let result
    if (currentCreator) {
      // Update existing creator
      result = await supabase
        .from('creators')
        .update({
          display_name: data.displayName,
          username: data.username,
          bio: data.bio,
          upi_id: data.upiId,
          bank_account_number: data.accountNumber,
          ifsc_code: data.ifscCode,
          account_setup_complete: data.account_setup_complete,
        })
        .eq('clerk_user_id', userId)
        .select()
    } else {
      // Create new creator record
      result = await supabase
        .from('creators')
        .insert({
          clerk_user_id: userId,
          display_name: data.displayName,
          username: data.username,
          bio: data.bio,
          upi_id: data.upiId,
          bank_account_number: data.accountNumber,
          ifsc_code: data.ifscCode,
          account_setup_complete: data.account_setup_complete,
        })
        .select()
    }

    console.log('Database operation result:', result)

    if (result.error) {
      console.error('Database error:', result.error)
      throw result.error
    }

    return Response.json({ 
      success: true, 
      data: result.data,
      operation: currentCreator ? 'updated' : 'created'
    })
  } catch (error) {
    console.error('Profile update failed:', error)
    return Response.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}