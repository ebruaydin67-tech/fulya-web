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
  const testEmailInput = document.querySelector('#test-email');
  const testMailButton = document.querySelector('#send-test-mail');
  const locale = window.FulyaLocale;
  const t = (message) => locale ? locale.t(message) : message;

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
  const tableState = Object.fromEntries(GROUPS.map((group) => [group, { rows: [], search: '', status: '', sortKey: 'created_at', sortDirection: 'desc' }]));
  const tableLabels = ['Tarih', 'Çocuk', 'Cinsiyet', 'Doğum tarihi', 'Sınıf', 'Anne', 'Baba', 'Sokak', 'PLZ', 'Şehir', 'E-posta', 'Telefon', 'Alerji', 'Fotoğraf', 'Durum'];

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
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString(locale?.language === 'de' ? 'de-DE' : 'tr-TR');
  };

  const formatDate = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString(locale?.language === 'de' ? 'de-DE' : 'tr-TR');
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
      option.textContent = t(status);
      option.selected = status === item.status;
      select.append(option);
    });

    select.addEventListener('change', () => updateStatus(select, item));
    td.append(select);
    return td;
  };

  const deleteRegistration = async (item) => {
    const name = rowName(item) || (locale?.language === 'de' ? 'diese Anmeldung' : 'bu başvuru');
    const confirmText = locale?.language === 'de'
      ? `${name} wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`
      : `${name} kaydını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`;
    if (!window.confirm(confirmText)) return;
    try {
      const response = await fetch(`/api/admin/registrations/${item._id}`, { method: 'DELETE' });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        flash(t(result.error || 'Başvuru silinemedi. Lütfen sayfayı yenileyip tekrar deneyin.'), false);
        return;
      }
      const group = item.group;
      tableState[group].rows = tableState[group].rows.filter((row) => row._id !== item._id);
      const card = capacityCards[group];
      card.querySelector('strong').textContent = `${tableState[group].rows.length} / ${CAPACITY} ${t('çocuk')}`;
      card.classList.toggle('full', tableState[group].rows.length >= CAPACITY);
      renderGroup(group);
      flash(t('Başvuru silindi.'));
    } catch (error) {
      flash(t('Başvuru silinemedi. Lütfen sayfayı yenileyip tekrar deneyin.'), false);
    }
  };

  const deleteCell = (item) => {
    const td = document.createElement('td');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'delete-registration';
    button.textContent = t('Sil');
    button.addEventListener('click', () => deleteRegistration(item));
    td.append(button);
    return td;
  };

  const buildRow = (item) => {
    const address = splitAddress(item.address);
    const row = document.createElement('tr');
    row.append(
      cell(formatDateTime(item.created_at)),
      cell(`${item.first_name || ''} ${item.last_name || ''}`.trim()),
      cell(item.gender === 'Kız' || item.gender === 'Erkek' ? t(item.gender) : item.gender),
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
      cell(t(item.photo_consent ? 'Evet' : 'Hayır')),
      statusCell(item),
      deleteCell(item)
    );
    return row;
  };

  const rowName = (item) => `${item.first_name || ''} ${item.last_name || ''}`.trim();
  const displayValue = (value) => {
    if (value === 'Yok') return t('Yok');
    const classMatch = String(value || '').match(/^([1-4])\. Sınıf$/);
    if (classMatch) return t(`${classMatch[1]}. Sınıf`);
    return t(value);
  };

  const rowValues = (item) => {
    const address = splitAddress(item.address);
    return [
      formatDateTime(item.created_at), rowName(item), displayValue(item.gender), formatDate(item.birth_date), displayValue(item.class_level),
      item.mother_name, item.father_name, address.street, address.postalCode, address.city,
      item.email, item.phone, displayValue(item.allergies), t(item.photo_consent ? 'Evet' : 'Hayır'), t(item.status)
    ].map((value) => String(value || ''));
  };

  const sortValue = (item, key) => {
    if (key === 'name') return rowName(item).toLocaleLowerCase('tr-TR');
    if (key === 'created_at' || key === 'birth_date') return new Date(item[key] || 0).getTime() || 0;
    return String(item[key] || '').toLocaleLowerCase('tr-TR');
  };

  const visibleRows = (group) => {
    const state = tableState[group];
    const search = state.search.toLocaleLowerCase('tr-TR');
    return state.rows
      .filter((item) => !state.status || item.status === state.status)
      .filter((item) => !search || rowValues(item).some((value) => value.toLocaleLowerCase('tr-TR').includes(search)))
      .sort((left, right) => {
        const a = sortValue(left, state.sortKey);
        const b = sortValue(right, state.sortKey);
        const comparison = typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b), 'tr-TR');
        return state.sortDirection === 'asc' ? comparison : -comparison;
      });
  };

  const renderGroup = (group) => {
    const rows = visibleRows(group);
    tableBodies[group].replaceChildren(...rows.map(buildRow));
    emptyNotes[group].textContent = rows.length
      ? (locale?.language === 'de' ? `${rows.length} Anmeldungen werden angezeigt.` : `${rows.length} başvuru gösteriliyor.`)
      : t('Bu filtrelerle eşleşen başvuru bulunmuyor.');
    emptyNotes[group].hidden = rows.length > 0;
    document.querySelectorAll(`[data-sort-group="${group}"]`).forEach((button) => {
      const indicator = button.querySelector('.sort-indicator');
      if (indicator) indicator.textContent = button.dataset.sortKey === tableState[group].sortKey ? (tableState[group].sortDirection === 'asc' ? ' ↑' : ' ↓') : '';
    });
  };

  const csvEscape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

  const exportCsv = (group) => {
    const lines = [tableLabels.map((label) => csvEscape(t(label))).join(';'), ...visibleRows(group).map((item) => rowValues(item).map(csvEscape).join(';'))];
    const blob = new Blob([`\uFEFF${lines.join('\r\n')}`], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const groupFileName = group.toLocaleLowerCase('tr-TR').replace(/grup/g, 'gruppe').replace(/\s+/g, '-');
    link.download = `fulya-${groupFileName}-anmeldungen.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
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
        flash(t(result.error || 'Durum kaydedilemedi.'), false);
        return;
      }

      select.dataset.value = select.value;
      item.status = select.value;

      if (['Kontaktiert', 'Bezahlt'].includes(select.value) && !result.emailConfigured) {
        flash(t('Durum kaydedildi, ancak e-posta gönderilmedi: .env dosyasına Azure bilgilerini ekleyin.'), false);
      } else if (result.emailSent) {
        flash(t('Durum kaydedildi ve bilgilendirme e-postası gönderildi.'));
      } else {
        flash(t('Durum kaydedildi.'));
      }
    } catch (error) {
      select.value = previous;
      flash(t('Bağlantı kurulamadı. Lütfen tekrar deneyin.'), false);
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
        flash(t('Başvurular yüklenemedi.'), false);
        return;
      }

      const registrations = await response.json();

      GROUPS.forEach((group) => {
        const rows = registrations.filter((item) => item.group === group);
        tableState[group].rows = rows;
        const card = capacityCards[group];

        card.querySelector('strong').textContent = `${rows.length} / ${CAPACITY} ${t('çocuk')}`;
        card.classList.toggle('full', rows.length >= CAPACITY);

        renderGroup(group);
      });

      login.classList.add('hidden');
      dashboard.classList.remove('hidden');
    } catch (error) {
      flash(t('Sunucuya ulaşılamadı.'), false);
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
        loginError.textContent = t(result.error || 'Şifre hatalı.');
        return;
      }

      event.target.reset();
      await loadRegistrations();
    } catch (error) {
      loginError.textContent = t('Sunucuya ulaşılamadı.');
    } finally {
      button.disabled = false;
    }
  });

  document.querySelector('#logout').addEventListener('click', async () => {
    await fetch('/admin/logout', { method: 'POST' });
    login.classList.remove('hidden');
    dashboard.classList.add('hidden');
  });

  document.querySelectorAll('[data-sort-group]').forEach((button) => {
    button.addEventListener('click', () => {
      const state = tableState[button.dataset.sortGroup];
      if (state.sortKey === button.dataset.sortKey) state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
      else { state.sortKey = button.dataset.sortKey; state.sortDirection = 'asc'; }
      renderGroup(button.dataset.sortGroup);
    });
  });

  const localizeEmailLinks = () => {
    document.querySelectorAll('.mail-tools a[href*="email-preview"]').forEach((link) => {
      const url = new URL(link.href, window.location.origin);
      url.searchParams.set('language', locale ? locale.language : 'tr');
      link.href = url.toString();
    });
  };
  localizeEmailLinks();

  GROUPS.forEach((group) => {
    document.querySelector(`#${group === 'Grup 1' ? 'group-1' : 'group-2'}-search`).addEventListener('input', (event) => {
      tableState[group].search = event.target.value.trim();
      renderGroup(group);
    });
    document.querySelector(`#${group === 'Grup 1' ? 'group-1' : 'group-2'}-status-filter`).addEventListener('change', (event) => {
      tableState[group].status = event.target.value;
      renderGroup(group);
    });
  });

  document.querySelectorAll('[data-export-group]').forEach((button) => {
    button.addEventListener('click', () => exportCsv(button.dataset.exportGroup));
  });

  window.addEventListener('fulya:languagechange', () => {
    localizeEmailLinks();
    GROUPS.forEach((group) => {
      capacityCards[group].querySelector('strong').textContent = `${tableState[group].rows.length} / ${CAPACITY} ${t('çocuk')}`;
      renderGroup(group);
    });
    document.querySelectorAll('.status').forEach((select) => {
      const selected = select.value;
      select.querySelectorAll('option').forEach((option) => {
        option.textContent = t(option.value);
      });
      select.value = selected;
    });
  });

  testMailButton.addEventListener('click', async () => {
    const to = testEmailInput.value.trim();
    if (!to) {
      flash(t('Bitte zuerst eine Test-E-Mail-Adresse eingeben.'), false);
      return;
    }
    testMailButton.disabled = true;
    try {
      const response = await fetch('/api/admin/email-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, status: 'Kontaktiert', language: locale ? locale.language : 'tr' })
      });
      const result = await response.json().catch(() => ({}));
      flash(result.success ? t('Testmail wurde gesendet.') : t(result.error || 'Testmail konnte nicht gesendet werden.'), Boolean(result.success));
    } catch (error) {
      flash(t('Testmail konnte nicht gesendet werden.'), false);
    } finally {
      testMailButton.disabled = false;
    }
  });

  loadRegistrations();
})();
