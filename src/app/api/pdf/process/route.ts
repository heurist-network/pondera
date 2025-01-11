import { NextRequest } from 'next/server'

import { api } from '@/lib/workspaceApi'

export async function POST(req: NextRequest) {
  try {
    const file = (await req.formData()).get('file') as File

    if (!file) {
      return new Response('No file provided', { status: 400 })
    }

    await api.processPdf(file)

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
