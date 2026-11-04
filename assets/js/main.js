/**
 * CareGrid Hospital Suite - Master Application Scripts
 * Manages Theme (Light/Dark), Direction (LTR/RTL), Mobile Navigation,
 * Back to Top, Interactive Ward Bed Visualization, Dashboard Tabs,
 * Pricing Switcher, Form Validation, and Modals.
 */

(function () {
  'use strict';

  // Helper selectors
  var $ = function (selector, context) {
    return (context || document).querySelector(selector);
  };
  var $$ = function (selector, context) {
    return Array.prototype.slice.call((context || document).querySelectorAll(selector));
  };

  /* ==========================================================================
     1. THEME MANAGER (LIGHT / DARK) - Persisted via localStorage
     ========================================================================== */
  var THEME_KEY = 'caregrid_theme';

  function getSavedTheme() {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    // Default to light for clinical SaaS, or system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);

    // Update all theme toggle buttons across public, mobile and login headers
    $$('.theme-toggle-btn').forEach(function (btn) {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      var icon = btn.querySelector('.theme-icon');
      if (icon) {
        if (theme === 'dark') {
          // Sun icon for dark mode (click to switch to light)
          icon.innerHTML = '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
        } else {
          // Moon icon for light mode (click to switch to dark)
          icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
        }
      }
      var label = btn.querySelector('.theme-text');
      if (label) {
        label.textContent = theme === 'dark' ? 'Light' : 'Dark';
      }
    });
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') || 'light';
    var next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  }

  // Initialize Theme immediately
  applyTheme(getSavedTheme());

  /* ==========================================================================
     2. DIRECTION MANAGER (LTR / RTL) - Persisted via localStorage
     ========================================================================== */
  var DIR_KEY = 'caregrid_dir';

  function getSavedDir() {
    return localStorage.getItem(DIR_KEY) || 'ltr';
  }

  function applyDir(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(DIR_KEY, dir);

    // Update all dir toggle buttons
    $$('.dir-toggle-btn').forEach(function (btn) {
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to Left to Right direction' : 'Switch to Right to Left direction');
      var text = btn.querySelector('.dir-text');
      if (text) {
        text.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      }
    });
  }

  function toggleDir() {
    var current = document.documentElement.getAttribute('dir') || 'ltr';
    var next = current === 'rtl' ? 'ltr' : 'rtl';
    applyDir(next);
  }

  // Initialize Direction immediately
  applyDir(getSavedDir());

  /* ==========================================================================
     3. MOBILE NAVIGATION HAMBURGER & DRAWER
     ========================================================================== */
  var hamburgerBtn = $('#hamburgerBtn');
  var mobileDrawer = $('#mobileDrawer');
  var mobileHomeToggle = $('#mobileHomeToggle');
  var mobileHomeContent = $('#mobileHomeContent');

  function openMobileMenu() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    document.body.classList.add('mobile-menu-open');
    if (hamburgerBtn) {
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      hamburgerBtn.innerHTML = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
    }
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    document.body.classList.remove('mobile-menu-open');
    if (hamburgerBtn) {
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      hamburgerBtn.innerHTML = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
    }
    document.body.style.overflow = '';

    // Rule: Closing the mobile menu must also close the Home dropdown.
    if (mobileHomeContent) {
      mobileHomeContent.hidden = true;
    }
    if (mobileHomeToggle) {
      mobileHomeToggle.setAttribute('aria-expanded', 'false');
      var chev = mobileHomeToggle.querySelector('.chev-icon');
      if (chev) chev.style.transform = '';
    }
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', function () {
      var isOpen = mobileDrawer && mobileDrawer.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  // Mobile Home Dropdown toggle inside mobile drawer
  if (mobileHomeToggle && mobileHomeContent) {
    mobileHomeToggle.addEventListener('click', function (e) {
      e.preventDefault();
      var isExpanded = mobileHomeToggle.getAttribute('aria-expanded') === 'true';
      mobileHomeToggle.setAttribute('aria-expanded', String(!isExpanded));
      mobileHomeContent.hidden = isExpanded;
      var chev = mobileHomeToggle.querySelector('.chev-icon');
      if (chev) {
        chev.style.transform = isExpanded ? '' : 'rotate(180deg)';
      }
    });
  }

  // Close mobile drawer when clicking on the backdrop
  if (mobileDrawer) {
    mobileDrawer.addEventListener('click', function (e) {
      if (e.target === mobileDrawer) {
        closeMobileMenu();
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1200 && mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // Close mobile menu when clicking any nav link
  $$('.mobile-drawer-body a:not(#mobileHomeToggle)').forEach(function (link) {
    link.addEventListener('click', function () {
      closeMobileMenu();
    });
  });

  /* ==========================================================================
     4. DESKTOP HOME DROPDOWN ACCESSIBILITY
     ========================================================================== */
  var desktopHomeDropdown = $('#desktopHomeDropdown');
  var desktopHomeToggle = $('#desktopHomeToggle');

  if (desktopHomeToggle && desktopHomeDropdown) {
    desktopHomeToggle.addEventListener('click', function (e) {
      e.preventDefault();
      var isOpen = desktopHomeDropdown.classList.toggle('open');
      desktopHomeToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', function (e) {
      if (!desktopHomeDropdown.contains(e.target)) {
        desktopHomeDropdown.classList.remove('open');
        desktopHomeToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Highlight Home in menu for Home 1 and Home 2
  var currentPath = window.location.pathname.toLowerCase();
  var currentHash = window.location.hash.toLowerCase();
  var isHome = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath.endsWith('home-2.html') || currentHash === '#home';
  if (isHome) {
    $$('.nav-home-link').forEach(function (link) {
      link.classList.add('active');
    });
  }

  /* ==========================================================================
     5. BACK TO TOP BUTTON
     ========================================================================== */
  var backToTopBtn = $('#backToTop');

  function handleScroll() {
    if (!backToTopBtn) return;
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     6. PRICING TOGGLE (MONTHLY vs YEARLY)
     ========================================================================== */
  var pricingButtons = $$('[data-pricing-toggle]');

  function setPricingPeriod(isYearly) {
    pricingButtons.forEach(function (b) {
      var isTarget = b.getAttribute('data-period') === (isYearly ? 'y' : 'm');
      b.setAttribute('aria-pressed', String(isTarget));
    });

    $$('[data-price-monthly]').forEach(function (elem) {
      var monthly = parseInt(elem.getAttribute('data-price-monthly'), 10);
      if (isNaN(monthly)) return;
      var price = isYearly ? Math.round(monthly * 0.8) : monthly;
      elem.textContent = '₹' + price.toLocaleString('en-IN');
    });

    $$('.price-period-label').forEach(function (label) {
      label.textContent = isYearly ? ' / mo (billed annual)' : ' / month';
    });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-pricing-toggle]');
    if (btn) {
      var period = btn.getAttribute('data-period');
      setPricingPeriod(period === 'y');
    }
  });

  /* ==========================================================================
     FAQ ACCORDION (MUTUALLY EXCLUSIVE ACCORDION / ONE OPEN AT A TIME)
     ========================================================================== */
  document.addEventListener('toggle', function (e) {
    if (e.target && e.target.classList && e.target.classList.contains('faq-item')) {
      if (e.target.open) {
        var container = e.target.closest('.faq-grid') || e.target.parentElement || document;
        container.querySelectorAll('.faq-item').forEach(function (item) {
          if (item !== e.target && item.open) {
            item.removeAttribute('open');
          }
        });
      }
    }
  }, true);

  /* ==========================================================================
     7. HERO & DASHBOARD LIVE BED BOARD VISUALIZER
     ========================================================================== */
  var BED_MAP = { O: 'o', A: 'a', C: 'c', X: 'x' };
  var BED_LABELS = { O: 'Occupied', A: 'Available', C: 'Cleaning', X: 'Critical' };
  var BED_CYCLE = { A: 'O', O: 'X', X: 'C', C: 'A' };

  function generateBedTiles(statusString, prefix, isInteractive) {
    return statusString.split('').map(function (c, i) {
      var bedNum = i + 1;
      var tag = isInteractive ? 'button type="button"' : 'div';
      var closeTag = isInteractive ? '</button>' : '</div>';
      var attr = isInteractive ? ' data-bed-idx="' + i + '" data-bed-prefix="' + prefix + '"' : '';
      return '<' + tag + ' class="bed-tile b-' + (BED_MAP[c] || 'a') + '" title="' + prefix + bedNum + ': ' + (BED_LABELS[c] || 'Available') + '" aria-label="' + prefix + bedNum + ', ' + (BED_LABELS[c] || 'Available') + '"' + attr + '>' + bedNum + closeTag;
    }).join('');
  }

  function countChar(str, ch) {
    return str.split(ch).length - 1;
  }

  // Hero Bed Board initialization
  var heroBedString = 'OOAOOXOCOOOAOOCOOXOOAOOOOCOOOOAOOOXOOOAO';
  var heroBedsContainer = $('#hero-beds');
  var heroBedSummary = $('#hero-bed-sum');
  var heroOccKpi = $('#hero-kpi-occ');

  function renderHeroBeds() {
    if (!heroBedsContainer) return;
    heroBedsContainer.innerHTML = generateBedTiles(heroBedString, 'G-', true);
    var free = countChar(heroBedString, 'A');
    var cleaning = countChar(heroBedString, 'C');
    var total = heroBedString.length;
    var occupied = total - free - cleaning;
    var occPct = Math.round((occupied / total) * 100);

    if (heroBedSummary) {
      heroBedSummary.textContent = free + ' free · ' + cleaning + ' cleaning';
    }
    if (heroOccKpi) {
      heroOccKpi.textContent = occPct + '%';
    }
  }
  renderHeroBeds();

  // Interactive Bed Tile Click
  document.addEventListener('click', function (e) {
    var bedBtn = e.target.closest('button.bed-tile');
    if (!bedBtn) return;
    if (bedBtn.hasAttribute('data-bed-idx')) {
      var idx = parseInt(bedBtn.getAttribute('data-bed-idx'), 10);
      var chars = heroBedString.split('');
      var current = chars[idx] || 'A';
      chars[idx] = BED_CYCLE[current] || 'A';
      heroBedString = chars.join('');
      renderHeroBeds();
    } else {
      var curClass = bedBtn.classList.contains('b-o') ? 'b-o' : (bedBtn.classList.contains('b-x') ? 'b-x' : (bedBtn.classList.contains('b-c') ? 'b-c' : 'b-a'));
      var nextClass = { 'b-a': 'b-o', 'b-o': 'b-x', 'b-x': 'b-c', 'b-c': 'b-a' }[curClass];
      bedBtn.classList.remove('b-a', 'b-o', 'b-x', 'b-c');
      bedBtn.classList.add(nextClass);
    }
  });

  // Interactive Shift Badge Click
  document.addEventListener('click', function (e) {
    var shiftBadge = e.target.closest('.roster-table .shift-badge');
    if (shiftBadge) {
      var curShift = shiftBadge.classList.contains('s-M') ? 's-M' : (shiftBadge.classList.contains('s-E') ? 's-E' : (shiftBadge.classList.contains('s-N') ? 's-N' : 's-O'));
      var nextShift = { 's-M': 's-E', 's-E': 's-N', 's-N': 's-O', 's-O': 's-M' }[curShift];
      var nextText = { 's-M': 'E', 's-E': 'N', 's-N': '–', 's-O': 'M' }[curShift];
      shiftBadge.classList.remove('s-M', 's-E', 's-N', 's-O');
      shiftBadge.classList.add(nextShift);
      shiftBadge.textContent = nextText;
    }
  });

  // Preview Wards Board
  var wardBoardsContainer = $('#preview-wards');
  if (wardBoardsContainer) {
    var sampleWards = [
      { name: 'Intensive Care Unit (ICU)', code: 'ICU-', beds: 'OOXOOXOOAOOXOOAOOX' },
      { name: 'General Inpatient Ward', code: 'GW-', beds: 'OOAOOCOOOAOOOCOAOO' },
      { name: 'Maternity & Neonatal Care', code: 'MAT-', beds: 'OAOOCOOAOOAOOOAOCO' }
    ];
    wardBoardsContainer.innerHTML = sampleWards.map(function (w) {
      var free = countChar(w.beds, 'A');
      return '<div class="ward-card">' +
        '<div class="hero-board-subhead">' +
          '<b style="color:var(--ink)">' + w.name + '</b>' +
          '<span class="mono">' + free + ' free / ' + w.beds.length + '</span>' +
        '</div>' +
        '<div class="beds-grid">' + generateBedTiles(w.beds, w.code, false) + '</div>' +
      '</div>';
    }).join('');
  }

  // Dashboard Tab Switching
  $$('.dash-nav-btn[data-dash-tab]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tabId = btn.getAttribute('data-dash-tab');
      $$('.dash-nav-btn[data-dash-tab]').forEach(function (b) {
        b.setAttribute('aria-selected', String(b === btn));
      });
      $$('.dash-pane').forEach(function (pane) {
        pane.hidden = pane.id !== 'dash-pane-' + tabId;
      });
    });
  });

  // Daily Collections Bar Chart Sample Data
  var chartElem = $('#preview-chart');
  var axisElem = $('#preview-axis');
  if (chartElem && axisElem) {
    var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    var vals = [2.4, 3.1, 2.8, 3.6, 3.2, 2.1, 1.2];
    var maxVal = 4.0;
    chartElem.innerHTML = vals.map(function (v) {
      var pct = Math.round((v / maxVal) * 100 * 0.85);
      return '<div class="chart-col"><span>' + v.toFixed(1) + 'L</span><div class="chart-bar" style="height:' + pct + '%" title="' + v + ' Lakhs"></div></div>';
    }).join('');
    axisElem.innerHTML = days.map(function (d) {
      return '<span>' + d + '</span>';
    }).join('');
  }

  /* ==========================================================================
     8. FORM VALIDATION ENGINE
     ========================================================================== */
  var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var PHONE_REGEX = /^[+\d][\d\s\-().]{6,}$/;

  function validateInput(input) {
    var isRequired = input.hasAttribute('required');
    var val = input.value.trim();
    var isValid = true;
    var errorMsg = '';

    if (isRequired && !val) {
      isValid = false;
      errorMsg = 'This field is required.';
    } else if (val && input.type === 'email' && !EMAIL_REGEX.test(val)) {
      isValid = false;
      errorMsg = 'Please enter a valid email address.';
    } else if (val && input.type === 'tel' && !PHONE_REGEX.test(val)) {
      isValid = false;
      errorMsg = 'Please enter a valid phone number.';
    }

    var group = input.closest('.form-group');
    var errorElem = group ? group.querySelector('.form-error') : null;

    if (!isValid) {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      if (errorElem) {
        errorElem.textContent = errorMsg;
        errorElem.style.display = 'block';
      }
    } else {
      input.classList.remove('is-invalid');
      if (val) input.classList.add('is-valid');
      if (errorElem) {
        errorElem.style.display = 'none';
      }
    }

    return isValid;
  }

  // Bind live validation on blur and input
  document.addEventListener('blur', function (e) {
    if (e.target.matches && e.target.matches('.form-control')) {
      validateInput(e.target);
    }
  }, true);

  document.addEventListener('input', function (e) {
    if (e.target.matches && e.target.matches('.form-control.is-invalid')) {
      validateInput(e.target);
    }
  });

  // Form submission handler
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form.hasAttribute('data-validate')) return;
    e.preventDefault();

    var inputs = $$('.form-control', form);
    var allValid = true;

    inputs.forEach(function (inp) {
      if (!validateInput(inp)) {
        allValid = false;
      }
    });

    var feedback = $('.form-feedback', form);
    if (!allValid) {
      if (feedback) {
        feedback.className = 'form-feedback error';
        feedback.textContent = 'Please fix the highlighted errors before submitting.';
      }
      return;
    }

    // Success response (Demo-only simulation compliant)
    if (feedback) {
      feedback.className = 'form-feedback success';
      feedback.innerHTML = '<strong>Request Validated (Demo Simulation Mode):</strong> Thank you! Your details have been verified successfully in this interface walkthrough. In production, this dispatches a notification to your facility onboarding coordinator.';
    }
    form.reset();
    inputs.forEach(function (inp) {
      inp.classList.remove('is-valid');
    });
  });

  /* ==========================================================================
     9. MODAL CONTROLLER (DEMO / LOGIN)
     ========================================================================== */
  var scrim = $('#scrimBackdrop');
  var modalContainer = $('#modalContainer');
  var lastActiveElement = null;

  var MODAL_TEMPLATES = {
    demo: '<h3>Request a CareGrid Demo</h3>' +
      '<p class="form-hint" style="margin: 8px 0 20px;">Experience a customized 30-minute walkthrough configured for your bed capacity.</p>' +
      '<form data-validate novalidate>' +
        '<div class="form-grid">' +
          '<div class="form-group"><label for="m-name">Your Full Name <span class="required">*</span></label><input id="m-name" class="form-control" required autocomplete="name"><span class="form-error"></span></div>' +
          '<div class="form-group"><label for="m-role">Your Role</label><select id="m-role" class="form-control"><option>Hospital Owner / MD</option><option>Medical Superintendent</option><option>Finance / CFO</option><option>Chief Information Officer</option><option>Nursing Director</option></select></div>' +
          '<div class="form-group"><label for="m-hosp">Hospital Name <span class="required">*</span></label><input id="m-hosp" class="form-control" required><span class="form-error"></span></div>' +
          '<div class="form-group"><label for="m-beds">Total Licensed Beds</label><select id="m-beds" class="form-control"><option>Under 50 Beds</option><option selected>50 to 250 Beds</option><option>250 to 500 Beds</option><option>500+ Beds (Multi-Campus)</option></select></div>' +
          '<div class="form-group"><label for="m-email">Work Email <span class="required">*</span></label><input id="m-email" type="email" class="form-control" required autocomplete="email"><span class="form-error"></span></div>' +
          '<div class="form-group"><label for="m-phone">Contact Phone <span class="required">*</span></label><input id="m-phone" type="tel" class="form-control" required autocomplete="tel"><span class="form-error"></span></div>' +
        '</div>' +
        '<div class="form-feedback"></div>' +
        '<button class="btn btn-block" type="submit" style="margin-top: 20px;">Confirm Demo Booking</button>' +
      '</form>',

    login: '<h3>Hospital Workspace Sign In</h3>' +
      '<p class="form-hint" style="margin: 8px 0 20px;">Enter your facility credentials to access your hospital management workspace.</p>' +
      '<form data-validate novalidate>' +
        '<div class="form-group"><label for="ml-id">Facility Identifier (Hospital ID) <span class="required">*</span></label><input id="ml-id" class="form-control" placeholder="e.g. CITYGEN-2026" required><span class="form-error"></span></div>' +
        '<div class="form-group" style="margin-top:14px;"><label for="ml-email">Authorized Email <span class="required">*</span></label><input id="ml-email" type="email" class="form-control" required autocomplete="email"><span class="form-error"></span></div>' +
        '<div class="form-group" style="margin-top:14px;"><label for="ml-pass">Access Password <span class="required">*</span></label><input id="ml-pass" type="password" class="form-control" required autocomplete="current-password"><span class="form-error"></span></div>' +
        '<label class="checkbox-label" style="margin-top:14px;"><input type="checkbox"> Remember this secure clinical workstation</label>' +
        '<div class="form-feedback"></div>' +
        '<button class="btn btn-block" type="submit" style="margin-top: 20px;">Authenticate & Enter Console</button>' +
        '<div style="text-align:center; margin-top:16px;"><a href="login.html" class="mono" style="font-size:0.84rem; color:var(--brand);">Open dedicated full login page &rarr;</a></div>' +
      '</form>'
  };

  function openModal(modalKey) {
    if (!scrim || !modalContainer) return;
    lastActiveElement = document.activeElement;
    var content = MODAL_TEMPLATES[modalKey] || '';
    modalContainer.innerHTML = '<button class="modal-close-btn" type="button" id="modalCloseBtn" aria-label="Close dialog"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>' + content;
    scrim.hidden = false;
    document.body.style.overflow = 'hidden';

    var closeBtn = $('#modalCloseBtn', modalContainer);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (window.matchMedia('(max-width: 600px)').matches) {
      if (closeBtn) closeBtn.focus({ preventScroll: true });
    } else {
      var firstInput = modalContainer.querySelector('input, select');
      if (firstInput) firstInput.focus();
    }
    modalContainer.scrollTop = 0;
  }

  function closeModal() {
    if (!scrim) return;
    scrim.hidden = true;
    document.body.style.overflow = '';
    if (lastActiveElement && lastActiveElement.focus) {
      lastActiveElement.focus();
    }
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-open-modal]');
    if (trigger) {
      e.preventDefault();
      if (mobileDrawer && mobileDrawer.contains(trigger)) {
        closeMobileMenu();
        if (hamburgerBtn) hamburgerBtn.focus();
      }
      var key = trigger.getAttribute('data-open-modal');
      openModal(key);
    }
    if (e.target === scrim) {
      closeModal();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && scrim && !scrim.hidden) {
      closeModal();
    }
  });

  // Global theme and dir event delegations
  document.addEventListener('click', function (e) {
    if (e.target.closest('.theme-toggle-btn')) {
      toggleTheme();
    }
    if (e.target.closest('.dir-toggle-btn')) {
      toggleDir();
    }
  });

  /* ==========================================================================
     10. PHASE 6: LOGIN & ADMIN DASHBOARD INTERACTIVE ENGINES
     ========================================================================== */

  // Dedicated Login Form Handler (Simulated Authentication & Redirect)
  var loginForm = $('#hospitalLoginForm');
  var fillDemoBtn = $('#fillDemoBtn');
  var forgotPasswordBtn = $('#forgotPasswordBtn');

  if (fillDemoBtn) {
    fillDemoBtn.addEventListener('click', function () {
      var fac = $('#l-facility');
      var em = $('#l-email');
      var pass = $('#l-password');
      if (fac) fac.value = 'HOSP-2026-METRO';
      if (em) em.value = 'dr.thorne@caregrid.demo';
      if (pass) pass.value = 'DemoHospitalPass2026!';
      var fb = $('#loginFeedback');
      if (fb) {
        fb.className = 'form-feedback success';
        fb.textContent = 'Administrator sample credentials filled. Click "Sign In" below.';
      }
    });
  }

  if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener('click', function (e) {
      e.preventDefault();
      alert('Demo Simulation Notice: In production, this issues an out-of-band password reset token to your verified hospital email. For this demo, please use the pre-filled credentials.');
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var fac = $('#l-facility');
      var em = $('#l-email');
      var pass = $('#l-password');
      var fb = $('#loginFeedback');

      if (!fac || !em || !pass || !fac.value.trim() || !em.value.trim() || !pass.value.trim()) {
        if (fb) {
          fb.className = 'form-feedback error';
          fb.textContent = 'Please provide Hospital ID, Email, and Password.';
        }
        return;
      }

      if (fb) {
        fb.className = 'form-feedback success';
        fb.innerHTML = '<strong>Access Granted (Demo Simulation Mode):</strong> Validating workstation session... Opening Hospital Admin Dashboard.';
      }

      var btn = $('#loginSubmitBtn');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span>Opening Dashboard...</span>';
      }

      setTimeout(function () {
        window.location.href = 'dashboard.html';
      }, 650);
    });
  }

  // Dashboard Toast Helper
  function showDashToast(msg) {
    var toast = $('#dashToast');
    var toastMsg = $('#dashToastMsg');
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.style.display = 'block';
    setTimeout(function () {
      toast.style.display = 'none';
    }, 3500);
  }

  // Dashboard Tab Switching (Overview, Patients, Billing, Beds, Schedules)
  var dashNavBtns = $$('.dash-nav-btn[data-tab]');
  dashNavBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetTab = btn.getAttribute('data-tab');
      dashNavBtns.forEach(function (b) {
        var isTarget = b === btn;
        b.classList.toggle('active', isTarget);
        b.setAttribute('aria-selected', String(isTarget));
      });

      $$('.dash-panel').forEach(function (panel) {
        var isTargetPanel = panel.id === 'panel-' + targetTab;
        panel.classList.toggle('active', isTargetPanel);
      });
    });
  });

  // Patient Records Search & Filter
  var ptSearchInput = $('#patientSearchInput');
  var ptWardFilter = $('#patientWardFilter');
  var ptStatusFilter = $('#patientStatusFilter');
  var ptMatchCount = $('#patientMatchCount');

  function filterPatients() {
    var query = (ptSearchInput ? ptSearchInput.value : '').toLowerCase().trim();
    var ward = ptWardFilter ? ptWardFilter.value : 'all';
    var status = ptStatusFilter ? ptStatusFilter.value : 'all';
    var rows = $$('#patientTableBody tr');
    var visibleCount = 0;

    rows.forEach(function (row) {
      var text = row.textContent.toLowerCase();
      var rowWard = row.getAttribute('data-ward') || '';
      var rowStatus = row.getAttribute('data-status') || '';

      var matchesQuery = !query || text.indexOf(query) !== -1;
      var matchesWard = ward === 'all' || rowWard.indexOf(ward) !== -1;
      var matchesStatus = status === 'all' || rowStatus.toLowerCase() === status.toLowerCase();

      var match = matchesQuery && matchesWard && matchesStatus;
      row.style.display = match ? '' : 'none';
      if (match) visibleCount++;
    });

    if (ptMatchCount) {
      ptMatchCount.textContent = 'Showing ' + visibleCount + ' patient' + (visibleCount === 1 ? '' : 's');
    }
  }

  if (ptSearchInput) ptSearchInput.addEventListener('input', filterPatients);
  if (ptWardFilter) ptWardFilter.addEventListener('change', filterPatients);
  if (ptStatusFilter) ptStatusFilter.addEventListener('change', filterPatients);

  // Patient Chart Details View Modal
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.view-patient-btn');
    if (btn) {
      var name = btn.getAttribute('data-name');
      var id = btn.getAttribute('data-id');
      var ward = btn.getAttribute('data-ward');
      var doc = btn.getAttribute('data-doctor');
      var vitals = btn.getAttribute('data-vitals');

      var mName = $('#modalPatientName');
      var mId = $('#modalPatientId');
      var mWard = $('#modalPatientWard');
      var mDoc = $('#modalPatientDoctor');
      var mVitals = $('#modalPatientVitals');
      var modal = $('#patientDetailsModal');

      if (mName) mName.textContent = name;
      if (mId) mId.textContent = 'ID: #' + id;
      if (mWard) mWard.textContent = ward;
      if (mDoc) mDoc.textContent = doc;
      if (mVitals) mVitals.textContent = vitals;
      if (modal) modal.hidden = false;
    }
  });

  // Add Patient Form Simulation
  var addPtForm = $('#addPatientForm');
  if (addPtForm) {
    addPtForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('#newPtName') ? $('#newPtName').value.trim() : '';
      var age = $('#newPtAge') ? $('#newPtAge').value.trim() : '40';
      var sex = $('#newPtSex') ? $('#newPtSex').value : 'F';
      var ward = $('#newPtWard') ? $('#newPtWard').value : 'General Ward A';
      var doc = $('#newPtDoctor') ? $('#newPtDoctor').value : 'Dr. Aris Thorne';

      if (!name) return;

      var newId = 'PT-' + Math.floor(100000 + Math.random() * 900000);
      var tbody = $('#patientTableBody');
      if (tbody) {
        var tr = document.createElement('tr');
        tr.setAttribute('data-patient-id', newId);
        tr.setAttribute('data-ward', ward);
        tr.setAttribute('data-status', 'Admitted');
        tr.innerHTML = '<td class="mono font-semibold" style="color:var(--brand);">#' + newId + '</td>' +
          '<td><strong>' + name + '</strong></td>' +
          '<td>' + age + ' / ' + sex + '</td>' +
          '<td>' + ward + '</td>' +
          '<td>' + doc + '</td>' +
          '<td>Just now</td>' +
          '<td><span class="status-chip admitted">Admitted</span></td>' +
          '<td style="text-align:right;">' +
            '<button class="btn btn-secondary btn-sm view-patient-btn" type="button" data-name="' + name + '" data-id="' + newId + '" data-ward="' + ward + '" data-doctor="' + doc + '" data-vitals="HR: 75 bpm &middot; BP: 120/80 &middot; SpO2: 99%">View Chart</button>' +
          '</td>';
        tbody.insertBefore(tr, tbody.firstChild);
      }

      // Increment counters
      var kpiTot = $('#kpiTotalPatients');
      var kpiAdm = $('#kpiCurrentAdmissions');
      if (kpiTot) kpiTot.textContent = String(parseInt(kpiTot.textContent, 10) + 1);
      if (kpiAdm) kpiAdm.textContent = String(parseInt(kpiAdm.textContent, 10) + 1);

      addPtForm.reset();
      var modal = $('#addPatientModal');
      if (modal) modal.hidden = true;
      showDashToast('Patient ' + name + ' admitted successfully (Simulated).');
      filterPatients();
    });
  }

  // Billing Filters & Collect Actions
  var billSearch = $('#billingSearchInput');
  var billFilterBtns = $$('.billing-filter-btn');
  var activeBillFilter = 'all';

  function filterBilling() {
    var query = (billSearch ? billSearch.value : '').toLowerCase().trim();
    var rows = $$('#billingTableBody tr');
    var visible = 0;

    rows.forEach(function (row) {
      var text = row.textContent.toLowerCase();
      var status = row.getAttribute('data-status') || '';
      var matchesQuery = !query || text.indexOf(query) !== -1;
      var matchesStatus = activeBillFilter === 'all' || status.toLowerCase() === activeBillFilter.toLowerCase();
      var match = matchesQuery && matchesStatus;
      row.style.display = match ? '' : 'none';
      if (match) visible++;
    });

    var countElem = $('#billingMatchCount');
    if (countElem) {
      countElem.textContent = 'Showing ' + visible + ' invoice' + (visible === 1 ? '' : 's');
    }
  }

  if (billSearch) billSearch.addEventListener('input', filterBilling);

  billFilterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      billFilterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      activeBillFilter = btn.getAttribute('data-filter');
      filterBilling();
    });
  });

  // Mark as Paid Button
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.mark-paid-btn');
    if (btn) {
      var row = btn.closest('tr');
      var inv = btn.getAttribute('data-inv');
      var amt = parseInt(btn.getAttribute('data-amt'), 10) || 0;

      if (row) {
        row.setAttribute('data-status', 'Paid');
        var statusCell = row.querySelector('.status-chip');
        if (statusCell) {
          statusCell.className = 'status-chip paid';
          statusCell.textContent = 'Paid';
        }
      }

      btn.disabled = true;
      btn.className = 'btn btn-sm btn-secondary';
      btn.textContent = 'Cleared';

      // Update KPIs
      var kpiPend = $('#kpiPendingReceivables');
      var kpiColl = $('#kpiCollectedRevenue');
      if (kpiPend) {
        var curPend = parseInt(kpiPend.textContent.replace(/[$,]/g, ''), 10) || 18420;
        kpiPend.textContent = '$' + Math.max(0, curPend - amt).toLocaleString();
      }
      if (kpiColl) {
        var curColl = parseInt(kpiColl.textContent.replace(/[$,]/g, ''), 10) || 124080;
        kpiColl.textContent = '$' + (curColl + amt).toLocaleString();
      }

      showDashToast('Invoice #' + inv + ' marked as Paid (Simulated).');
    }
  });

  // Interactive Bed Matrix Controller
  function updateBedCounters() {
    var tiles = $$('.interactive-bed-tile');
    var occupied = 0;
    var available = 0;
    var sanitizing = 0;
    var critical = 0;

    tiles.forEach(function (tile) {
      var state = tile.getAttribute('data-state');
      if (state === 'o') occupied++;
      else if (state === 'a') available++;
      else if (state === 'c') sanitizing++;
      else if (state === 'x') critical++;
    });

    var cOcc = $('#counterOccupied');
    var cAvail = $('#counterAvailable');
    var cSan = $('#counterSanitizing');
    var cCrit = $('#counterCritical');

    if (cOcc) cOcc.textContent = String(occupied);
    if (cAvail) cAvail.textContent = String(available);
    if (cSan) cSan.textContent = String(sanitizing);
    if (cCrit) cCrit.textContent = String(critical);

    var total = tiles.length;
    var kpiOcc = $('#kpiOccupancyRate');
    if (kpiOcc && total > 0) {
      kpiOcc.textContent = Math.round(((occupied + critical) / total) * 100) + '%';
    }
    var kpiAvail = $('#kpiAvailableBedsOverview');
    if (kpiAvail) {
      kpiAvail.textContent = String(available);
    }
  }

  // Click on bed tile cycles state: a -> o -> x -> c -> a
  document.addEventListener('click', function (e) {
    var tile = e.target.closest('.interactive-bed-tile');
    if (tile) {
      var cur = tile.getAttribute('data-state') || 'a';
      var next = 'a';
      var label = 'Available';

      if (cur === 'a') {
        next = 'o';
        label = 'Occupied';
      } else if (cur === 'o') {
        next = 'x';
        label = 'Critical';
      } else if (cur === 'x') {
        next = 'c';
        label = 'Cleaning';
      } else if (cur === 'c') {
        next = 'a';
        label = 'Available';
      }

      tile.setAttribute('data-state', next);
      tile.className = 'interactive-bed-tile b-' + next;
      var lblElem = tile.querySelector('.bed-status-label');
      if (lblElem) lblElem.textContent = label;

      updateBedCounters();
      showDashToast('Bed ' + tile.getAttribute('data-bed') + ' updated to ' + label + '.');
    }
  });

  // Mark all sanitizing beds clean button
  var markCleanBtn = $('#markAllCleanBtn');
  if (markCleanBtn) {
    markCleanBtn.addEventListener('click', function () {
      var sanitizingTiles = $$('.interactive-bed-tile[data-state="c"]');
      sanitizingTiles.forEach(function (tile) {
        tile.setAttribute('data-state', 'a');
        tile.className = 'interactive-bed-tile b-a';
        var lbl = tile.querySelector('.bed-status-label');
        if (lbl) lbl.textContent = 'Available';
      });
      updateBedCounters();
      showDashToast('Housekeeping: All sanitizing beds marked Available.');
    });
  }

  // Simulate admission button
  var simAdmissionBtn = $('#simulateAdmissionBtn');
  if (simAdmissionBtn) {
    simAdmissionBtn.addEventListener('click', function () {
      var firstAvail = $('.interactive-bed-tile[data-state="a"]');
      if (firstAvail) {
        firstAvail.setAttribute('data-state', 'o');
        firstAvail.className = 'interactive-bed-tile b-o';
        var lbl = firstAvail.querySelector('.bed-status-label');
        if (lbl) lbl.textContent = 'Occupied';
        updateBedCounters();
        showDashToast('Admitted ER patient to Bed ' + firstAvail.getAttribute('data-bed') + '.');
      } else {
        alert('All beds currently occupied or in sanitization.');
      }
    });
  }

  // Staff Schedule Interactive Shift Badges
  document.addEventListener('click', function (e) {
    var badge = e.target.closest('.cycle-shift-btn');
    if (badge) {
      var curShift = badge.getAttribute('data-shift') || 'morning';
      var nextShift = 'morning';
      var nextLabel = 'Morning';

      if (curShift === 'morning') {
        nextShift = 'evening';
        nextLabel = 'Evening';
      } else if (curShift === 'evening') {
        nextShift = 'night';
        nextLabel = 'Night';
      } else if (curShift === 'night') {
        nextShift = 'off';
        nextLabel = 'Off Duty';
      } else if (curShift === 'off') {
        nextShift = 'morning';
        nextLabel = 'Morning';
      }

      badge.setAttribute('data-shift', nextShift);
      badge.className = 'shift-badge ' + nextShift + ' cycle-shift-btn';
      badge.textContent = nextLabel;
      showDashToast('Staff shift updated to ' + nextLabel + ' (Simulated).');
    }
  });

  // Auto-Assign On-Call Cover
  var autoAssignBtn = $('#autoAssignCoverBtn');
  if (autoAssignBtn) {
    autoAssignBtn.addEventListener('click', function () {
      var box = $('#coverageAlertBox');
      if (box) {
        box.style.borderLeftColor = 'var(--ok)';
        box.style.backgroundColor = 'rgba(30,150,110,0.06)';
        box.innerHTML = '<div style="padding:16px 20px; display:flex; justify-content:space-between; align-items:center; width:100%;"><div style="color:var(--ok); font-weight:700;">&#10003; Full Roster Coverage Restored: On-call RN assigned to General Ward B night rotation.</div><span class="status-chip healthy">Coverage 100%</span></div>';
      }
      var nightVal = $('#kpiNightShift');
      var nightMeta = $('#kpiNightMeta');
      if (nightVal) {
        nightVal.textContent = '12 / 12';
        nightVal.style.color = 'var(--ok)';
      }
      if (nightMeta) {
        nightMeta.textContent = '100% Full ward coverage verified';
      }
      showDashToast('On-call nurse successfully allocated to night shift.');
    });
  }

  // Shift Swap Form Simulation
  var shiftSwapForm = $('#shiftSwapForm');
  if (shiftSwapForm) {
    shiftSwapForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var modal = $('#shiftSwapModal');
      if (modal) modal.hidden = true;
      showDashToast('Shift swap submitted and logged in duty audit stream.');
    });
  }

  // Generic modal backdrop dismiss for dashboard modals
  $$('.modal-backdrop').forEach(function (backdrop) {
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop || e.target.closest('.modal-close-btn')) {
        backdrop.hidden = true;
      }
    });
  });

  // Expose CareGrid API to window for testing / verification
  window.CareGrid = {
    applyTheme: applyTheme,
    toggleTheme: toggleTheme,
    applyDir: applyDir,
    toggleDir: toggleDir,
    openModal: openModal,
    closeModal: closeModal,
    setPricingPeriod: setPricingPeriod
  };

})();
