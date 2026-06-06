# railwayfront → Cloudflare (Optimized for SSR)

This is an **optimized version** of `rnrizki/railwayfront` (Nuxt 3 e-commerce) configured for **Cloudflare Workers / Pages** with excellent SSR performance.

## Key Optimizations Applied

- **`preset: 'cloudflare-pages'`** (best choice for Nuxt 3 + SSR + assets in 2026)
- **SSR enabled by default** (`ssr: true`)
- **Smart Hybrid Rendering** using `routeRules`:
  - **Prerender** static pages (home, brands, categories, flash-sale)
  - **SWR** (Stale-While-Revalidate) for shop/product pages → fast + fresh data
  - **Full SSR** (no cache) for cart, checkout, user account pages
- Added `nodejs_compat` flag
- Vite bundle optimizations
- Preserved custom robots.txt + sitemap.xml handlers

This gives you:
- Excellent SEO
- Fast initial page load (especially on edge)
- Good balance between performance and dynamic content
- Lower Worker CPU usage thanks to caching

## What was changed

- `nitro.preset` + full `routeRules` optimized for SSR + caching
- `ssr: true` enabled by default
- Added `wrangler.toml`
- Updated `package.json` with Cloudflare scripts + `wrangler`
- Vite build optimizations

## How to use this (recommended steps)

### Option 1: Fork + Apply Changes (Easiest)

1. Go to https://github.com/rnrizki/railwayfront and **fork** it to your account.
2. Clone your fork locally.
3. Replace these files with the ones from this folder:
   - `nuxt.config.js`
   - `package.json`
   - Add the new `wrangler.toml`
4. Commit and push.

### Option 2: Use this prepared folder

Copy the files from this `railwayfront-cloudflare-worker` folder into your forked repo.

## Local Development (same as before)

```bash
npm install
npm run dev
```

## Build for Cloudflare (Pages + Worker)

```bash
# Recommended (cloudflare-pages preset)
npm run build:pages

# Alternative for pure Worker
npm run build:worker
```

This outputs to `.output/` ready for deployment.

## Deploy to Cloudflare

### 1. Install Wrangler globally (if not already)

```bash
npm install -g wrangler
```

### 2. Login to Cloudflare

```bash
wrangler login
```

### 3. Deploy

```bash
npm run deploy
```

Or manually:

```bash
npx wrangler deploy
```

## Cloudflare CLI Commands (New Convenience Scripts)

We added easy npm scripts so you don't have to remember long commands:

| Command              | What it does                                      |
|----------------------|---------------------------------------------------|
| `npm run cf:login`   | Login to Cloudflare                               |
| `npm run cf:whoami`  | Check current logged-in account                   |
| `npm run cf:secret`  | Set `REFRESH_SECRET` (for cache refresh endpoint) |
| `npm run cf:deploy`  | Deploy to Cloudflare Pages                        |
| `npm run deploy:clean` | Clear cache + build + deploy (recommended)     |

**Example usage:**

```bash
npm run cf:login
npm run cf:secret          # Set your refresh secret
npm run deploy:clean         # Best way to deploy
```

## Clearing Nitro Cache + Getting Fresh Backend Data

### Method 1: Using npm script (Recommended)

```bash
npm run cache:clear
```

### Method 2: Using the Admin Endpoint (No rebuild needed)

After setting the secret, you can force fresh data from backend:

```bash
curl -X POST https://your-domain.com/api/admin/refresh-cache \
  -H "Content-Type: application/json" \
  -d '{"secret": "YOUR_SECRET_HERE"}'
```

## Environment Variables

Set them in `wrangler.toml` under `[vars]` or via Cloudflare dashboard / `wrangler secret`.

Key variables from original:
- `API_BASE` (usually "/")
- `SSR` ("true" or "false")
- `APP_NAME`
- `REFRESH_SECRET` (for admin cache refresh endpoint)

## Clearing Nitro Cache (New!)

To **manually clear Nitro cache** from CLI (very useful when you have stale data, changed `routeRules`, or after updating components):

```bash
npm run cache:clear
# or
npm run cleanup
# or directly
npx nuxi cleanup
```

This command removes the `.nuxt` and `.output` folders, clearing all Nitro build cache and generated files.

**When to use it:**
- After modifying `routeRules` in `nuxt.config.js`
- When seeing outdated cached pages during development
- Before a fresh build/deploy

## SSR Best Practices & Tips for Cloudflare Workers

### 1. Hybrid Rendering Strategy (Already Configured)
- **Prerendered**: Home, Brands, Categories, Flash Sale → instant load + perfect SEO
- **SWR (recommended)**: Shop pages, product listings → fast + updates in background
- **Full SSR**: Login, Cart, Checkout, User dashboard → always fresh (needed for auth)

### 2. Important Code Considerations for SSR
Make sure these patterns are followed in your `.vue` files:

```vue
<!-- Good: works on server + client -->
<script setup>
const { data } = await useFetch('/api/products')
</script>

<!-- Avoid in top-level (will break SSR) -->
<script setup>
if (process.client) {
  localStorage.getItem(...)   // ← move inside onMounted or use useState
}
</script>
```

**Common fixes needed:**
- Move `localStorage`, `window`, `document` usage inside `onMounted()` or `if (process.client)`
- Use `useState()` or Pinia for shared state instead of globals
- Auth tokens: store in cookies (httpOnly recommended) or use `useCookie()`

### 3. PWA + SSR
The `@vite-pwa/nuxt` module works with SSR. If you see issues with service worker, you can disable PWA in dev:
```js
pwa: {
  devOptions: { enabled: false }
}
```

### 4. Performance Tips
- Keep `routeRules` aggressive on cacheable pages
- Use `useFetch` with `cache` option where possible
- For very heavy pages, consider `ssr: false` on that specific page using `definePageMeta({ ssr: false })`

### 5. Testing SSR Locally
```bash
SSR=true npm run dev
```

Then check View Page Source — you should see rendered HTML.

## Notes
- All your existing pages, components, i18n, and PWA should continue to work.
- The custom `/robots.txt` and `/sitemap.xml` handlers are preserved.
- `nodejs_compat` flag is enabled for better compatibility.
- If you encounter any package that doesn't work in the Worker runtime, we can replace it.

## Need help?

Just paste any error you're getting and I'll help you fix it!
