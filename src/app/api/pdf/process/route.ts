import { NextRequest } from 'next/server'

import { env } from '@/env'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return new Response('No file provided', { status: 400 })
    }

    // forward to flask backend
    const flaskFormData = new FormData()
    flaskFormData.append('file', file)

    const response = await fetch(`${env.FLASK_API_URL}/pdf/process`, {
      method: 'POST',
      body: flaskFormData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to process PDF')
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error processing PDF:', error)
    return new Response(JSON.stringify({ error: 'Failed to process PDF' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
