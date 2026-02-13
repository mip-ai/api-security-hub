/* ============================================
   API Security Reference Site - Common JS
   ============================================ */

(function () {
  'use strict';

  // --- Page definitions ---
  const pages = [
    { href: 'index.html', icon: '🏠', label: 'トップページ' },
    { href: 'owasp-top10.html', icon: '🔟', label: 'OWASP Top 10' },
    { href: 'auth.html', icon: '🔐', label: '認証・認可' },
    { href: 'rate-limiting.html', icon: '⚡', label: 'レート制限・入力検証' },
    { href: 'tools.html', icon: '🛠', label: 'セキュリティツール' },
    { href: 'guidelines.html', icon: '📋', label: '社内ガイドライン' },
    { href: 'news.html', icon: '📰', label: '最新情報' },
  ];

  // --- Detect current page ---
  function currentFile() {
    const path = location.pathname;
    const file = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    return file;
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
          <span class="logo-icon">🛡</span>
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
            <span>${p.label}</span>
          </a>
        `).join('')}
      </nav>
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
      <button class="hamburger" id="hamburger" aria-label="メニューを開く">☰</button>
      <span class="mobile-title">🛡 API Security</span>
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
    footer.innerHTML = `
      <p>API Security Reference Hub &mdash; 社内向けセキュリティ情報ポータル</p>
      <p style="margin-top:4px">
        参考: <a href="https://owasp.org/API-Security/" target="_blank" rel="noopener">OWASP API Security Project</a>
      </p>
    `;
    return footer;
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
