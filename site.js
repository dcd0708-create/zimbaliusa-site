// Progressive enhancement only; all shared content is already in the HTML.
document.documentElement.classList.add('js-enabled');
document.addEventListener('DOMContentLoaded', () => {
  const HERE = document.documentElement.getAttribute('data-page') || '';
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
