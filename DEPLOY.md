# Deploying to Vercel

## Deploy with the Vercel CLI

```sh
npm i -g vercel
cd "path/to/claudius"
vercel --prod
```

The included `vercel.json` handles clean URLs, caching, and security headers automatically.

## After the first deploy: set the real domain

The site currently uses the placeholder domain `claudius.example`. Once you know the production domain (your `*.vercel.app` URL or a custom domain), replace `claudius.example` with the real domain in:

- `sitemap.xml`
- `robots.txt`
- every page's `<link rel="canonical">` and Open Graph (`og:url`, `og:image`) tags

Then redeploy with `vercel --prod`.

## Indexing

After the domain is live, add the site in [Google Search Console](https://search.google.com/search-console) and submit `sitemap.xml` (Sitemaps section) so Google can crawl and index the pages.
