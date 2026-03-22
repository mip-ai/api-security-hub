/* ============================================
   AI Security Hub - Common JS
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

  // --- Navigation menu structure ---
  const NAV_MENU = [
    {
      id: 'owasp',
      labelKey: 'nav_menu_owasp',
      type: 'mega',
      groups: [
        {
          labelKey: 'nav_group_ai',
          items: [
            { href: 'owasp-llm-top10.html', icon: '\u{1F916}', labelKey: 'nav_owasp_llm' },
            { href: 'owasp-agentic-top10.html', icon: '\u{1F9BE}', labelKey: 'nav_owasp_agentic' },
            { href: 'owasp-ml-top10.html', icon: '\u{1F9E0}', labelKey: 'nav_owasp_ml' },
          ],
        },
        {
          labelKey: 'nav_group_infra',
          items: [
            { href: 'owasp-top10.html', icon: '\u{1F51F}', labelKey: 'nav_owasp' },
            { href: 'owasp-webapp-top10.html', icon: '\u{1F310}', labelKey: 'nav_owasp_webapp' },
            { href: 'owasp-cloud-top10.html', icon: '\u2601\uFE0F', labelKey: 'nav_owasp_cloud' },
            { href: 'owasp-cicd-top10.html', icon: '\u{1F504}', labelKey: 'nav_owasp_cicd' },
            { href: 'owasp-k8s-top10.html', icon: '\u2638', labelKey: 'nav_owasp_k8s' },
          ],
        },
      ],
    },
    {
      id: 'practices',
      labelKey: 'nav_menu_practices',
      type: 'dropdown',
      items: [
        { href: 'auth.html', icon: '\u{1F510}', labelKey: 'nav_auth' },
        { href: 'rate-limiting.html', icon: '\u26A1', labelKey: 'nav_rate_limiting' },
        { href: 'tools.html', icon: '\u{1F6E0}', labelKey: 'nav_tools' },
        { href: 'guidelines.html', icon: '\u{1F4CB}', labelKey: 'nav_guidelines' },
      ],
    },
    {
      id: 'news',
      labelKey: 'nav_menu_news',
      type: 'dropdown',
      items: [
        { href: 'news.html', icon: '\u{1F4F0}', labelKey: 'nav_news' },
        { href: 'vendor-blogs.html', icon: '\u{1F4DD}', labelKey: 'nav_vendor_blogs' },
      ],
    },
    {
      id: 'matrix',
      labelKey: 'nav_menu_matrix',
      type: 'link',
      href: 'matrix.html',
    },
  ];

  // --- Nav labels per language ---
  const NAV_LABELS = {
    en: {
      nav_home: 'Home',
      nav_menu_owasp: 'OWASP Top 10',
      nav_menu_practices: 'Practices',
      nav_menu_news: 'News',
      nav_menu_matrix: 'Matrix',
      nav_group_ai: 'AI Security',
      nav_group_infra: 'Infrastructure',
      nav_owasp: 'OWASP API Top 10',
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
      nav_menu_owasp: 'OWASP Top 10',
      nav_menu_practices: '\u30D7\u30E9\u30AF\u30C6\u30A3\u30B9',
      nav_menu_news: '\u30CB\u30E5\u30FC\u30B9',
      nav_menu_matrix: '\u30DE\u30C8\u30EA\u30AF\u30B9',
      nav_group_ai: 'AI\u30BB\u30AD\u30E5\u30EA\u30C6\u30A3',
      nav_group_infra: '\u30A4\u30F3\u30D5\u30E9',
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
      nav_menu_owasp: 'OWASP Top 10',
      nav_menu_practices: 'Pr\u00E1cticas',
      nav_menu_news: 'Noticias',
      nav_menu_matrix: 'Matriz',
      nav_group_ai: 'Seguridad IA',
      nav_group_infra: 'Infraestructura',
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
      nav_menu_owasp: 'OWASP Top 10',
      nav_menu_practices: 'Pr\u00E1ticas',
      nav_menu_news: 'Not\u00EDcias',
      nav_menu_matrix: 'Matriz',
      nav_group_ai: 'Seguran\u00E7a IA',
      nav_group_infra: 'Infraestrutura',
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
      nav_menu_owasp: 'OWASP Top 10',
      nav_menu_practices: 'Pratiques',
      nav_menu_news: 'Actualit\u00E9s',
      nav_menu_matrix: 'Matrice',
      nav_group_ai: 'S\u00E9curit\u00E9 IA',
      nav_group_infra: 'Infrastructure',
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
      desc: 'AI Security Hub &mdash; Security information portal for development teams',
      ref: 'Reference: ',
    },
    ja: {
      desc: 'AI Security Hub &mdash; \u793E\u5185\u5411\u3051\u30BB\u30AD\u30E5\u30EA\u30C6\u30A3\u60C5\u5831\u30DD\u30FC\u30BF\u30EB',
      ref: '\u53C2\u8003: ',
    },
    es: {
      desc: 'AI Security Hub &mdash; Portal de informaci\u00F3n de seguridad',
      ref: 'Referencia: ',
    },
    pt: {
      desc: 'AI Security Hub &mdash; Portal de informa\u00E7\u00F5es de seguran\u00E7a',
      ref: 'Refer\u00EAncia: ',
    },
    fr: {
      desc: 'AI Security Hub &mdash; Portail d\'informations de s\u00E9curit\u00E9',
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

  // --- Build navbar ---
  function buildNavbar() {
    const nav = document.createElement('nav');
    nav.className = 'navbar';
    nav.id = 'navbar';

    const current = currentFile();

    // Check if a page is in this menu item (for active highlight)
    function isActiveInMenu(menuItem) {
      if (menuItem.type === 'link') return current === menuItem.href;
      if (menuItem.type === 'dropdown') return menuItem.items.some(i => current === i.href);
      if (menuItem.type === 'mega') return menuItem.groups.some(g => g.items.some(i => current === i.href));
      return false;
    }

    // Build menu HTML
    let menuHtml = '';
    NAV_MENU.forEach(menu => {
      if (menu.type === 'link') {
        const activeLinkClass = current === menu.href ? ' nav-link-active' : '';
        menuHtml += `<a class="nav-link${activeLinkClass}" href="${menu.href}">${getNavLabel(menu.labelKey)}</a>`;
      } else if (menu.type === 'mega') {
        const activeClass = isActiveInMenu(menu) ? ' nav-link-active' : '';
        menuHtml += `<div class="nav-item has-dropdown">`;
        menuHtml += `<button class="nav-link${activeClass}" aria-expanded="false">${getNavLabel(menu.labelKey)} <span class="nav-arrow">\u25BE</span></button>`;
        menuHtml += `<div class="dropdown-panel mega-panel">`;
        menu.groups.forEach(group => {
          menuHtml += `<div class="dropdown-group">`;
          menuHtml += `<div class="dropdown-group-title">${getNavLabel(group.labelKey)}</div>`;
          group.items.forEach(item => {
            const activeLink = current === item.href ? ' dropdown-link-active' : '';
            menuHtml += `<a href="${item.href}" class="dropdown-link${activeLink}"><span class="dropdown-icon">${item.icon}</span> ${getNavLabel(item.labelKey)}</a>`;
          });
          menuHtml += `</div>`;
        });
        menuHtml += `</div></div>`;
      } else if (menu.type === 'dropdown') {
        const activeClass = isActiveInMenu(menu) ? ' nav-link-active' : '';
        menuHtml += `<div class="nav-item has-dropdown">`;
        menuHtml += `<button class="nav-link${activeClass}" aria-expanded="false">${getNavLabel(menu.labelKey)} <span class="nav-arrow">\u25BE</span></button>`;
        menuHtml += `<div class="dropdown-panel">`;
        menu.items.forEach(item => {
          const activeLink = current === item.href ? ' dropdown-link-active' : '';
          menuHtml += `<a href="${item.href}" class="dropdown-link${activeLink}"><span class="dropdown-icon">${item.icon}</span> ${getNavLabel(item.labelKey)}</a>`;
        });
        menuHtml += `</div></div>`;
      }
    });

    // Language select
    const langOptions = LANGUAGES.map(l =>
      `<option value="${l.code}" ${l.code === currentLang ? 'selected' : ''}>${l.label}</option>`
    ).join('');

    nav.innerHTML = `
      <a href="index.html" class="navbar-logo">\u{1F6E1} AI Security Hub</a>
      <div class="navbar-menu" id="navbar-menu">
        ${menuHtml}
        <div class="navbar-lang-mobile">
          <select class="lang-select-compact" id="lang-select-mobile">
            ${langOptions}
          </select>
        </div>
      </div>
      <div class="navbar-right">
        <select class="lang-select-compact" id="lang-select">
          ${langOptions}
        </select>
      </div>
      <button class="navbar-toggle" id="navbar-toggle" aria-label="Menu">\u2630</button>
    `;
    return nav;
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
    const navbar = buildNavbar();
    const footer = buildFooter();

    body.appendChild(navbar);
    body.appendChild(main);
    body.appendChild(footer);

    // --- Language switchers ---
    document.querySelectorAll('#lang-select, #lang-select-mobile').forEach(sel => {
      sel.addEventListener('change', (e) => {
        handleLangSwitch(e.target.value);
      });
    });

    // --- Dropdown hover/click behavior ---
    const navItems = document.querySelectorAll('.nav-item.has-dropdown');
    let activeDropdown = null;
    let hoverTimeout = null;

    navItems.forEach(item => {
      const btn = item.querySelector('.nav-link');
      const panel = item.querySelector('.dropdown-panel');

      // Desktop: hover
      item.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout);
        if (activeDropdown && activeDropdown !== item) {
          activeDropdown.classList.remove('dropdown-open');
          const prevBtn = activeDropdown.querySelector('.nav-link');
          if (prevBtn) prevBtn.setAttribute('aria-expanded', 'false');
        }
        item.classList.add('dropdown-open');
        btn.setAttribute('aria-expanded', 'true');
        activeDropdown = item;
      });

      item.addEventListener('mouseleave', () => {
        hoverTimeout = setTimeout(() => {
          item.classList.remove('dropdown-open');
          btn.setAttribute('aria-expanded', 'false');
          if (activeDropdown === item) activeDropdown = null;
        }, 150);
      });

      // Click toggle (for mobile and accessibility)
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = item.classList.contains('dropdown-open');
        // Close all others
        navItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('dropdown-open');
            const otherBtn = other.querySelector('.nav-link');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });
        if (isOpen) {
          item.classList.remove('dropdown-open');
          btn.setAttribute('aria-expanded', 'false');
          activeDropdown = null;
        } else {
          item.classList.add('dropdown-open');
          btn.setAttribute('aria-expanded', 'true');
          activeDropdown = item;
        }
      });
    });

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-item.has-dropdown')) {
        navItems.forEach(item => {
          item.classList.remove('dropdown-open');
          const btn = item.querySelector('.nav-link');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });
        activeDropdown = null;
      }
    });

    // --- Mobile hamburger toggle ---
    const toggle = document.getElementById('navbar-toggle');
    const menu = document.getElementById('navbar-menu');

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.contains('navbar-menu-open');
      if (isOpen) {
        menu.classList.remove('navbar-menu-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '\u2630';
      } else {
        menu.classList.add('navbar-menu-open');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.textContent = '\u2715';
      }
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
