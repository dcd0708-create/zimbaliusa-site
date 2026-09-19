// Node-only shared templates. Run node scripts/inline-partials.cjs before commit.
module.exports = function renderPartials(HERE = '') {
const NAV_LINKS = [
  { href: '/',                label: 'Home',                 id: 'home' },
  { href: '/cooking-show',    label: 'Live Cooking Show',    id: 'cooking-show' },
  { href: '/private-chef',    label: 'Private Chef',         id: 'private-chef' },
  { href: '/cooking-classes', label: 'Cooking Classes',      id: 'cooking-classes' },
  { href: '/menus',           label: 'Menus',                id: 'menus' },
  { href: '/about',           label: 'About',                id: 'about' },
  { href: '/press',           label: 'Press',                id: 'press' },
];

const resolve = (p) => {
  // Absolute paths starting with / stay as-is for real hosting; on file:// they'll still work
  return p;
};

const navHtml = NAV_LINKS.map(l =>
  `<a href="${resolve(l.href)}"${l.id === HERE ? ' aria-current="page"' : ''}>${l.label}</a>`
).join('');

const mobileNavHtml = NAV_LINKS.map(l =>
  `<a href="${resolve(l.href)}"${l.id === HERE ? ' aria-current="page"' : ''}>${l.label}</a>`
).join('') + `<a href="${resolve('/book')}" class="btn btn-primary">Check Your Date</a>`;

// ---------- HEADER ----------
const headerHtml = `
<header class="site-header${HERE === 'home' ? '' : ' is-scrolled'}" id="site-header">
  <div class="header-inner">
    <a href="${resolve('/')}" class="brand" aria-label="Zimbali USA — Home">
      <svg class="brand-mark" viewBox="0 0 40 40" aria-hidden="true">
        <path d="M8 8 L32 8 L8 32 L32 32" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square" stroke-linejoin="miter"/>
        <circle cx="20" cy="20" r="1.8" fill="currentColor"/>
      </svg>
      <span class="brand-name">Zimbali<span class="brand-name-accent">USA</span></span>
    </a>
    <a class="header-phone" href="tel:+19413155085">(941) 315-5085</a>
    <nav class="nav" aria-label="Primary">${navHtml}</nav>
    <a href="${resolve('/book')}" class="btn btn-primary btn-sm">Check Your Date</a>
    <button class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">
      <span></span><span></span><span></span>
    </button>
  </div>
  <div class="mobile-nav" id="mobile-nav" hidden>${mobileNavHtml}</div>
</header>
`;

// ---------- CTA BAND ----------
const ctaBandHtml = `
<section class="cta-band" aria-label="Book Chef Alecia">
  <div class="cta-band-inner">
    <p class="eyebrow">Sarasota &middot; Bradenton &middot; Siesta Key &middot; Longboat &middot; Anna Maria</p>
    <h2 class="cta-band-title">Two guests or thirty. Your kitchen, <em>your date.</em></h2>
    <a href="${resolve('/book')}" class="btn btn-primary">Check Your Date</a>
  </div>
</section>
`;

// ---------- FOOTER ----------
const footerHtml = `
<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-brand">
      <p class="footer-name">Zimbali USA <span>— Chef Alecia</span></p>
      <p class="footer-desc">
        Private chef and live Jamaican cooking shows in Sarasota, Bradenton, Siesta Key, Longboat Key, Lido Key, Anna Maria Island, Lakewood Ranch, Venice, Osprey, Nokomis, and Palmetto.
      </p>
      <p class="footer-contact">
        <a href="mailto:alecia@zimbaliusa.com">alecia@zimbaliusa.com</a><br />
        <a href="tel:+19413155085">(941) 315-5085</a>
      </p>
    </div>
    <div class="footer-links">
      <div class="footer-col">
        <p class="footer-heading">Experiences</p>
        <a href="${resolve('/cooking-show')}">Live Cooking Show</a>
        <a href="${resolve('/private-chef')}">Private Chef</a>
        <a href="${resolve('/cooking-classes')}">Cooking Classes</a>
        <a href="${resolve('/menus')}">Menus</a>
      </div>
      <div class="footer-col">
        <p class="footer-heading">Service Areas</p>
        <a href="${resolve('/private-chef/siesta-key')}">Siesta Key</a>
        <a href="${resolve('/private-chef/longboat-key')}">Longboat Key</a>
        <a href="${resolve('/private-chef/anna-maria-island')}">Anna Maria Island</a>
        <a href="${resolve('/private-chef/lakewood-ranch')}">Lakewood Ranch</a>
      </div>
      <div class="footer-col">
        <p class="footer-heading">Chef Alecia</p>
        <a href="${resolve('/about')}">About</a>
        <a href="${resolve('/press')}">Press</a>
        <a href="https://www.amazon.com/Forgotten-Wisdoms-Ancient-African-Traditions/dp/B0F2YD5M5Q" rel="noopener" target="_blank">Forgotten Wisdoms (the book)</a>
      </div>
      <div class="footer-col">
        <p class="footer-heading">Elsewhere</p>
        <a href="https://www.instagram.com/zimbaliretreats/" rel="noopener" target="_blank">Instagram</a>
        <a href="https://www.facebook.com/zimbaliretreatsjamaica" rel="noopener" target="_blank">Facebook</a>
        <a href="${resolve('/book')}">Check Your Date</a>
      </div>
    </div>
  </div>
  <div class="footer-fine">
    <p>Chef Alecia cooks in your home kitchen. ServSafe certified. Fully insured.</p>
    <p>&copy; 2026 Zimbali USA</p>
  </div>
</footer>
`;


return { header: headerHtml, footer: footerHtml, cta: ctaBandHtml };
};
