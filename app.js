/* ============================================================
   FULYA AKADEMİ — Interaktion
   Motion nur wenn erwünscht, Validierung am Blur, Status live.
   ============================================================ */

(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Animationen erst aktivieren, wenn JS läuft und der Nutzer sie zulässt.
  if (!prefersReducedMotion) {
    document.documentElement.classList.add('js-motion');
  }

  /* ---------- Jahr im Footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Mobiles Menü ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.getElementById('ana-menu');

  if (navToggle && mainNav) {
    const setNav = (open) => {
      mainNav.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
    };

    navToggle.addEventListener('click', () => {
      setNav(!mainNav.classList.contains('is-open'));
    });

    mainNav.addEventListener('click', (event) => {
      if (event.target.closest('a')) setNav(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mainNav.classList.contains('is-open')) {
        setNav(false);
        navToggle.focus();
      }
    });
  }

  /* ---------- Sanftes Scrollen ---------- */
  const scrollTo = (target) => {
    if (!target) return;
    target.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start'
    });
  };

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      scrollTo(target);
    });
  });

  document.querySelectorAll('[data-scroll-target]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      scrollTo(document.querySelector(trigger.getAttribute('data-scroll-target')));
    });
  });

  /* ---------- Scroll-Reveal ---------- */
  const revealables = document.querySelectorAll('.reveal');
  if (revealables.length && !prefersReducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.1 }
    );
    revealables.forEach((el) => observer.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add('is-visible'));
  }

  /* ============================================================
     Formular
     ============================================================ */
  const form = document.querySelector('.register-form');
  if (!form) return;

  const MIN_AGE = 6;
  const MAX_AGE = 8;

  const isFileProtocol = window.location.protocol === 'file:';
  const apiBase = isFileProtocol ? 'http://localhost:3000' : '';
  const registrationApiUrl = `${apiBase}/api/registrations`;

  const birthDateInput = form.querySelector('input[name="dogum_tarihi"]');
  const statusEl = form.querySelector('.form-status');
  // Alle Eingabefelder der Schritte 2 und 3 (Schritt 1 hat sein eigenes Gate)
  const extraInputs = Array.from(
    form.querySelectorAll('.form-panel[data-panel="2"] input, .form-panel[data-panel="2"] textarea, .form-panel[data-panel="3"] input, .form-panel[data-panel="3"] textarea')
  ).filter((input) => input.type !== 'hidden');
  const transferStep = form.querySelector('.transfer-step');
  const transferQr = form.querySelector('#transfer-qr');
  const stepDots = Array.from(form.querySelectorAll('.step-dot'));
  const stepLines = Array.from(form.querySelectorAll('.step-line'));
  const panels = Array.from(form.querySelectorAll('.form-panel'));
  const stepCounter = form.querySelector('.step-counter-now');
  const summaryList = form.querySelector('.summary-list');
  const submitStatus = form.querySelector('.form-status-submit');
  const nextButtons = Array.from(form.querySelectorAll('[data-next]'));
  const prevButtons = Array.from(form.querySelectorAll('[data-prev]'));
  const LAST_INPUT_STEP = 3;
  let currentStep = 1;

  if (transferQr && isFileProtocol) {
    transferQr.src = `${apiBase}/api/transfer-qr`;
  }

  /* ---------- Icons für Statusmeldungen ---------- */
  const ICONS = {
    success:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9.5" stroke="currentColor" stroke-width="2"/><path d="m8 12.4 2.8 2.8L16.5 9.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    error:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9.5" stroke="currentColor" stroke-width="2"/><path d="M12 7.5v5.5m0 3.2h.01" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    neutral:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9.5" stroke="currentColor" stroke-width="2"/><path d="M12 11v5.5m0-8.7h.01" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>'
  };

  const paintStatus = (el, message, type) => {
    if (!el) return;
    const base = el.classList.contains('form-status-submit')
      ? 'form-status form-status-submit'
      : 'form-status';
    if (!message) {
      el.className = base;
      el.innerHTML = '';
      return;
    }
    el.className = `${base} is-shown is-${type}`;
    el.innerHTML = `${ICONS[type] || ICONS.neutral}<span></span>`;
    el.querySelector('span').textContent = message;
  };

  // Schritt 1 hat sein eigenes Statusfeld, Schritt 3 das beim Absenden.
  const setStatus = (message, type = 'neutral') => paintStatus(statusEl, message, type);
  const setSubmitStatus = (message, type = 'neutral') =>
    paintStatus(submitStatus, message, type);

  /* ---------- Schrittanzeige ---------- */
  const paintStepTrack = (current) => {
    stepDots.forEach((dot) => {
      const step = Number(dot.dataset.step);
      dot.classList.toggle('is-active', step === current);
      dot.classList.toggle('is-done', step < current);
    });
    stepLines.forEach((line, index) => {
      line.classList.toggle('is-done', index < current - 1);
    });
    if (stepCounter) stepCounter.textContent = String(current);
  };

  /* ---------- Panel-Navigation ---------- */
  const showStep = (step, { focus = true, push = true } = {}) => {
    currentStep = step;

    panels.forEach((panel) => {
      const isCurrent = Number(panel.dataset.panel) === step;
      panel.hidden = !isCurrent;
      panel.classList.toggle('is-current', isCurrent);
    });

    paintStepTrack(step);

    // Browser-Zurück soll den Schritt zurückgehen, nicht die Seite verlassen.
    if (push && window.history) {
      const state = { fulyaStep: step };
      if (window.history.state && window.history.state.fulyaStep) {
        window.history.pushState(state, '');
      } else {
        window.history.replaceState(state, '');
      }
    }

    const panel = panels.find((p) => Number(p.dataset.panel) === step);
    if (!panel) return;

    // Kopf des Formulars zeigen, damit die Schrittanzeige sichtbar ist
    scrollTo(form);

    if (focus) {
      const firstField = panel.querySelector('input:not([type="hidden"]), textarea, select');
      if (firstField) {
        // Nach dem Scrollen fokussieren, sonst springt die Seite doppelt
        window.setTimeout(() => firstField.focus({ preventScroll: true }), 220);
      }
    }
  };

  window.addEventListener('popstate', (event) => {
    const step = event.state && event.state.fulyaStep;
    if (step && step <= LAST_INPUT_STEP && currentStep <= LAST_INPUT_STEP) {
      showStep(step, { focus: false, push: false });
    }
  });

  /* ---------- Alter ---------- */
  const getAge = (value) => {
    if (!value) return null;
    const birth = new Date(value);
    if (Number.isNaN(birth.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age -= 1;
    return age;
  };

  const formatDate = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')}`;

  if (birthDateInput) {
    const today = new Date();

    const minDate = new Date(today);
    minDate.setFullYear(today.getFullYear() - (MAX_AGE + 1));
    minDate.setDate(minDate.getDate() + 1);

    const maxDate = new Date(today);
    maxDate.setFullYear(today.getFullYear() - MIN_AGE);

    birthDateInput.min = formatDate(minDate);
    birthDateInput.max = formatDate(maxDate);
  }

  /* ---------- Feldvalidierung (am Blur) ---------- */
  const fieldMessage = (input) => {
    if (input.type === 'checkbox') {
      return input.checked ? '' : 'Devam etmek için bu izin gerekli.';
    }

    const value = input.value.trim();
    if (input.required && !value) return 'Bu alan zorunlu.';
    if (!value) return '';

    if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      return 'Geçerli bir e-posta adresi girin. Örnek: isim@email.com';
    }
    if (input.type === 'tel' && value.replace(/\D/g, '').length < 7) {
      return 'Telefon numarasını eksiksiz girin.';
    }
    if (input.name === 'adres_plz' && !/^\d{5}$/.test(value.replace(/\s/g, ''))) {
      return 'Posta kodu 5 haneli olmalı. Örnek: 42859';
    }
    return '';
  };

  const showFieldError = (input, message) => {
    const wrapper = input.closest('.field');
    if (!wrapper) return;
    const errorEl = wrapper.querySelector('.field-error');
    wrapper.classList.toggle('has-error', Boolean(message));
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (errorEl) errorEl.textContent = message;
  };

  const validateField = (input) => {
    const message = fieldMessage(input);
    showFieldError(input, message);
    return !message;
  };

  extraInputs.forEach((input) => {
    input.addEventListener('blur', () => {
      if (!input.disabled) validateField(input);
    });
    // Fehler verschwindet, sobald korrigiert wird
    input.addEventListener('input', () => {
      if (input.closest('.field')?.classList.contains('has-error')) validateField(input);
    });
    if (input.type === 'checkbox') {
      input.addEventListener('change', () => validateField(input));
    }
  });

  /* ---------- Alters-Gate (Schritt 1) ---------- */
  const step1NextButton = panels
    .find((p) => Number(p.dataset.panel) === 1)
    ?.querySelector('[data-next]');

  const updateAgeGate = ({ silent = false } = {}) => {
    const value = birthDateInput ? birthDateInput.value : '';
    const age = getAge(value);
    const eligible = Boolean(value) && age !== null && age >= MIN_AGE && age <= MAX_AGE;

    if (step1NextButton) step1NextButton.disabled = !eligible;

    if (silent && !value) {
      setStatus('');
      return eligible;
    }

    if (!value) {
      setStatus('Devam etmek için çocuğunuzun doğum tarihini seçin.', 'neutral');
    } else if (age === null) {
      setStatus('Bu tarih okunamadı. Lütfen tekrar seçin.', 'error');
    } else if (!eligible) {
      const direction = age < MIN_AGE ? 'küçük' : 'büyük';
      setStatus(
        `Çocuğunuz bu program için ${direction} (${age} yaş). Kayıt 6–8 yaş arası ve okula başlamış çocuklar içindir.`,
        'error'
      );
    } else {
      setStatus(`Yaş uygun (${age} yaş). Devam edebilirsiniz.`, 'success');
    }

    return eligible;
  };

  if (birthDateInput) {
    birthDateInput.addEventListener('change', () => updateAgeGate());
    birthDateInput.addEventListener('input', () => updateAgeGate());
  }
  updateAgeGate({ silent: true });

  /* ---------- Validierung eines ganzen Schritts ---------- */
  const validateStep = (step) => {
    const panel = panels.find((p) => Number(p.dataset.panel) === step);
    if (!panel) return true;

    const fields = Array.from(panel.querySelectorAll('input, textarea, select')).filter(
      (input) => input.type !== 'hidden'
    );
    const invalid = fields.filter((input) => !validateField(input));

    if (invalid.length) {
      invalid[0].focus();
      invalid[0].scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'center'
      });
      return false;
    }
    return true;
  };

  /* ---------- Zusammenfassung vor dem Absenden ---------- */
  const SUMMARY_ROWS = [
    { label: 'Çocuk', build: (get) => `${get('ad')} ${get('soyad')}`.trim() },
    { label: 'Cinsiyet', build: (get) => get('cinsiyet') },
    { label: 'Doğum tarihi', build: (get) => formatDisplayDate(get('dogum_tarihi')) },
    { label: 'Sınıf', build: (get) => get('sinif') },
    { label: 'Anne', build: (get) => get('anne_adi') },
    { label: 'Baba', build: (get) => get('baba_adi') },
    {
      label: 'Adres',
      build: (get) =>
        [get('adres_strasse'), [get('adres_plz'), get('adres_stadt')].filter(Boolean).join(' ')]
          .filter(Boolean)
          .join(', ')
    },
    { label: 'E-posta', build: (get) => get('email') },
    { label: 'Telefon', build: (get) => get('telefon') },
    { label: 'Alerji', build: (get) => get('alerji') }
  ];

  function formatDisplayDate(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  const buildSummary = () => {
    if (!summaryList) return;
    const get = (name) => {
      const field = form.querySelector(`[name="${name}"]`);
      return field ? field.value.trim() : '';
    };

    summaryList.innerHTML = '';
    SUMMARY_ROWS.forEach((row) => {
      const value = row.build(get);
      if (!value) return;

      const dt = document.createElement('dt');
      dt.textContent = row.label;
      const dd = document.createElement('dd');
      dd.textContent = value;

      summaryList.append(dt, dd);
    });
  };

  /* ---------- Weiter / Zurück ---------- */
  nextButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (currentStep === 1) {
        if (!updateAgeGate()) {
          birthDateInput?.focus();
          return;
        }
      } else if (!validateStep(currentStep)) {
        return;
      }

      const target = Math.min(currentStep + 1, LAST_INPUT_STEP);
      if (target === LAST_INPUT_STEP) buildSummary();
      showStep(target);
    });
  });

  prevButtons.forEach((button) => {
    button.addEventListener('click', () => {
      showStep(Math.max(currentStep - 1, 1));
    });
  });

  // Enter soll im Formular weiterspringen statt vorzeitig abzusenden.
  form.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    const target = event.target;
    if (target.tagName === 'TEXTAREA' || target.type === 'submit') return;
    if (currentStep < LAST_INPUT_STEP) {
      event.preventDefault();
      const panel = panels.find((p) => Number(p.dataset.panel) === currentStep);
      panel?.querySelector('[data-next]')?.click();
    }
  });

  /* ---------- Absenden ---------- */
  const submitButtonEl = form.querySelector('button[type="submit"]');

  const setLoading = (loading) => {
    if (!submitButtonEl) return;
    submitButtonEl.disabled = loading;
    submitButtonEl.innerHTML = loading
      ? '<span class="spinner" aria-hidden="true"></span> Gönderiliyor…'
      : 'Başvuruyu gönder';
  };

  const showTransferStep = () => {
    // Schritt 4 ist ein Ergebnis, kein Eingabeschritt: Zurück wäre sinnlos.
    panels.forEach((panel) => {
      const isTransfer = Number(panel.dataset.panel) === 4;
      panel.hidden = !isTransfer;
      panel.classList.toggle('is-current', isTransfer);
    });
    currentStep = 4;
    paintStepTrack(4);
    scrollTo(form);
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!updateAgeGate()) {
      showStep(1);
      return;
    }
    for (let step = 2; step <= LAST_INPUT_STEP; step += 1) {
      if (!validateStep(step)) {
        if (currentStep !== step) showStep(step);
        setSubmitStatus('Lütfen eksik alanları tamamlayın.', 'error');
        return;
      }
    }

    // Adresse zu einem Feld zusammenfassen (Server erwartet "adres")
    const street = form.querySelector('input[name="adres_strasse"]')?.value.trim() || '';
    const plz = form.querySelector('input[name="adres_plz"]')?.value.trim() || '';
    const city = form.querySelector('input[name="adres_stadt"]')?.value.trim() || '';

    let addressField = form.querySelector('input[name="adres"]');
    if (!addressField) {
      addressField = document.createElement('input');
      addressField.type = 'hidden';
      addressField.name = 'adres';
      form.appendChild(addressField);
    }
    addressField.value = [street, [plz, city].filter(Boolean).join(' ')]
      .filter(Boolean)
      .join(', ');

    setLoading(true);
    setSubmitStatus('Başvurunuz gönderiliyor…', 'neutral');

    try {
      const response = await fetch(registrationApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form))
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        setSubmitStatus(result.error || 'Başvuru kaydedilemedi. Lütfen tekrar deneyin.', 'error');
        setLoading(false);
        return;
      }

      setSubmitStatus('');
      showTransferStep();
    } catch (error) {
      setSubmitStatus(
        'Bağlantı kurulamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.',
        'error'
      );
      setLoading(false);
    }
  });

  /* ---------- Start ---------- */
  showStep(1, { focus: false });

  /* ---------- IBAN kopieren ---------- */
  const copyButton = form.querySelector('.copy-iban');
  if (copyButton) {
    copyButton.addEventListener('click', async () => {
      const iban = copyButton.dataset.iban || '';
      const original = copyButton.innerHTML;

      try {
        await navigator.clipboard.writeText(iban);
        copyButton.textContent = 'Kopyalandı';
      } catch (error) {
        copyButton.textContent = 'Kopyalanamadı';
      }

      setTimeout(() => {
        copyButton.innerHTML = original;
      }, 1800);
    });
  }
})();
