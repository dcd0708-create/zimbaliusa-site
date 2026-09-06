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

// Prevent double-submission on the inquiry form (front-end stub for the preview)
const form = document.querySelector('.book-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Preview mode — form not wired yet';
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'Send inquiry';
      }, 2400);
    }
  });
}
