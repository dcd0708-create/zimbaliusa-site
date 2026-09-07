// ============================================================
// Zimbali USA — shared partials (header, footer, CTA band)
// Injected on load. Every page ships the same nav + footer.
// ============================================================

// Path prefix: root pages use "", nested pages use "../"
const PREFIX = document.documentElement.getAttribute('data-prefix') || '';
const HERE = document.documentElement.getAttribute('data-page') || '';

const NAV_LINKS = [
  { href: '/',                label: 'Home',                 id: 'home' },
  { href: '/cooking-show.html',    label: 'Live Cooking Show',    id: 'cooking-show' },
  { href: '/private-chef.html',    label: 'Private Chef',         id: 'private-chef' },
  { href: '/cooking-classes.html', label: 'Cooking Classes',      id: 'cooking-classes' },
  { href: '/menus.html',           label: 'Menus',                id: 'menus' },
  { href: '/about.html',           label: 'About',                id: 'about' },
  { href: '/press.html',           label: 'Press',                id: 'press' },
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
).join('') + `<a href="${resolve('/book.html')}" class="btn btn-primary">Check Your Date</a>`;

// ---------- HEADER ----------
const headerHtml = `
<header class="site-header" id="site-header">
  <div class="header-inner">
    <a href="${resolve('/')}" class="brand" aria-label="Zimbali USA — Home">
      <svg class="brand-mark" viewBox="0 0 40 40" aria-hidden="true">
        <path d="M8 8 L32 8 L8 32 L32 32" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square" stroke-linejoin="miter"/>
        <circle cx="20" cy="20" r="1.8" fill="currentColor"/>
      </svg>
      <span class="brand-name">Zimbali<span class="brand-name-accent">USA</span></span>
    </a>
    <nav class="nav" aria-label="Primary">${navHtml}</nav>
    <a href="${resolve('/book.html')}" class="btn btn-primary btn-sm">Check Your Date</a>
    <button class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">
      <span></span><span></span><span></span>
    </button>
  </div>
  <div class="mobile-nav" id="mobile-nav" hidden>${mobileNavHtml}</div>
</header>
`;

// ---------- CTA BAND (embeddable anywhere with <div data-partial="cta"></div>) ----------
const ctaBandHtml = `
<section class="cta-band" aria-label="Book Chef Alecia">
  <div class="cta-band-inner">
    <p class="eyebrow">Sarasota &middot; Bradenton &middot; Siesta Key &middot; Longboat &middot; Anna Maria</p>
    <h2 class="cta-band-title">Two guests or thirty. Your kitchen, <em>your date.</em></h2>
    <a href="${resolve('/book.html')}" class="btn btn-primary">Check Your Date</a>
  </div>
</section>
`;

// ---------- FOOTER ----------
const footerHtml = `
<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-brand">
      <p class="footer-name">Zimbali USA <span>— Chef Alecia Swainbank</span></p>
      <p class="footer-desc">
        Private chef and live Jamaican cooking shows in Sarasota, Bradenton, Siesta Key, Longboat Key, Lido Key, Anna Maria Island, Lakewood Ranch, Venice, Osprey, Nokomis, and Palmetto.
      </p>
      <p class="footer-contact">
        <a href="mailto:alecia@zimbaliusa.com">alecia@zimbaliusa.com</a><br />
        <a href="tel:+19412486368">(941) 248-6368</a>
      </p>
    </div>
    <div class="footer-links">
      <div class="footer-col">
        <p class="footer-heading">Experiences</p>
        <a href="${resolve('/cooking-show.html')}">Live Cooking Show</a>
        <a href="${resolve('/private-chef.html')}">Private Chef</a>
        <a href="${resolve('/cooking-classes.html')}">Cooking Classes</a>
        <a href="${resolve('/menus.html')}">Menus</a>
      </div>
      <div class="footer-col">
        <p class="footer-heading">Service Areas</p>
        <a href="${resolve('/private-chef/siesta-key.html')}">Siesta Key</a>
        <a href="${resolve('/private-chef/longboat-key.html')}">Longboat Key</a>
        <a href="${resolve('/private-chef/anna-maria-island.html')}">Anna Maria Island</a>
        <a href="${resolve('/private-chef/lakewood-ranch.html')}">Lakewood Ranch</a>
      </div>
      <div class="footer-col">
        <p class="footer-heading">Chef Alecia</p>
        <a href="${resolve('/about.html')}">About</a>
        <a href="${resolve('/press.html')}">Press</a>
        <a href="https://www.amazon.com/Forgotten-Wisdoms-Ancient-African-Traditions/dp/B0F2YD5M5Q" rel="noopener" target="_blank">Forgotten Wisdoms (the book)</a>
      </div>
      <div class="footer-col">
        <p class="footer-heading">Elsewhere</p>
        <a href="https://www.instagram.com/zimbaliretreats/" rel="noopener" target="_blank">Instagram</a>
        <a href="https://www.facebook.com/zimbaliretreatsjamaica" rel="noopener" target="_blank">Facebook</a>
        <a href="${resolve('/book.html')}">Check Your Date</a>
      </div>
    </div>
  </div>
  <div class="footer-fine">
    <p>Chef Alecia cooks in your home kitchen. ServSafe certified. Fully insured.</p>
    <p>&copy; 2026 Zimbali USA</p>
  </div>
</footer>
`;

// ---------- INJECT ----------
document.addEventListener('DOMContentLoaded', () => {
  const headerSlot = document.querySelector('[data-partial="header"]');
  if (headerSlot) headerSlot.outerHTML = headerHtml;

  document.querySelectorAll('[data-partial="cta"]').forEach(el => {
    el.outerHTML = ctaBandHtml;
  });

  const footerSlot = document.querySelector('[data-partial="footer"]');
  if (footerSlot) footerSlot.outerHTML = footerHtml;

  // Header scroll state (home has transparent-until-scrolled hero,
  // interior pages should have the opaque header from the top)
  const header = document.getElementById('site-header');
  if (header) {
    const isHome = HERE === 'home';
    const onScroll = () => {
      if (!isHome || window.scrollY > 40) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('is-open');
      mobileNav.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
    });
    mobileNav.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        mobileNav.classList.remove('is-open');
        mobileNav.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  // Wire the inquiry form to the Cloudflare Worker at /api/contact
  const form = document.querySelector('.book-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalLabel = btn ? btn.textContent : 'Send inquiry';

      // Clear any previous status message
      let status = form.querySelector('.form-status');
      if (!status) {
        status = document.createElement('div');
        status.className = 'form-status';
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');
        form.appendChild(status);
      }
      status.textContent = '';
      status.classList.remove('is-success', 'is-error');

      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Sending…';
      }

      // Collect fields (fall back to empty string so the Worker gets a clean payload)
      const fd = new FormData(form);
      const data = Object.fromEntries(fd.entries());
      // Coerce checkbox to a real boolean (unchecked boxes don't appear in FormData)
      data.flexible = fd.get('flexible') === 'on';

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const json = await res.json().catch(() => ({}));

        if (res.ok && json.ok) {
          form.reset();
          status.classList.add('is-success');
          status.textContent = 'Thanks — your inquiry is in. Chef Alecia will reply within 24 hours.';
          if (btn) btn.textContent = 'Sent';
          setTimeout(() => {
            if (btn) {
              btn.disabled = false;
              btn.textContent = originalLabel;
            }
          }, 4000);
        } else {
          status.classList.add('is-error');
          status.textContent = 'Something went wrong sending your inquiry. Please try again or email alecia@zimbaliusa.com.';
          if (btn) {
            btn.disabled = false;
            btn.textContent = originalLabel;
          }
        }
      } catch (err) {
        status.classList.add('is-error');
        status.textContent = 'Network error. Please try again or email alecia@zimbaliusa.com.';
        if (btn) {
          btn.disabled = false;
          btn.textContent = originalLabel;
        }
      }
    });
  }

  // Scroll-triggered fade-ins
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });
    document.querySelectorAll('.reveal, .section, .cta-band, .quote').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-in'));
  }
});
