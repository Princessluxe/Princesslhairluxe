# Princess Hair Luxe — Deployment Guide

This is a ready-to-deploy version of your site, built with Vite + React + Tailwind.

## Project structure

`src/App.jsx` holds all the site's logic (previously ~940KB because every
product/category/brand photo was embedded as inline base64 text — that's
been cleaned up). Images now live as real files under `src/assets/`, pulled
in through `src/images.js`, which exports the same `PRODUCT_IMAGES`,
`CATEGORY_IMAGES`, `BRAND_IMAGES`, `SOCIAL_ICONS` and `PAYMENT_CARD_IMAGE`
objects as before — nothing about how the app uses them changed. This makes
`App.jsx` small enough to open and edit directly on GitHub's website, and
lets the browser cache images separately instead of re-downloading them
every time the code changes.

## ⚠️ Read this first: the admin data limitation

Inside Claude, the admin panel (products, orders, discount codes) used Claude's
shared cloud storage. That only works inside Claude artifacts.

This version replaces it with **your browser's localStorage** (see
`src/storage.js`) so the site still runs standalone. That means:

- Data is saved **per browser, per device** — not a real shared database.
- An order placed by a customer on their phone will **not** appear in your
  admin panel on your laptop.
- Discount codes generated on one device can't be redeemed from another.
- Clearing your browser's site data wipes everything.

This is fine to launch with and test, but for real multi-device order
management you'll eventually want a proper backend (Firebase, Supabase, or a
small custom API). The rest of the app won't need to change — only
`src/storage.js` would be swapped out. Ask Claude for help with that when
you're ready.

## Deploying with GitHub Desktop (recommended for you — no terminal needed)

This project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`)
that automatically builds and publishes your site every time you push —
whether you push from GitHub Desktop, the terminal, or anything else.

### 1. Create the GitHub repository

1. Go to [github.com/new](https://github.com/new)
2. Name it whatever you like
3. Create it (public, no README/gitignore needed — you already have them)

### 2. Add this project in GitHub Desktop

1. Open GitHub Desktop → **File** → **Add local repository**
2. Browse to the unzipped `princesshairluxe` folder → select it
3. If it says "this directory does not appear to be a Git repository", click
   **"create a repository"** right there in that same dialog

### 3. Commit and publish

1. GitHub Desktop will show all the project's files listed as changes
2. Type a summary (e.g. "Initial commit") in the box bottom-left
3. Click **Commit to main**
4. Click **Publish repository** at the top → make sure it's **not** private → click **Publish**

That's it — your code is now on GitHub, and the Actions workflow starts
building automatically.

### 4. Turn on GitHub Pages (one-time setup)

1. On github.com, go to your repo → **Settings** → **Pages**
2. Under "Build and deployment", set **Source** to **"GitHub Actions"**
   (not "Deploy from a branch" — this project uses Actions instead)

### 5. Check the build

1. On your repo, click the **Actions** tab
2. You should see a workflow run in progress (yellow dot) or finished (green check)
3. Once it's green, go back to **Settings → Pages** — your live URL will be shown at the top:
   ```
   https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
   ```

### Updating the site later

Every time you make changes: open GitHub Desktop → you'll see the changed
files → write a commit message → **Commit to main** → **Push origin**.
The Actions workflow rebuilds and republishes automatically within a minute
or two. Nothing else to run.

## Local testing before you deploy (optional, requires a terminal)

If you want to preview changes on your own computer before pushing:

```bash
npm install
npm run dev
```

Then open the local URL it prints (usually `http://localhost:5173`). This
step is entirely optional — you can also just push via GitHub Desktop and
let the Actions workflow build it for you, then check the live site.

## Custom domain — removed for now

This version does **not** use a custom domain — it's set up to serve from
the plain GitHub Pages URL (`https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`),
since that's the simplest, most reliable setup and avoids DNS-related 404s.

**If you previously entered a custom domain in GitHub**, clear it too:

1. Repo → **Settings** → **Pages**
2. Under "Custom domain", delete whatever's in that field → Save
3. Push any small change via GitHub Desktop to trigger a rebuild (or re-run the workflow from the Actions tab)

Your site will then be reachable at:
```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

If you want to add `princesshairluxe.com` back later, that's straightforward
to re-enable — just ask.

## AI sales assistant (chat widget) — setup

The site has a floating chat assistant (bottom-right) built from your Princess Hair Luxe
agent prompt. Two settings in `src/App.jsx` (the `AGENT_CONFIG` block) make it fully live:

### 1. Order emails → princesshairluxe@gmail.com
1. Create a free form at formspree.io with the destination `princesshairluxe@gmail.com`.
2. Copy its endpoint URL (looks like `https://formspree.io/f/abcdwxyz`).
3. Paste it into `emailEndpoint` in `AGENT_CONFIG`.

Until this is set, chat orders are still saved and appear in the admin Orders tab with a
red "Email not delivered" flag. The assistant tells the customer the order is being held
for confirmation, never that it was forwarded.

### 2. Chat connection (needed on the GitHub-hosted site)
The Anthropic API needs a secret key, which must never be placed in website code.
Use the small proxy in `agent-proxy/worker.js` (Cloudflare Workers, free tier):
1. Create a Worker at dash.cloudflare.com and paste in `worker.js`.
2. Add the secret `ANTHROPIC_API_KEY` and a text variable `ALLOWED_ORIGIN` = `https://YOUR-USERNAME.github.io`.
3. Put the Worker's URL into `apiUrl` in `AGENT_CONFIG`.
4. In the Anthropic console, set a monthly spend limit. The proxy checks the origin, caps
   response size and forces the model, but it cannot fully stop someone deliberately
   calling it, so a spend limit is your real protection.

If the chat can't connect, it shows a WhatsApp link instead of failing silently.
