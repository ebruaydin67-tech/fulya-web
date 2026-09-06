const yearEl = document.getElementById('year');
if (yearEl) {
  const currentYear = new Date().getFullYear();
  yearEl.textContent = currentYear;
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const scrollTrigger = document.querySelector('[data-scroll-target]');
if (scrollTrigger) {
  scrollTrigger.addEventListener('click', () => {
    const targetSelector = scrollTrigger.getAttribute('data-scroll-target');
    if (!targetSelector) return;

    const target = document.querySelector(targetSelector);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

const getAgeFromBirthDate = (value) => {
  if (!value) return null;

  const birthDate = new Date(value);
  if (Number.isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  const dayDifference = today.getDate() - birthDate.getDate();

  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age -= 1;
  }

  return age;
};

const MIN_ELIGIBLE_AGE = 6;
const MAX_ELIGIBLE_AGE = 8;

const formatDateForInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const applyBirthDateLimits = (input) => {
  if (!input) return;

  const today = new Date();
  const minDate = new Date(today);
  minDate.setFullYear(today.getFullYear() - (MAX_ELIGIBLE_AGE + 1));
  minDate.setDate(minDate.getDate() + 1);

  const maxDate = new Date(today);
  maxDate.setFullYear(today.getFullYear() - MIN_ELIGIBLE_AGE);

  input.min = formatDateForInput(minDate);
  input.max = formatDateForInput(maxDate);
};

const registrationApiUrl = window.location.protocol === 'file:'
  ? 'http://localhost:3000/api/registrations'
  : '/api/registrations';
const form = document.querySelector('.register-form');
if (form) {
  const birthDateInput = form.querySelector('input[name="dogum_tarihi"]');
  const statusEl = form.querySelector('.form-status');
  const birthDateStep = form.querySelector('.birth-date-step');
  const extraFields = form.querySelector('.registration-extra-fields');
  const extraFieldInputs = extraFields ? extraFields.querySelectorAll('input, textarea, select') : [];
  const submitButton = form.querySelector('button[type="submit"]');
  const transferStep = form.querySelector('.transfer-step');
  const transferQr = form.querySelector('#transfer-qr');

  if (transferQr && window.location.protocol === 'file:') {
    transferQr.src = 'http://localhost:3000/api/transfer-qr';
  }

  const setStatusMessage = (message, type = 'neutral', targetEl = statusEl) => {
    if (!targetEl) return;
    targetEl.textContent = message;
    targetEl.classList.remove('is-success', 'is-error');
    if (type === 'success') targetEl.classList.add('is-success');
    if (type === 'error') targetEl.classList.add('is-error');
  };

  const revealTransferStep = (message = 'Başvurunuz yapıldı. Şimdi 3. adımda IBAN bilgileriyle banka havalesine devam edebilirsiniz.') => {
    if (birthDateStep) birthDateStep.hidden = true;
    if (transferStep) transferStep.classList.remove('is-locked');
    if (statusEl) {
      setStatusMessage(message, 'success');
    }
    if (submitButton) submitButton.hidden = true;
  };

  const submitApplication = async () => {
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    setStatusMessage('Başvurunuz gönderiliyor...', 'success');

    try {
      const response = await fetch(registrationApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form))
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        setStatusMessage(result.error || 'Başvuru kaydedilemedi.', 'error');
        return false;
      }
      return true;
    } catch (error) {
      setStatusMessage('Bir hata oluştu. Lütfen tekrar deneyin.', 'error');
      return false;
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  };

  const updateAgeGate = () => {
    const birthDate = birthDateInput ? birthDateInput.value : '';
    const childAge = getAgeFromBirthDate(birthDate);
    const isEligible = !!birthDate && childAge !== null && childAge >= MIN_ELIGIBLE_AGE && childAge <= MAX_ELIGIBLE_AGE;

    if (birthDateInput) {
      birthDateInput.setCustomValidity(
        !birthDate
          ? 'Önce çocuğun doğum tarihini seçin.'
          : childAge === null
            ? 'Geçersiz doğum tarihi.'
            : !isEligible
              ? 'Kayıt için uygun yaş aralığı 6–8 yaş olmalıdır. Okula başlamış çocuklar kaydolabilir.'
              : ''
      );
    }

    if (extraFields) {
      extraFields.classList.toggle('is-locked', !isEligible);
      extraFields.setAttribute('aria-disabled', String(!isEligible));
    }

    extraFieldInputs.forEach((input) => {
      input.disabled = !isEligible;
    });

    if (submitButton) {
      submitButton.disabled = !isEligible;
    }

    if (!birthDate) {
      setStatusMessage('Önce çocuğun doğum tarihini girin.', 'error');
      return;
    }

    if (childAge === null) {
      setStatusMessage('Geçersiz doğum tarihi.', 'error');
      return;
    }

    if (!isEligible) {
      const ageInfo = childAge < MIN_ELIGIBLE_AGE ? 'küçük' : 'büyük';
      setStatusMessage(`Çocuğunuz maalesef ${ageInfo}. Kayıt için yaş aralığı 6–8 olmalıdır ve okula başlamış olması gerekir.`, 'error');
      return;
    }

    setStatusMessage('Yaş uygun. Formu tamamlayıp devam edebilirsiniz.', 'success');
  };

  if (birthDateInput) {
    applyBirthDateLimits(birthDateInput);
    birthDateInput.addEventListener('input', updateAgeGate);
    birthDateInput.addEventListener('change', updateAgeGate);
  }

  updateAgeGate();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const checkbox = form.querySelector('input[name="datenschutz"]');
    const whatsappCheckbox = form.querySelector('input[name="whatsapp_izni"]');
    const birthDate = birthDateInput ? birthDateInput.value : '';
    const childAge = getAgeFromBirthDate(birthDate);

    if (!birthDate || childAge === null) {
      setStatusMessage('Önce çocuğun doğum tarihini girin.', 'error');
      return;
    }

    if (childAge < MIN_ELIGIBLE_AGE || childAge > MAX_ELIGIBLE_AGE) {
      const ageInfo = childAge < MIN_ELIGIBLE_AGE ? 'küçük' : 'büyük';
      setStatusMessage(`Çocuğunuz maalesef ${ageInfo}. Kayıt için yaş aralığı 6–8 olmalıdır ve okula başlamış olması gerekir.`, 'error');
      return;
    }

    if (!checkbox || !checkbox.checked || !whatsappCheckbox || !whatsappCheckbox.checked) {
      setStatusMessage('Lütfen veri kullanımı ve WhatsApp izinlerini işaretleyin.', 'error');
      return;
    }

    const street = form.querySelector('input[name="adres_strasse"]');
    const postalCode = form.querySelector('input[name="adres_plz"]');
    const city = form.querySelector('input[name="adres_stadt"]');
    const address = [street?.value, postalCode?.value, city?.value].filter(Boolean).join(', ');
    let addressField = form.querySelector('input[name="adres"]');
    if (!addressField) {
      addressField = document.createElement('input');
      addressField.type = 'hidden';
      addressField.name = 'adres';
      form.appendChild(addressField);
    }
    addressField.value = address;

    const isSubmitted = await submitApplication();
    if (!isSubmitted) return;

    revealTransferStep();
  });
}
