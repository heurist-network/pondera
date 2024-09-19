import { z } from 'zod'

import { createEnv } from '@t3-oss/env-nextjs'

export const env = createEnv({
  server: {
    HEURIST_GATEWAY_URL: z.string().min(1),
    HEURIST_AUTH_KEY: z.string().min(1),
    UPSTASH_REDIS_REST_URL: z.string().min(1),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
    DATABASE_URL: z.string().min(1),
    // UMAMI_URL: z.string().optional(),
    // UMAMI_WEBSITE_ID: z.string().optional(),
  },
  client: {
    // NEXT_PUBLIC_PUBLISHABLE_KEY: z.string().min(1),
  },
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  runtimeEnv: {
    HEURIST_GATEWAY_URL: process.env.HEURIST_GATEWAY_URL,
    HEURIST_AUTH_KEY: process.env.HEURIST_AUTH_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    DATABASE_URL: process.env.DATABASE_URL,
    // OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
    // NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
  },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  // experimental__runtimeEnv: {
  //   NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
  // }
})
