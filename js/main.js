/**
 * Yashvi Patel - Portfolio Main Script
 * Handles navigation, typewriter, theme switching, project filters, modals, and toasts.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initNavbarScroll();
  initThemeToggle();
  initMobileMenu();
  initProjectFilters();
  initContactActions();
  initModals();
  initSkillBars();
});

/* ==========================================================================
   TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const target = document.getElementById('typedText');
  if (!target) return;

  const roles = [
    'AI / ML Engineer',
    'NLP & Transformer Specialist',
    'Computer Vision Researcher',
    'GATE CS AIR 3011 (98.5%ile)',
    'M.Tech CS @ IIIT Delhi'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const current = roles[roleIdx];
    
    if (isDeleting) {
      target.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 40;
    } else {
      target.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIdx === current.length) {
      typingSpeed = 1800; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 450;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   NAVBAR & SCROLLSPY
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Navbar glass effect
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scrollspy
    let current = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   THEME TOGGLE
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem('yashvi_portfolio_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  toggleBtn.addEventListener('click', () => {
    const active = document.documentElement.getAttribute('data-theme');
    const newTheme = active === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('yashvi_portfolio_theme', newTheme);
    updateThemeIcon(newTheme);
    showToast(`Switched to ${newTheme} mode`);
  });

  function updateThemeIcon(theme) {
    toggleBtn.innerHTML = theme === 'light' ? '🌙' : '☀️';
    toggleBtn.setAttribute('title', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
  }
}

/* ==========================================================================
   MOBILE MENU
   ========================================================================== */
function initMobileMenu() {
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!mobileBtn || !mobileDrawer) return;

  mobileBtn.addEventListener('click', () => {
    mobileDrawer.classList.toggle('open');
    mobileBtn.textContent = mobileDrawer.classList.contains('open') ? '✕' : '☰';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      mobileBtn.textContent = '☰';
    });
  });
}

/* ==========================================================================
   PROJECT FILTERS
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; }, 10);
        } else {
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   SKILL BARS ANIMATION
   ========================================================================== */
function initSkillBars() {
  const skillSection = document.getElementById('skills');
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  let animated = false;

  function triggerBars() {
    if (!skillSection || animated) return;
    const rect = skillSection.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.75) {
      skillBars.forEach(bar => {
        const targetWidth = bar.getAttribute('data-width');
        bar.style.width = targetWidth;
      });
      animated = true;
    }
  }

  window.addEventListener('scroll', triggerBars);
  triggerBars(); // Check on initial load
}

/* ==========================================================================
   CONTACT ACTIONS & TOAST
   ========================================================================== */
function initContactActions() {
  // Email Copy Button
  const copyBtn = document.getElementById('copyEmailBtn');
  const heroCopyBtn = document.getElementById('heroCopyEmailBtn');

  const copyEmail = (e) => {
    e.preventDefault();
    const email = 'yashvipatel856@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      showToast('Copied email: yashvipatel856@gmail.com!');
    }).catch(() => {
      showToast('Email: yashvipatel856@gmail.com');
    });
  };

  if (copyBtn) copyBtn.addEventListener('click', copyEmail);
  if (heroCopyBtn) heroCopyBtn.addEventListener('click', copyEmail);

  // Contact Form
  const form = document.getElementById('portfolioContactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName').value;
      const email = document.getElementById('senderEmail').value;
      const subject = document.getElementById('senderSubject').value;
      const message = document.getElementById('senderMessage').value;

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.');
        return;
      }

      // Generate mailto link
      const mailtoLink = `mailto:yashvipatel856@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry from ' + name)}&body=${encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      )}`;
      
      window.location.href = mailtoLink;
      showToast('Opening your email client to dispatch message...');
      form.reset();
    });
  }
}

function showToast(message) {
  let toast = document.getElementById('portfolioToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'portfolioToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>✨</span><span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* ==========================================================================
   MODALS (BibTeX Citation & Project Details)
   ========================================================================== */
function initModals() {
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalCloseBtn');
  const modalBody = document.getElementById('modalBody');
  const bibtexBtn = document.getElementById('viewBibtexBtn');

  if (!overlay) return;

  function closeModal() {
    overlay.classList.remove('open');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });

  // BibTeX Citation Modal Triggers
  const bibtexButtons = document.querySelectorAll('.view-bibtex-btn, #viewBibtexBtn');
  
  const citations = {
    ieee: {
      venue: 'IEEE Conference Citation (BibTeX)',
      title: 'Real-Time Sitting Student Posture Detection for Students in Classroom Environment',
      code: `@INPROCEEDINGS{10841644,
  author={Patel, Yashvi and others},
  booktitle={2024 International Conference on Automation, Computing and Renewable Systems (ICACRS)}, 
  title={Real-Time Sitting Student Posture Detection for Students in Classroom Environment}, 
  year={2024},
  pages={1-6},
  keywords={Pose Estimation; Computer Vision; MediaPipe; Posture Correction; Classroom Ergonomics},
  doi={10.1109/ICACRS62842.2024.10841644},
  publisher={IEEE}
}`
    },
    springer: {
      venue: 'Springer Nature Citation (BibTeX)',
      title: 'From Campus Life to Career Prospects: Analyzing Key Determinants in Student University Selection',
      code: `@INCOLLECTION{Trivedi2025,
  author={Trivedi, Prem and Patel, Manan and Patel, Yashvi and Bhatt, Drashti and Jayswal, Hardikkumar and Dubey, Nilesh and Solanki, Rajendra},
  title={From Campus Life to Career Prospects: Analyzing Key Determinants in Student University Selection},
  booktitle={Intelligent Strategies for ICT (ICTCS 2024)},
  series={Lecture Notes in Networks and Systems},
  volume={1319},
  pages={339--350},
  year={2025},
  publisher={Springer Nature Singapore},
  doi={10.1007/978-981-96-4145-1_26}
}`
    }
  };

  bibtexButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const paperKey = btn.getAttribute('data-paper') || 'ieee';
      const item = citations[paperKey] || citations.ieee;

      modalBody.innerHTML = `
        <h3 style="margin-bottom: 0.75rem; font-size: 1.3rem;">${item.venue}</h3>
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1rem;">
          ${item.title}
        </p>
        <div style="background: #060911; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1rem; position: relative;">
          <pre style="font-family: var(--font-mono); font-size: 0.82rem; color: #38bdf8; overflow-x: auto; white-space: pre-wrap;"><code>${item.code}</code></pre>
          <button id="copyBibtexBtn" class="btn btn-primary btn-sm" style="margin-top: 1rem; width: 100%;">
            📋 Copy BibTeX Citation
          </button>
        </div>
      `;

      overlay.classList.add('open');

      const copyBibtexBtn = document.getElementById('copyBibtexBtn');
      if (copyBibtexBtn) {
        copyBibtexBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(item.code).then(() => {
            showToast('BibTeX citation copied to clipboard!');
            closeModal();
          });
        });
      }
    });
  });
}
