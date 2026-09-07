// Header scroll state
const header = document.getElementById('site-header');
const onScroll = () => {
  if (window.scrollY > 40) header.classList.add('is-scrolled');
  else header.classList.remove('is-scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const mobileNav = document.getElementById('mobile-nav');
if (toggle && mobileNav) {
  toggle.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('is-open');
    mobileNav.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
  });
  mobileNav.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      mobileNav.classList.remove('is-open');
      mobileNav.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    })
  );
}

// Booking-inquiry form → POST to /api/contact (Cloudflare Worker → Resend → alecia@zimbaliusa.com)
const form = document.querySelector('.book-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn ? btn.textContent : '';

    // Clear old status
    const oldStatus = form.querySelector('.form-status');
    if (oldStatus) oldStatus.remove();

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Sending…';
    }

    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    data.flexible = fd.get('flexible') === 'on';

    const showStatus = (msg, kind) => {
      const p = document.createElement('p');
      p.className = `form-status form-status--${kind}`;
      p.setAttribute('role', kind === 'error' ? 'alert' : 'status');
      p.textContent = msg;
      form.appendChild(p);
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));

      if (res.ok && body.ok) {
        form.reset();
        if (btn) {
          btn.textContent = 'Sent — check your email';
          btn.disabled = true;
        }
        showStatus('Thanks — Chef Alecia (or Mark) will reply within one business day.', 'success');
      } else {
        if (btn) {
          btn.disabled = false;
          btn.textContent = original;
        }
        showStatus('Something went wrong. Please email alecia@zimbaliusa.com directly.', 'error');
      }
    } catch (err) {
      if (btn) {
        btn.disabled = false;
        btn.textContent = original;
      }
      showStatus('Network error. Please email alecia@zimbaliusa.com directly.', 'error');
    }
  });
}
