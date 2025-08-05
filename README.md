# Pondera - AI Chat Platform

Pondera is an AI chat platform that supports multiple AI models. Access it at [pondera.heurist.ai](https://pondera.heurist.ai).

## Features

### Direct Model Access via URL

You can directly open Pondera with a specific AI model pre-selected by using the `model` parameter in the URL:

```
https://pondera.heurist.ai/?model=MODEL_ID
```

**Example - Open with GPT model:**
```
https://pondera.heurist.ai/?model=openai/gpt-4o
```

This feature is useful for:
- Sharing links that open with a specific model
- Creating bookmarks for frequently used models
- Deep linking from documentation or other applications

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
