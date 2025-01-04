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
    PINECONE_API_KEY: z.string().min(1),
    PINECONE_ENVIRONMENT: z.string().min(1),
    PINECONE_INDEX: z.string().min(1),
  },
  client: {},
  runtimeEnv: {
    HEURIST_GATEWAY_URL: process.env.HEURIST_GATEWAY_URL,
    HEURIST_AUTH_KEY: process.env.HEURIST_AUTH_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    DATABASE_URL: process.env.DATABASE_URL,
    PINECONE_API_KEY: process.env.PINECONE_API_KEY,
    PINECONE_ENVIRONMENT: process.env.PINECONE_ENVIRONMENT,
    PINECONE_INDEX: process.env.PINECONE_INDEX,
  },
})
