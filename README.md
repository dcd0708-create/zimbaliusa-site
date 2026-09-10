# Zimbali USA

Website for Zimbali USA — Chef Alecia's Jamaican cooking shows, private chef services, and cooking classes in Sarasota, Bradenton, Siesta Key, and the surrounding Florida Gulf Coast.

**Live site:** [zimbaliusa.com](https://zimbaliusa.com)

## Stack

Static HTML/CSS/JS. No build step. Deployed via Cloudflare Pages.

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
partials.js             Header, footer, CTA band (shared across pages)
site.js                 Interactivity
style.css               Full stylesheet
images/                 Photography
```

## Local preview

```bash
python3 -m http.server 8000
# Open http://localhost:8000
```

## Deploy

Cloudflare Pages watches the `main` branch. Every push to `main` triggers a production deploy. Pull requests get preview URLs automatically.

## Deployment

Auto-deploys via Cloudflare Pages. Every push to `main` triggers a production build. Every push to any other branch creates a preview URL.
