import { z } from 'zod'

import { createEnv } from '@t3-oss/env-nextjs'

const isDevelopment = process.env.NODE_ENV === 'development'

export const env = createEnv({
  server: {
    HEURIST_GATEWAY_URL: z.string().min(1),
    HEURIST_AUTH_KEY: z.string().min(1),
    UPSTASH_REDIS_REST_URL: isDevelopment
      ? z.string().optional()
      : z.string().min(1),
    UPSTASH_REDIS_REST_TOKEN: isDevelopment
      ? z.string().optional()
      : z.string().min(1),
    DATABASE_URL: isDevelopment ? z.string().optional() : z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_BACKEND_URL: z.string().min(1),
  },
  runtimeEnv: {
    HEURIST_GATEWAY_URL: process.env.HEURIST_GATEWAY_URL,
    HEURIST_AUTH_KEY: process.env.HEURIST_AUTH_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  },
})
