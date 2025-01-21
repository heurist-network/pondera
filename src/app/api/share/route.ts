import { nanoid } from 'nanoid'
import { NextResponse } from 'next/server'

import { db } from '@/db'
import { share } from '@/db/schema'
import { redis } from '@/lib/redis'
import { Ratelimit } from '@upstash/ratelimit'

export const runtime = 'edge'

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '12 h'),
  analytics: true,
})

export async function POST(request: Request) {
  try {
    const { model, title, list } = await request.json()

    const identifier =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((request as any).ip || request.headers.get('X-Forwarded-For')) + '-share'

    console.log(identifier, 'identifier')

    // ip rate limits
    const { success } = await ratelimit.limit(identifier)

    console.log(success, 'success')

    if (!success) {
      return new Response('Too Many Requests', {
        status: 429,
      })
    }

    console.log(list, 'list')

    if (!list?.length) {
      return NextResponse.json(
        { code: -1, msg: 'list cannot be empty' },
        { status: 500 },
      )
    }
    const id = nanoid()
    const deleteId = nanoid()

    await db.insert(share).values({
      id,
      model,
      name: title,
      list,
      deleteId,
    })

    return NextResponse.json({
      code: 0,
      msg: 'success',
      data: { id, deleteId },
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error, 'create tokens error')
    return NextResponse.json(
      { code: -1, msg: error.message || 'create tokens error' },
      { status: 500 },
    )
  }
}
