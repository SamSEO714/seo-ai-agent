# Free Groq API Setup

The app now uses this model by default:

```env
GROQ_MODEL=qwen/qwen3.6-27b
```

This is a Groq-hosted Qwen model and does not require an OpenAI API key.

## 1. Create the free API key

1. Open the Groq Console: `https://console.groq.com/keys`
2. Sign in or create an account.
3. Click **Create API Key**.
4. Give it a name such as `seo-ai-agent`.
5. Copy the key immediately.

Never put the key inside frontend React components or commit it to GitHub.

## 2. Local development

Create a file named `.env.local` in the project root:

```env
GROQ_API_KEY=gsk_your_real_key_here
GROQ_MODEL=qwen/qwen3.6-27b
```

Then run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## 3. Vercel deployment

In Vercel:

1. Open your project.
2. Go to **Settings → Environment Variables**.
3. Add:

```env
GROQ_API_KEY=gsk_your_real_key_here
GROQ_MODEL=qwen/qwen3.6-27b
```

4. Select Production, Preview, and Development environments as needed.
5. Save the variables.
6. Go to **Deployments** and redeploy the latest deployment.

If an old `GROQ_MODEL=openai/gpt-oss-20b` variable already exists, edit or delete it before redeploying.

## 4. Other APIs

Only `GROQ_API_KEY` is needed for real AI content analysis. These are optional:

```env
GOOGLE_PAGESPEED_API_KEY=
GOOGLE_CUSTOM_SEARCH_API_KEY=
GOOGLE_CSE_ID=
```

Without optional keys, the app uses its built-in fallback data for those sections.

## Security

- Do not share your `gsk_...` key publicly.
- Do not add `.env.local` to GitHub.
- If a key is exposed, revoke it in Groq Console and create a new one.

## Current Free Plan note

At the time this package was updated, Groq listed Free Plan limits for `qwen/qwen3.6-27b`. Limits can change, so check your Groq account's **Settings → Limits** page if you receive a `429 Too Many Requests` error.
