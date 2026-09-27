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
  const toEmail = 'yashvipatel856@gmail.com';

  // Email Copy Button
  const copyBtn = document.getElementById('copyEmailBtn');
  const heroCopyBtn = document.getElementById('heroCopyEmailBtn');

  const copyEmail = (e) => {
    if (e) e.preventDefault();
    navigator.clipboard.writeText(toEmail).then(() => {
      showToast(`Copied email: ${toEmail}!`);
    }).catch(() => {
      showToast(`Email: ${toEmail}`);
    });
  };

  if (copyBtn) copyBtn.addEventListener('click', copyEmail);
  if (heroCopyBtn) heroCopyBtn.addEventListener('click', copyEmail);

  // Email Modal Opener Helper
  window.openEmailModal = function(options = {}) {
    const {
      name = '',
      email = '',
      subject = '',
      message = ''
    } = options;

    const fullSubject = subject ? `${subject} [from ${name || 'Portfolio Visitor'}]` : `Inquiry from ${name || 'Portfolio Visitor'}`;
    const fullBody = (name || message) 
      ? `Hi Yashvi,\n\n${message || '(Write your message here)'}\n\n---\nSender: ${name || 'Anonymous'}\nReply-To: ${email || 'Not provided'}`
      : `Hi Yashvi,\n\nI came across your portfolio and would like to connect with you regarding...`;

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(toEmail)}&su=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(fullBody)}`;
    const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(toEmail)}&subject=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(fullBody)}`;
    const mailtoUrl = `mailto:${toEmail}?subject=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(fullBody)}`;

    const modalOverlay = document.getElementById('modalOverlay');
    const modalBody = document.getElementById('modalBody');
    if (!modalOverlay || !modalBody) return;

    modalBody.innerHTML = `
      <h3 style="font-size: 1.35rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
        <span>✉️</span> <span>Dispatch Email to Yashvi</span>
      </h3>
      <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 1.25rem;">
        Choose your preferred platform to compose and send directly to <strong>${toEmail}</strong>:
      </p>

      <div style="display: flex; flex-direction: column; gap: 0.85rem; margin-bottom: 1.25rem;">
        <!-- Option 1: Gmail Web -->
        <a href="${gmailUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="justify-content: flex-start; text-align: left; padding: 0.85rem 1.25rem; background: linear-gradient(135deg, #ea4335, #c5221f); border: none;">
          <span style="font-size: 1.35rem;">📧</span>
          <div>
            <div style="font-weight: 700; font-size: 0.95rem;">Send via Gmail (Web Browser)</div>
            <div style="font-size: 0.78rem; opacity: 0.9;">Opens Gmail in a new tab with your message pre-filled</div>
          </div>
        </a>

        <!-- Option 2: Outlook Web -->
        <a href="${outlookUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="justify-content: flex-start; text-align: left; padding: 0.85rem 1.25rem; border-color: rgba(0, 120, 212, 0.4);">
          <span style="font-size: 1.35rem;">📬</span>
          <div>
            <div style="font-weight: 700; font-size: 0.95rem; color: #38bdf8;">Send via Outlook / Hotmail (Web)</div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">Opens Outlook in browser ready to dispatch</div>
          </div>
        </a>

        <!-- Option 3: Default Desktop Mail App -->
        <a href="${mailtoUrl}" class="btn btn-secondary" style="justify-content: flex-start; text-align: left; padding: 0.85rem 1.25rem;">
          <span style="font-size: 1.35rem;">💻</span>
          <div>
            <div style="font-weight: 700; font-size: 0.95rem;">Open Default Email Client</div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">Uses your system's default software (Outlook, Mail, Thunderbird)</div>
          </div>
        </a>

        <!-- Option 4: Copy to Clipboard -->
        <button id="copyAllEmailInfoBtn" class="btn btn-secondary" style="justify-content: flex-start; text-align: left; padding: 0.85rem 1.25rem; cursor: pointer;">
          <span style="font-size: 1.35rem;">📋</span>
          <div>
            <div style="font-weight: 700; font-size: 0.95rem;">Copy Email Address & Message</div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">Copies to clipboard so you can paste into any email app</div>
          </div>
        </button>
      </div>

      <div style="background: rgba(0,0,0,0.25); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.85rem; font-size: 0.82rem; color: var(--text-secondary);">
        💡 <strong>Direct Email Address:</strong> <code style="color: var(--accent-cyan); font-weight: bold;">${toEmail}</code>
      </div>
    `;

    modalOverlay.classList.add('open');

    const copyAllBtn = document.getElementById('copyAllEmailInfoBtn');
    if (copyAllBtn) {
      copyAllBtn.addEventListener('click', () => {
        const copyPayload = `To: ${toEmail}\nSubject: ${fullSubject}\n\n${fullBody}`;
        navigator.clipboard.writeText(copyPayload).then(() => {
          showToast('Copied email & message to clipboard!');
          modalOverlay.classList.remove('open');
        });
      });
    }
  };

  // Hero email button trigger
  const heroEmailModalBtn = document.getElementById('heroEmailModalBtn');
  if (heroEmailModalBtn) {
    heroEmailModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.openEmailModal();
    });
  }

  // Contact card email link trigger
  const contactCardEmailLink = document.getElementById('contactCardEmailLink');
  if (contactCardEmailLink) {
    contactCardEmailLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.openEmailModal();
    });
  }

  // Contact Form handler
  const form = document.getElementById('portfolioContactForm');
  const moreOptionsBtn = document.getElementById('openMoreEmailOptionsBtn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName').value.trim();
      const email = document.getElementById('senderEmail').value.trim();
      const subject = document.getElementById('senderSubject').value.trim();
      const message = document.getElementById('senderMessage').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.');
        return;
      }

      const fullSubject = subject ? `${subject} [from ${name}]` : `Inquiry from ${name} via Portfolio`;
      const fullBody = `Hi Yashvi,\n\n${message}\n\n---\nSender: ${name}\nEmail: ${email}`;
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(toEmail)}&su=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(fullBody)}`;

      // Open Gmail directly in a new tab!
      const newWin = window.open(gmailUrl, '_blank');
      
      if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
        // If popup was blocked, fallback to modal selector
        window.openEmailModal({ name, email, subject, message });
        showToast('Please select your preferred email service:');
      } else {
        showToast('Opened Gmail web composer with your message!');
      }
    });
  }

  if (moreOptionsBtn) {
    moreOptionsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName') ? document.getElementById('senderName').value.trim() : '';
      const email = document.getElementById('senderEmail') ? document.getElementById('senderEmail').value.trim() : '';
      const subject = document.getElementById('senderSubject') ? document.getElementById('senderSubject').value.trim() : '';
      const message = document.getElementById('senderMessage') ? document.getElementById('senderMessage').value.trim() : '';
      window.openEmailModal({ name, email, subject, message });
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
