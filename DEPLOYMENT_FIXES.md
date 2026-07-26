# Deployment Fixes Applied

## Main fixes

- Fixed TypeScript mismatches in the KPI dashboard data.
- Updated the default Groq model to `qwen/qwen3.6-27b`; it can be overridden with `GROQ_MODEL`.
- Added strict URL validation and blocked localhost/private-network audit targets.
- Added request timeouts and `no-store` caching for external SEO APIs.
- Parallelized independent audit API calls to reduce serverless execution time.
- Added safe parsing and production-safe error responses to the audit and fix API routes.
- Normalized AI responses so missing `affectedPages` data does not crash the UI.
- Removed the Google-font build dependency and switched to a system font stack.
- Removed `trailingSlash` configuration that was unnecessary for the App Router API routes.
- Pinned the runtime to Node.js 20 and added a standard `next-env.d.ts`.
- Updated component types for fix results and crawled pages.

## Vercel setup

Add these values in **Project Settings → Environment Variables**:

```env
GOOGLE_PAGESPEED_API_KEY=
GOOGLE_CUSTOM_SEARCH_API_KEY=
GOOGLE_CSE_ID=
GROQ_API_KEY=
GROQ_MODEL=qwen/qwen3.6-27b
```

Only the keys for APIs you plan to use are required. Do not commit `.env.local`.

## Commands

```bash
npm install
npm run typecheck
npm run build
npm start
```
