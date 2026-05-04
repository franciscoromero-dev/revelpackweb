/* ===========================
   REVELPACK — JS PRINCIPAL
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- MOBILE NAV ----
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileClose = document.querySelector('.mobile-nav-close');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
    mobileClose?.addEventListener('click', closeMobileNav);
    mobileNav.addEventListener('click', (e) => {
      if (e.target === mobileNav) closeMobileNav();
    });
  }

  function closeMobileNav() {
    mobileNav?.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ---- FAQ ACCORDION ----
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const inner = item.querySelector('.faq-answer-inner');

    question?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(i => {
        i.classList.remove('open');
        const a = i.querySelector('.faq-answer');
        if (a) a.style.maxHeight = '0';
      });

      // Open clicked (if was closed)
      if (!isOpen && answer && inner) {
        item.classList.add('open');
        answer.style.maxHeight = inner.scrollHeight + 40 + 'px';
      }
    });
  });

  // ---- SCROLL REVEAL ----
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // ---- STICKY HEADER SHADOW ----
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (header) {
      header.style.boxShadow = window.scrollY > 10
        ? '0 4px 24px rgba(0,0,0,0.1)'
        : '0 2px 12px rgba(0,0,0,0.06)';
    }
  }, { passive: true });

  // ---- SMOOTH ANCHOR LINKS ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        closeMobileNav();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
