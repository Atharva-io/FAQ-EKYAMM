// ============================================
// EKYAMM FAQ - Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar Scroll Effect ──
  const navbar = document.querySelector('.navbar');
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ── Mobile Menu ──
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');

  if (mobileBtn && mobileNav) {
    mobileBtn.addEventListener('click', () => {
      mobileBtn.classList.toggle('open');
      mobileNav.classList.toggle('show');
      mobileNav.classList.toggle('open');
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileBtn.classList.remove('open');
        mobileNav.classList.remove('show', 'open');
      });
    });
  }

  // ── Scroll Reveal Animations ──
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ── Accordion ──
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const list = btn.closest('.faq-list');
      const answer = item.querySelector('.faq-answer');
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close other items in same category
      list.querySelectorAll('.faq-question[aria-expanded="true"]').forEach(openBtn => {
        if (openBtn !== btn) {
          openBtn.setAttribute('aria-expanded', 'false');
          const openAnswer = openBtn.closest('.faq-item').querySelector('.faq-answer');
          openAnswer.style.maxHeight = '0';
          setTimeout(() => { openAnswer.hidden = true; }, 350);
        }
      });

      // Toggle current
      if (isOpen) {
        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0';
        setTimeout(() => { answer.hidden = true; }, 350);
      } else {
        btn.setAttribute('aria-expanded', 'true');
        answer.hidden = false;
        // Force reflow before setting max-height
        answer.offsetHeight;
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ── Search Filtering ──
  const searchInput = document.getElementById('faqSearch');
  const searchClear = document.getElementById('searchClear');
  const searchCount = document.getElementById('searchCount');
  const allItems = document.querySelectorAll('.faq-item');
  const allCategories = document.querySelectorAll('.faq-category');
  const noResults = document.getElementById('noResults');

  // Track active tab for combined filtering
  let activeAudience = 'all';

  function applyFilters() {
    const query = searchInput.value.toLowerCase().trim();
    searchClear.hidden = !query;

    let matchCount = 0;
    let visibleCategories = 0;

    allCategories.forEach(cat => {
      const catAudience = cat.dataset.audience;

      // Check tab filter first
      const tabVisible = activeAudience === 'all' || catAudience === 'all' || catAudience === activeAudience;

      if (!tabVisible) {
        cat.style.display = 'none';
        return;
      }

      // Now filter items within visible categories
      const items = cat.querySelectorAll('.faq-item');
      let categoryHasVisible = false;

      items.forEach(item => {
        const itemAudience = item.dataset.audience;
        const itemTabVisible = activeAudience === 'all' || itemAudience === 'all' || itemAudience === activeAudience;

        if (!itemTabVisible) {
          item.style.display = 'none';
          return;
        }

        if (!query) {
          item.style.display = '';
          categoryHasVisible = true;
          matchCount++;
          return;
        }

        const questionText = item.querySelector('.faq-question span').textContent.toLowerCase();
        const answerText = item.querySelector('.faq-answer-inner').textContent.toLowerCase();
        const matches = questionText.includes(query) || answerText.includes(query);

        item.style.display = matches ? '' : 'none';
        if (matches) {
          categoryHasVisible = true;
          matchCount++;
        }
      });

      cat.style.display = categoryHasVisible ? '' : 'none';
      if (categoryHasVisible) visibleCategories++;
    });

    // Update search count
    if (query) {
      searchCount.textContent = matchCount + ' result' + (matchCount !== 1 ? 's' : '') + ' found';
    } else {
      searchCount.textContent = '';
    }

    // Show/hide no results message
    if (noResults) {
      noResults.classList.toggle('visible', matchCount === 0 && (query || activeAudience !== 'all'));
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      applyFilters();
      searchInput.focus();
    });
  }

  // ── Audience Tab Filtering ──
  const tabs = document.querySelectorAll('.faq-tab');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active state
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      activeAudience = tab.dataset.audience;
      applyFilters();
    });
  });

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
