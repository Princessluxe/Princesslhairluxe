# Princess Hair Luxe — Deployment Guide

This is a ready-to-deploy version of your site, built with Vite + React + Tailwind.

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
