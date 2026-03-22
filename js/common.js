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

  // --- Section definitions for sidebar grouping ---
  const SECTIONS = [
    { id: 'api_security', labelKey: 'nav_section_platform' },
    { id: 'ai_security', labelKey: 'nav_section_ai' },
    { id: 'devops', labelKey: 'nav_section_devops' },
    { id: 'information', labelKey: 'nav_section_info' },
  ];

  // --- Page definitions (labels are embedded at build time via data-i18n) ---
  const pages = [
    { href: 'index.html', icon: '\u{1F3E0}', labelKey: 'nav_home', section: null },
    { href: 'owasp-top10.html', icon: '\u{1F51F}', labelKey: 'nav_owasp', section: 'api_security' },
    { href: 'auth.html', icon: '\u{1F510}', labelKey: 'nav_auth', section: 'api_security' },
    { href: 'rate-limiting.html', icon: '\u26A1', labelKey: 'nav_rate_limiting', section: 'api_security' },
    { href: 'tools.html', icon: '\u{1F6E0}', labelKey: 'nav_tools', section: 'api_security' },
    { href: 'guidelines.html', icon: '\u{1F4CB}', labelKey: 'nav_guidelines', section: 'api_security' },
    { href: 'owasp-webapp-top10.html', icon: '\u{1F310}', labelKey: 'nav_owasp_webapp', section: 'api_security' },
    { href: 'owasp-cloud-top10.html', icon: '\u2601\uFE0F', labelKey: 'nav_owasp_cloud', section: 'api_security' },
    { href: 'owasp-llm-top10.html', icon: '\u{1F916}', labelKey: 'nav_owasp_llm', section: 'ai_security' },
    { href: 'owasp-agentic-top10.html', icon: '\u{1F9BE}', labelKey: 'nav_owasp_agentic', section: 'ai_security' },
    { href: 'owasp-ml-top10.html', icon: '\u{1F9E0}', labelKey: 'nav_owasp_ml', section: 'ai_security' },
    { href: 'owasp-cicd-top10.html', icon: '\u{1F504}', labelKey: 'nav_owasp_cicd', section: 'devops' },
    { href: 'owasp-k8s-top10.html', icon: '\u2638', labelKey: 'nav_owasp_k8s', section: 'devops' },
    { href: 'news.html', icon: '\u{1F4F0}', labelKey: 'nav_news', section: 'information' },
    { href: 'vendor-blogs.html', icon: '\u{1F4DD}', labelKey: 'nav_vendor_blogs', section: 'information' },
  ];

  // --- Nav labels per language (fallback if data-i18n not available) ---
  const NAV_LABELS = {
    en: {
      nav_home: 'Home',
      nav_section_platform: 'Platform Security',
      nav_section_ai: 'AI Security',
      nav_section_devops: 'DevOps Security',
      nav_section_info: 'Information',
      nav_owasp: 'OWASP Top 10',
      nav_auth: 'Auth & Authorization',
      nav_rate_limiting: 'Rate Limiting & Validation',
      nav_tools: 'Security Tools',
      nav_guidelines: 'Internal Guidelines',
      nav_owasp_webapp: 'OWASP Web App Top 10',
      nav_owasp_cloud: 'OWASP Cloud Top 10',
      nav_owasp_llm: 'OWASP LLM Top 10',
      nav_owasp_agentic: 'OWASP Agentic Top 10',
      nav_owasp_ml: 'OWASP ML Top 10',
      nav_owasp_cicd: 'OWASP CI/CD Top 10',
      nav_owasp_k8s: 'OWASP Kubernetes Top 10',
      nav_news: 'Latest News',
      nav_vendor_blogs: 'Vendor Blogs',
    },
    ja: {
      nav_home: '\u30C8\u30C3\u30D7\u30DA\u30FC\u30B8',
      nav_section_platform: '\u30D7\u30E9\u30C3\u30C8\u30D5\u30A9\u30FC\u30E0\u30BB\u30AD\u30E5\u30EA\u30C6\u30A3',
      nav_section_ai: 'AI\u30BB\u30AD\u30E5\u30EA\u30C6\u30A3',
      nav_section_devops: 'DevOps\u30BB\u30AD\u30E5\u30EA\u30C6\u30A3',
      nav_section_info: '\u60C5\u5831',
      nav_owasp: 'OWASP Top 10',
      nav_auth: '\u8A8D\u8A3C\u30FB\u8A8D\u53EF',
      nav_rate_limiting: '\u30EC\u30FC\u30C8\u5236\u9650\u30FB\u5165\u529B\u691C\u8A3C',
      nav_tools: '\u30BB\u30AD\u30E5\u30EA\u30C6\u30A3\u30C4\u30FC\u30EB',
      nav_guidelines: '\u793E\u5185\u30AC\u30A4\u30C9\u30E9\u30A4\u30F3',
      nav_owasp_webapp: 'OWASP Web App Top 10',
      nav_owasp_cloud: 'OWASP Cloud Top 10',
      nav_owasp_llm: 'OWASP LLM Top 10',
      nav_owasp_agentic: 'OWASP Agentic Top 10',
      nav_owasp_ml: 'OWASP ML Top 10',
      nav_owasp_cicd: 'OWASP CI/CD Top 10',
      nav_owasp_k8s: 'OWASP Kubernetes Top 10',
      nav_news: '\u6700\u65B0\u60C5\u5831',
      nav_vendor_blogs: '\u30D9\u30F3\u30C0\u30FC\u30D6\u30ED\u30B0',
    },
    es: {
      nav_home: 'Inicio',
      nav_section_platform: 'Seguridad de Plataforma',
      nav_section_ai: 'Seguridad IA',
      nav_section_devops: 'Seguridad DevOps',
      nav_section_info: 'Informaci\u00F3n',
      nav_owasp: 'OWASP Top 10',
      nav_auth: 'Autenticaci\u00F3n',
      nav_rate_limiting: 'L\u00EDmite de tasa',
      nav_tools: 'Herramientas',
      nav_guidelines: 'Directrices',
      nav_owasp_webapp: 'OWASP Web App Top 10',
      nav_owasp_cloud: 'OWASP Cloud Top 10',
      nav_owasp_llm: 'OWASP LLM Top 10',
      nav_owasp_agentic: 'OWASP Agentic Top 10',
      nav_owasp_ml: 'OWASP ML Top 10',
      nav_owasp_cicd: 'OWASP CI/CD Top 10',
      nav_owasp_k8s: 'OWASP Kubernetes Top 10',
      nav_news: 'Noticias',
      nav_vendor_blogs: 'Blogs de Proveedores',
    },
    pt: {
      nav_home: 'In\u00EDcio',
      nav_section_platform: 'Seguran\u00E7a de Plataforma',
      nav_section_ai: 'Seguran\u00E7a IA',
      nav_section_devops: 'Seguran\u00E7a DevOps',
      nav_section_info: 'Informa\u00E7\u00E3o',
      nav_owasp: 'OWASP Top 10',
      nav_auth: 'Autentica\u00E7\u00E3o',
      nav_rate_limiting: 'Limite de taxa',
      nav_tools: 'Ferramentas',
      nav_guidelines: 'Diretrizes',
      nav_owasp_webapp: 'OWASP Web App Top 10',
      nav_owasp_cloud: 'OWASP Cloud Top 10',
      nav_owasp_llm: 'OWASP LLM Top 10',
      nav_owasp_agentic: 'OWASP Agentic Top 10',
      nav_owasp_ml: 'OWASP ML Top 10',
      nav_owasp_cicd: 'OWASP CI/CD Top 10',
      nav_owasp_k8s: 'OWASP Kubernetes Top 10',
      nav_news: 'Not\u00EDcias',
      nav_vendor_blogs: 'Blogs de Fornecedores',
    },
    fr: {
      nav_home: 'Accueil',
      nav_section_platform: 'S\u00E9curit\u00E9 de Plateforme',
      nav_section_ai: 'S\u00E9curit\u00E9 IA',
      nav_section_devops: 'S\u00E9curit\u00E9 DevOps',
      nav_section_info: 'Informations',
      nav_owasp: 'OWASP Top 10',
      nav_auth: 'Authentification',
      nav_rate_limiting: 'Limite de d\u00E9bit',
      nav_tools: 'Outils',
      nav_guidelines: 'Directives',
      nav_owasp_webapp: 'OWASP Web App Top 10',
      nav_owasp_cloud: 'OWASP Cloud Top 10',
      nav_owasp_llm: 'OWASP LLM Top 10',
      nav_owasp_agentic: 'OWASP Agentic Top 10',
      nav_owasp_ml: 'OWASP ML Top 10',
      nav_owasp_cicd: 'OWASP CI/CD Top 10',
      nav_owasp_k8s: 'OWASP Kubernetes Top 10',
      nav_news: 'Actualit\u00E9s',
      nav_vendor_blogs: 'Blogs Fournisseurs',
    },
  };

  // --- Translation tip labels per language (non-English only) ---
  const TRANSLATE_TIP = {
    ja: '\u{1F310} \u5916\u90E8\u30EA\u30F3\u30AF\u5148\u306E\u8A18\u4E8B\u306F\u82F1\u8A9E\u3067\u3059\u3002\u30D6\u30E9\u30A6\u30B6\u306E\u7FFB\u8A33\u6A5F\u80FD\uFF08\u53F3\u30AF\u30EA\u30C3\u30AF \u2192 \u7FFB\u8A33\uFF09\u3092\u3054\u5229\u7528\u304F\u3060\u3055\u3044\u3002',
    es: '\u{1F310} Los art\u00EDculos enlazados est\u00E1n en ingl\u00E9s. Use la funci\u00F3n de traducci\u00F3n de su navegador (clic derecho \u2192 Traducir).',
    pt: '\u{1F310} Os artigos vinculados est\u00E3o em ingl\u00EAs. Use o recurso de tradu\u00E7\u00E3o do seu navegador (clique direito \u2192 Traduzir).',
    fr: '\u{1F310} Les articles li\u00E9s sont en anglais. Utilisez la fonction de traduction de votre navigateur (clic droit \u2192 Traduire).',
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

    // Build nav HTML with section grouping
    let navHtml = '';
    // Render pages without a section first (e.g. Home)
    pages.filter(p => !p.section).forEach(p => {
      navHtml += `<a href="${p.href}" class="${current === p.href ? 'active' : ''}">
            <span class="nav-icon">${p.icon}</span>
            <span>${getNavLabel(p.labelKey)}</span>
          </a>`;
    });
    // Render each section with header
    SECTIONS.forEach(sec => {
      const sectionPages = pages.filter(p => p.section === sec.id);
      if (sectionPages.length === 0) return;
      navHtml += `<div class="sidebar-section-header">${getNavLabel(sec.labelKey)}</div>`;
      sectionPages.forEach(p => {
        navHtml += `<a href="${p.href}" class="${current === p.href ? 'active' : ''}">
            <span class="nav-icon">${p.icon}</span>
            <span>${getNavLabel(p.labelKey)}</span>
          </a>`;
      });
    });

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
        ${navHtml}
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

    // Insert translation tip for non-English pages
    if (currentLang !== 'en' && TRANSLATE_TIP[currentLang]) {
      const tip = document.createElement('div');
      tip.style.cssText = 'font-size:0.82rem;color:var(--text-secondary,#a0a0a0);background:var(--bg-card,#1a1a1a);border:1px solid var(--border-color,#2a2a2a);border-radius:8px;padding:8px 14px;margin-bottom:12px;';
      tip.textContent = TRANSLATE_TIP[currentLang];
      existingContent.insertBefore(tip, existingContent.firstChild);
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
