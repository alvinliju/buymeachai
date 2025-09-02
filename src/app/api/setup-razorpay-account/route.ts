// app/api/setup-razorpay-account/route.ts
import { auth } from '@clerk/nextjs/server'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return new Response('Unauthorized', { status: 401 })

    const { name, account_number, ifsc, upi_id } = await request.json()

    // Call the update-creator API to store bank details
    const updateResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/update-creator`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bankAccountNumber: account_number,
        ifscCode: ifsc,
        upiId: upi_id,
        // Mark setup as complete since we're just storing details
        account_setup_complete: true
      }),
    })

    if (!updateResponse.ok) {
      throw new Error('Failed to update creator details')
    }

    return Response.json({ 
      success: true,
      message: 'Bank details saved successfully. Payouts will be processed manually.' 
    })
  } catch (error) {
    console.error('Account setup failed:', error)
    return Response.json({ 
      error: 'Failed to save account details' 
    }, { status: 500 })
  }
}

