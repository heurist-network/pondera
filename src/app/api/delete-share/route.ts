import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { share } from '@/db/schema'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return new Response('missing id')

  const res = await db.delete(share).where(eq(share.deleteId, id))

  return new Response('deleted!')
}
