import { drizzle } from 'drizzle-orm/neon-http'

import { env } from '@/env'
import { neon } from '@neondatabase/serverless'

import * as schema from './schema'

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not defined')
export const db = drizzle(neon(env.DATABASE_URL), { schema })
