/* ============================================================
   FULYA — Yönetim paneli
   Tabellenzellen werden per textContent gesetzt, nie per
   innerHTML: Anmeldedaten sind Fremdeingaben und dürfen
   kein Markup ausführen.
   ============================================================ */

(() => {
  'use strict';

  const GROUPS = ['Grup 1', 'Grup 2'];
  const CAPACITY = 20;
  const STATUSES = ['Neu', 'Kontaktiert', 'Bezahlt', 'Abgeschlossen'];

  const login = document.querySelector('#login');
  const dashboard = document.querySelector('#dashboard');
  const loginError = document.querySelector('#login-error');
  const notice = document.querySelector('#admin-notice');

  const tableBodies = {
    'Grup 1': document.querySelector('#group-1-registrations'),
    'Grup 2': document.querySelector('#group-2-registrations')
  };
  const emptyNotes = {
    'Grup 1': document.querySelector('#group-1-empty'),
    'Grup 2': document.querySelector('#group-2-empty')
  };
  const capacityCards = {
    'Grup 1': document.querySelector('#group-1-capacity'),
    'Grup 2': document.querySelector('#group-2-capacity')
  };

  /* ---------- Meldungen ---------- */
  let noticeTimer;
  const flash = (message, ok = true) => {
    if (!notice) return;
    notice.textContent = message;
    notice.className = `notice shown ${ok ? 'ok' : 'bad'}`;
    window.clearTimeout(noticeTimer);
    if (ok) {
      noticeTimer = window.setTimeout(() => {
        notice.className = 'notice';
        notice.textContent = '';
      }, 4000);
    }
  };

  /* ---------- Formatierung ---------- */
  const formatDateTime = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('tr-TR');
  };

  const formatDate = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('tr-TR');
  };

  // Der Server speichert die Adresse als "Straße, PLZ, Stadt".
  const splitAddress = (address) => {
    const parts = String(address || '').split(',').map((p) => p.trim()).filter(Boolean);
    if (parts.length >= 3) {
      return { street: parts[0], postalCode: parts[1], city: parts.slice(2).join(', ') };
    }
    const street = parts[0] || '';
    const rest = parts.slice(1).join(', ').trim();
    const match = rest.match(/^(\d{4,5})\s+(.*)$/);
    return match
      ? { street, postalCode: match[1], city: match[2] }
      : { street, postalCode: '', city: rest };
  };

  /* ---------- Zeilen bauen (ohne innerHTML) ---------- */
  const cell = (text) => {
    const td = document.createElement('td');
    td.textContent = text || '—';
    return td;
  };

  const linkCell = (text, href) => {
    const td = document.createElement('td');
    if (!text) {
      td.textContent = '—';
      return td;
    }
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    td.append(link);
    return td;
  };

  const statusCell = (item) => {
    const td = document.createElement('td');
    const select = document.createElement('select');
    select.className = 'status';
    select.dataset.id = item._id;
    select.dataset.value = item.status;
    select.setAttribute('aria-label', `${item.first_name} ${item.last_name} durumu`);

    STATUSES.forEach((status) => {
      const option = document.createElement('option');
      option.value = status;
      option.textContent = status;
      option.selected = status === item.status;
      select.append(option);
    });

    select.addEventListener('change', () => updateStatus(select, item));
    td.append(select);
    return td;
  };

  const buildRow = (item) => {
    const address = splitAddress(item.address);
    const row = document.createElement('tr');
    row.append(
      cell(formatDateTime(item.created_at)),
      cell(`${item.first_name || ''} ${item.last_name || ''}`.trim()),
      cell(formatDate(item.birth_date)),
      cell(item.class_level),
      cell(item.mother_name),
      cell(item.father_name),
      cell(address.street),
      cell(address.postalCode),
      cell(address.city),
      linkCell(item.email, `mailto:${item.email}`),
      linkCell(item.phone, `tel:${String(item.phone || '').replace(/\s/g, '')}`),
      cell(item.allergies),
      statusCell(item)
    );
    return row;
  };

  /* ---------- Status ändern ---------- */
  const updateStatus = async (select, item) => {
    const previous = select.dataset.value;
    select.disabled = true;

    try {
      const response = await fetch(`/api/admin/registrations/${select.dataset.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: select.value })
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        select.value = previous;
        flash(result.error || 'Durum kaydedilemedi.', false);
        return;
      }

      select.dataset.value = select.value;
      item.status = select.value;

      if (['Kontaktiert', 'Bezahlt'].includes(select.value) && !result.emailConfigured) {
        flash('Durum kaydedildi, ancak e-posta gönderilmedi: .env dosyasına Azure bilgilerini ekleyin.', false);
      } else if (result.emailSent) {
        flash('Durum kaydedildi ve bilgilendirme e-postası gönderildi.');
      } else {
        flash('Durum kaydedildi.');
      }
    } catch (error) {
      select.value = previous;
      flash('Bağlantı kurulamadı. Lütfen tekrar deneyin.', false);
    } finally {
      select.disabled = false;
    }
  };

  /* ---------- Laden ---------- */
  const loadRegistrations = async () => {
    try {
      const response = await fetch('/api/admin/registrations');

      if (response.status === 401) {
        login.classList.remove('hidden');
        dashboard.classList.add('hidden');
        return;
      }
      if (!response.ok) {
        flash('Başvurular yüklenemedi.', false);
        return;
      }

      const registrations = await response.json();

      GROUPS.forEach((group) => {
        const rows = registrations.filter((item) => item.group === group);
        const card = capacityCards[group];

        card.querySelector('strong').textContent = `${rows.length} / ${CAPACITY} çocuk`;
        card.classList.toggle('full', rows.length >= CAPACITY);

        emptyNotes[group].hidden = rows.length > 0;
        tableBodies[group].replaceChildren(...rows.map(buildRow));
      });

      login.classList.add('hidden');
      dashboard.classList.remove('hidden');
    } catch (error) {
      flash('Sunucuya ulaşılamadı.', false);
    }
  };

  /* ---------- Login ---------- */
  document.querySelector('#login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    loginError.textContent = '';

    const button = event.target.querySelector('button');
    button.disabled = true;

    try {
      const response = await fetch('/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: new FormData(event.target).get('password') })
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        loginError.textContent = result.error || 'Şifre hatalı.';
        return;
      }

      event.target.reset();
      await loadRegistrations();
    } catch (error) {
      loginError.textContent = 'Sunucuya ulaşılamadı.';
    } finally {
      button.disabled = false;
    }
  });

  document.querySelector('#logout').addEventListener('click', async () => {
    await fetch('/admin/logout', { method: 'POST' });
    login.classList.remove('hidden');
    dashboard.classList.add('hidden');
  });

  loadRegistrations();
})();
