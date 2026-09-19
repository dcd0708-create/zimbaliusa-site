# Zimbali USA

Website for Zimbali USA — Chef Alecia's Jamaican cooking shows, private chef services, and cooking classes in Sarasota, Bradenton, Siesta Key, and the surrounding Florida Gulf Coast.

**Live site:** [zimbaliusa.com](https://zimbaliusa.com)

## Stack

Static HTML/CSS/JS. No hosting build step. Deployed via Cloudflare Pages.
Shared HTML is generated locally before commit using Node (no dependencies).

## Structure

```
index.html              Home page
cooking-show.html       Live Cooking Show
private-chef.html       Private Chef
cooking-classes.html    Cooking Classes
menus.html              Menus
book.html               Booking form
about.html              About Chef Alecia
press.html              Press & recognition
partials.js             Node-only header, footer, CTA templates
scripts/inline-partials.cjs  Pre-commit shared-HTML generator
site.js                 Interactivity
style.css               Full stylesheet
images/                 Photography
```

## Local preview

After changing the header, footer, or CTA, edit `partials.js`, then run:

```bash
node scripts/inline-partials.cjs
node scripts/inline-partials.cjs --check
```

Commit both the template and all regenerated HTML files. Do not edit between
`<!-- partial:NAME:start -->` and `<!-- partial:NAME:end -->` in individual pages:
the next generator run replaces those blocks. Page-specific content outside
the blocks is preserved. New pages need `data-page` on the `html` element and
`<div data-partial="header"></div>` / footer / CTA slots before the first run.

Every served page contains the complete navigation, footer, CTA (where used),
email address, and click-to-call phone links without JavaScript. `site.js` only
enhances navigation, scroll styling, animations, and inquiry-form submission.
The homepage FAQ must stay identical to its FAQPage JSON-LD.

```bash
python3 -m http.server 8000
# Open http://localhost:8000
```

## Deploy

Cloudflare Pages watches the `main` branch. Every push to `main` triggers a production deploy. Pull requests get preview URLs automatically.

## Deployment

Auto-deploys via Cloudflare Pages. Every push to `main` triggers a production build. Every push to any other branch creates a preview URL.
