/* ============================================
   API Security Reference Site - Common JS
   ============================================ */

(function () {
  'use strict';

  // --- Supported languages ---
  const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'ja', label: '日本語' },
    { code: 'es', label: 'Español' },
    { code: 'pt', label: 'Português' },
    { code: 'fr', label: 'Français' },
  ];

  // --- Detect current language from URL path ---
  function detectLang() {
    const match = location.pathname.match(/\/(en|ja|es|pt|fr)\//);
    return match ? match[1] : 'en';
  }

  // --- Page definitions (labels are embedded at build time via data-i18n) ---
  const pages = [
    { href: 'index.html', icon: '\u{1F3E0}', labelKey: 'nav_home' },
    { href: 'owasp-top10.html', icon: '\u{1F51F}', labelKey: 'nav_owasp' },
    { href: 'auth.html', icon: '\u{1F510}', labelKey: 'nav_auth' },
    { href: 'rate-limiting.html', icon: '\u26A1', labelKey: 'nav_rate_limiting' },
    { href: 'tools.html', icon: '\u{1F6E0}', labelKey: 'nav_tools' },
    { href: 'guidelines.html', icon: '\u{1F4CB}', labelKey: 'nav_guidelines' },
    { href: 'news.html', icon: '\u{1F4F0}', labelKey: 'nav_news' },
  ];

  // --- Nav labels per language (fallback if data-i18n not available) ---
  const NAV_LABELS = {
    en: {
      nav_home: 'Home',
      nav_owasp: 'OWASP Top 10',
      nav_auth: 'Auth & Authorization',
      nav_rate_limiting: 'Rate Limiting & Validation',
      nav_tools: 'Security Tools',
      nav_guidelines: 'Internal Guidelines',
      nav_news: 'Latest News',
    },
    ja: {
      nav_home: '\u30C8\u30C3\u30D7\u30DA\u30FC\u30B8',
      nav_owasp: 'OWASP Top 10',
      nav_auth: '\u8A8D\u8A3C\u30FB\u8A8D\u53EF',
      nav_rate_limiting: '\u30EC\u30FC\u30C8\u5236\u9650\u30FB\u5165\u529B\u691C\u8A3C',
      nav_tools: '\u30BB\u30AD\u30E5\u30EA\u30C6\u30A3\u30C4\u30FC\u30EB',
      nav_guidelines: '\u793E\u5185\u30AC\u30A4\u30C9\u30E9\u30A4\u30F3',
      nav_news: '\u6700\u65B0\u60C5\u5831',
    },
    es: {
      nav_home: 'Inicio',
      nav_owasp: 'OWASP Top 10',
      nav_auth: 'Autenticaci\u00F3n',
      nav_rate_limiting: 'L\u00EDmite de tasa',
      nav_tools: 'Herramientas',
      nav_guidelines: 'Directrices',
      nav_news: 'Noticias',
    },
    pt: {
      nav_home: 'In\u00EDcio',
      nav_owasp: 'OWASP Top 10',
      nav_auth: 'Autentica\u00E7\u00E3o',
      nav_rate_limiting: 'Limite de taxa',
      nav_tools: 'Ferramentas',
      nav_guidelines: 'Diretrizes',
      nav_news: 'Not\u00EDcias',
    },
    fr: {
      nav_home: 'Accueil',
      nav_owasp: 'OWASP Top 10',
      nav_auth: 'Authentification',
      nav_rate_limiting: 'Limite de d\u00E9bit',
      nav_tools: 'Outils',
      nav_guidelines: 'Directives',
      nav_news: 'Actualit\u00E9s',
    },
  };

  // --- Footer labels per language ---
  const FOOTER_LABELS = {
    en: {
      desc: 'API Security Reference Hub &mdash; Security information portal for development teams',
      ref: 'Reference: ',
    },
    ja: {
      desc: 'API Security Reference Hub &mdash; \u793E\u5185\u5411\u3051\u30BB\u30AD\u30E5\u30EA\u30C6\u30A3\u60C5\u5831\u30DD\u30FC\u30BF\u30EB',
      ref: '\u53C2\u8003: ',
    },
    es: {
      desc: 'API Security Reference Hub &mdash; Portal de informaci\u00F3n de seguridad',
      ref: 'Referencia: ',
    },
    pt: {
      desc: 'API Security Reference Hub &mdash; Portal de informa\u00E7\u00F5es de seguran\u00E7a',
      ref: 'Refer\u00EAncia: ',
    },
    fr: {
      desc: 'API Security Reference Hub &mdash; Portail d\'informations de s\u00E9curit\u00E9',
      ref: 'R\u00E9f\u00E9rence : ',
    },
  };

  const currentLang = detectLang();

  // --- Detect current page ---
  function currentFile() {
    const path = location.pathname;
    const file = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    return file;
  }

  // --- Get nav label ---
  function getNavLabel(labelKey) {
    const labels = NAV_LABELS[currentLang] || NAV_LABELS.en;
    return labels[labelKey] || labelKey;
  }

  // --- Build sidebar ---
  function buildSidebar() {
    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';
    sidebar.id = 'sidebar';

    const current = currentFile();

    sidebar.innerHTML = `
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-icon">\u{1F6E1}</span>
          <div>
            <div>API Security</div>
            <div class="logo-sub">Reference Hub</div>
          </div>
        </div>
      </div>
      <nav class="sidebar-nav">
        ${pages.map(p => `
          <a href="${p.href}" class="${current === p.href ? 'active' : ''}">
            <span class="nav-icon">${p.icon}</span>
            <span>${getNavLabel(p.labelKey)}</span>
          </a>
        `).join('')}
      </nav>
      <div class="lang-switcher">
        <div class="lang-switcher-label">\u{1F310} Language</div>
        <select class="lang-select" id="lang-select">
          ${LANGUAGES.map(l => `
            <option value="${l.code}" ${l.code === currentLang ? 'selected' : ''}>${l.label}</option>
          `).join('')}
        </select>
      </div>
      <div class="sidebar-footer">
        &copy; 2025 API Security Reference<br>
        Internal Use Only
      </div>
    `;
    return sidebar;
  }

  // --- Build mobile header ---
  function buildMobileHeader() {
    const header = document.createElement('header');
    header.className = 'mobile-header';
    header.innerHTML = `
      <button class="hamburger" id="hamburger" aria-label="Open menu">\u2630</button>
      <span class="mobile-title">\u{1F6E1} API Security</span>
      <span style="width:40px"></span>
    `;
    return header;
  }

  // --- Build overlay ---
  function buildOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.id = 'sidebar-overlay';
    return overlay;
  }

  // --- Build footer ---
  function buildFooter() {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    const labels = FOOTER_LABELS[currentLang] || FOOTER_LABELS.en;
    footer.innerHTML = `
      <p>${labels.desc}</p>
      <p style="margin-top:4px">
        ${labels.ref}<a href="https://owasp.org/API-Security/" target="_blank" rel="noopener">OWASP API Security Project</a>
      </p>
    `;
    return footer;
  }

  // --- Language switch handler ---
  function handleLangSwitch(newLang) {
    const currentPage = currentFile();
    // Navigate to ../{newLang}/{currentPage}
    window.location.href = '../' + newLang + '/' + currentPage;
  }

  // --- Initialize ---
  function init() {
    const body = document.body;

    // Wrap existing body content in main-content
    const existingContent = document.createElement('div');
    existingContent.className = 'content-wrapper';
    while (body.firstChild) {
      existingContent.appendChild(body.firstChild);
    }

    const main = document.createElement('main');
    main.className = 'main-content';
    main.appendChild(existingContent);

    // Build and insert components
    const sidebar = buildSidebar();
    const mobileHeader = buildMobileHeader();
    const overlay = buildOverlay();
    const footer = buildFooter();

    body.appendChild(mobileHeader);
    body.appendChild(overlay);
    body.appendChild(sidebar);
    body.appendChild(main);
    body.appendChild(footer);

    // --- Language switcher ---
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        handleLangSwitch(e.target.value);
      });
    }

    // --- Mobile menu toggle ---
    const hamburger = document.getElementById('hamburger');
    const sidebarEl = document.getElementById('sidebar');
    const overlayEl = document.getElementById('sidebar-overlay');

    function openMenu() {
      sidebarEl.classList.add('open');
      overlayEl.classList.add('active');
    }

    function closeMenu() {
      sidebarEl.classList.remove('open');
      overlayEl.classList.remove('active');
    }

    hamburger.addEventListener('click', () => {
      if (sidebarEl.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    overlayEl.addEventListener('click', closeMenu);

    // Close menu on nav click (mobile)
    sidebarEl.querySelectorAll('.sidebar-nav a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // --- Accordion ---
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        item.classList.toggle('open');
      });
    });

    // --- Tabs ---
    document.querySelectorAll('.tabs').forEach(tabContainer => {
      const buttons = tabContainer.querySelectorAll('.tab-btn');
      const parentSection = tabContainer.parentElement;

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.dataset.tab;

          buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          parentSection.querySelectorAll('.tab-content').forEach(tc => {
            tc.classList.remove('active');
          });

          const targetEl = parentSection.querySelector(`#${target}`);
          if (targetEl) targetEl.classList.add('active');
        });
      });
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
