/* ============================================================
   FULYA AKADEMİ — E-Mail-Vorlagen (Türkisch)
   Tabellenlayout + Inline-Styles: E-Mail-Clients unterstützen
   kaum modernes CSS, und Outlook ignoriert <style>-Blöcke.
   ============================================================ */

const BANK = {
  recipient: 'Human - Sufi Culture & Arts e.V.',
  iban: 'DE14 3405 0000 0012 1054 66',
  ibanPlain: 'DE14340500000012105466',
  amount: '60 € (3 Monate im Voraus)',
  // Numerisch fuer den GiroCode (EPC-QR): Format EUR60.00
  amountEur: '60.00'
};

const CONTACT = {
  name: 'Hûman — Sufi Culture & Arts e.V.',
  street: 'Ehringhausen 25',
  city: '42859 Remscheid',
  phone: '+49 176 23716945',
  email: process.env.AZURE_SENDER_EMAIL || 'fulya@human-culture.com'
};

/* ---------- Hilfen ---------- */

// Anmeldedaten sind Fremdeingaben und landen im HTML der Mail.
const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatTrDate = (value) => {
  const date = new Date(`${value}T00:00:00`);
  if (!value || Number.isNaN(date.getTime())) return String(value || '');
  return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
};

const childName = (r) => `${r.first_name || ''} ${r.last_name || ''}`.trim();

const localizeEmail = (mail, language, registration) => {
  if (language !== 'de') return mail;
  const child = childName(registration);
  const replacements = [
    [`${child} için Fulya Akademi Çocuk Kulübü başvurunuzu aldık. Teşekkür ederiz.`, `Wir haben Ihre Anmeldung für ${child} zum Fulya-Kinderclub erhalten. Vielen Dank.`],
    [`${child} için başvurunuzu aldık, teşekkür ederiz.`, `Wir haben die Anmeldung für ${child} erhalten. Vielen Dank.`],
    [`${child} için ödemenizi aldık. Kaydınız kesinleşmiştir. Ders tarihleri ve buluşma detayları için sizinle iletişimde kalacağız.`, `Wir haben Ihre Zahlung für ${child} erhalten und bestätigen hiermit die Anmeldung. Über Kurstermine und Treffpunkt informieren wir Sie.`],
    [`${child} için başvurunuzu inceledik ve en kısa sürede sizinle iletişime geçeceğiz.`, `Wir prüfen die Anmeldung für ${child} und melden uns so bald wie möglich bei Ihnen.`],
    [`${child} için başvurunuzu aldık, teşekkür ederiz. Aşağıda başvuru bilgileriniz ve son adım olan banka havalesi yer alıyor.`, `Wir haben die Anmeldung für ${child} erhalten. Vielen Dank. Unten finden Sie die Angaben und die Überweisungsinformationen.`],
    [`Cinsiyet: ${registration.gender || '—'}`, `Geschlecht: ${registration.gender === 'Kız' ? 'Mädchen' : registration.gender === 'Erkek' ? 'Junge' : '—'}`],
    [`Doğum tarihi: ${formatTrDate(registration.birth_date)} (${registration.age} yaş)`, `Geburtsdatum: ${new Date(`${registration.birth_date}T00:00:00`).toLocaleDateString('de-DE')} (${registration.age} Jahre)`],
    [`Grup: ${registration.group} · ${registration.age} yaş · ${registration.class_level}`, `Gruppe: ${registration.group === 'Grup 1' ? 'Gruppe 1' : 'Gruppe 2'} · ${registration.age} Jahre · ${registration.class_level}`],
    [`Grup: ${registration.group}`, `Gruppe: ${registration.group === 'Grup 1' ? 'Gruppe 1' : 'Gruppe 2'}`],
    [`Alerji: ${registration.allergies}`, `Allergien: ${registration.allergies === 'Yok' ? 'Keine' : registration.allergies}`],
    ['Havale bilgileri:', 'Überweisungsinformationen:'],
    ['Bu e-posta başvurunuz üzerine otomatik olarak gönderilmiştir.', 'Diese E-Mail wurde automatisch zu Ihrer Anmeldung versendet.'],
    ['Fulya Akademi · Çocuk Kulübü', 'Fulya Akademie · Kinderclub'],
    ['Human - Sufi Culture & Arts e.V.', 'Human - Sufi Culture & Arts e.V.'],
    ['Başvurunuz alındı', 'Anmeldung eingegangen'],
    ['Başvuru bilgileri', 'Angaben zur Anmeldung'],
    ['Son adım: banka havalesi', 'Letzter Schritt: Überweisung'],
    ['Havale açıklaması nasıl yazılmalı?', 'Was gehört in den Verwendungszweck?'],
    ['Açıklama bölümüne mutlaka Fulya Academy - çocuğunuzun adını ve soyadını yazın.', 'Bitte geben Sie als Verwendungszweck unbedingt Fulya Academy - Vor- und Nachname Ihres Kindes an.'],
    ['Böylece ödemenizi doğru başvuruyla eşleştirebiliriz.', 'So können wir Ihre Zahlung der richtigen Anmeldung zuordnen.'],
    ['Ödeme hesabımıza ulaştıktan sonra kaydınızı kesinleştirir ve size bilgi veririz.', 'Sobald Ihre Zahlung eingegangen ist, bestätigen wir die Anmeldung und informieren Sie.'],
    ['ÖNEMLİ: Havale açıklamasına mutlaka Fulya Academy - çocuğunuzun adını ve soyadını yazın.', 'WICHTIG: Bitte geben Sie als Verwendungszweck Fulya Academy - Vor- und Nachname Ihres Kindes an.'],
    ['Böylece ödemenizi doğru başvuruyla eşleştirebiliriz.', 'So können wir Ihre Zahlung der richtigen Anmeldung zuordnen.'],
    ['Merhaba,', 'Guten Tag,'],
    ['Yeni başvuru alındı.', 'Eine neue Anmeldung ist eingegangen.'],
    ['Yeni başvuru: ', 'Neue Anmeldung: '],
    [' başvurunuzu aldık. Teşekkür ederiz.', ' Ihre Anmeldung ist bei uns eingegangen. Vielen Dank.'],
    ['Başvurunuz alındı', 'Ihre Anmeldung ist eingegangen'],
    ['Başvurunuz değerlendiriliyor', 'Ihre Anmeldung wird geprüft'],
    ['Kaydınız kesinleşti', 'Ihre Anmeldung ist bestätigt'],
    ['Kayıt', 'Anmeldung'],
    ['— BAŞVURU BİLGİLERİ —', '— ANGABEN ZUR ANMELDUNG —'],
    ['— SON ADIM: BANKA HAVALESİ —', '— LETZTER SCHRITT: ÜBERWEISUNG —'],
    ['Başvurunuz değerlendiriliyor', 'Ihre Anmeldung wird bearbeitet'],
    ['Kaydınız kesinleşti', 'Ihre Anmeldung ist bestätigt'],
    ['Yeni başvuru', 'Neue Anmeldung'],
    ['Yeni başvuru alındı.', 'Eine neue Anmeldung ist eingegangen.'],
    ['Başvurunuz değerlendiriliyor', 'Ihre Anmeldung wird bearbeitet'],
    [`Sınıf: ${registration.class_level}`, `Klasse: ${registration.class_level}`],
    [`Anne: ${registration.mother_name}`, `Mutter: ${registration.mother_name}`],
    [`Baba: ${registration.father_name}`, `Vater: ${registration.father_name}`],
    [`Adres: ${registration.address}`, `Anschrift: ${registration.address}`],
    [`E-posta: ${registration.email}`, `E-Mail: ${registration.email}`],
    [`Telefon: ${registration.phone}`, `Telefon: ${registration.phone}`],
    [`Çocuk: ${child}`, `Kind: ${child}`],
    [`Grup: ${registration.group} · ${registration.age} yaş · ${registration.class_level}`, `Gruppe: ${registration.group === 'Grup 1' ? 'Gruppe 1' : 'Gruppe 2'} · ${registration.age} Jahre · ${registration.class_level}`],
    [`Alıcı: ${BANK.recipient}`, `Empfänger: ${BANK.recipient}`],
    [`IBAN: ${BANK.iban}`, `IBAN: ${BANK.iban}`],
    [`Tutar: ${BANK.amount}`, `Betrag: ${BANK.amount}`],
    [`Açıklama: Fulya Academy - ${child}`, `Verwendungszweck: Fulya Academy - ${child}`],
    [`${CONTACT.street}, ${CONTACT.city}`, `${CONTACT.street}, ${CONTACT.city}`],
    [`Telefon: ${CONTACT.phone}`, `Telefon: ${CONTACT.phone}`],
    [`E-posta: ${CONTACT.email}`, `E-Mail: ${CONTACT.email}`]
  ];

  const replace = (value) => {
    let result = replacements.reduce((current, [from, to]) => current.split(from).join(to), value);
    const dateGerman = registration.birth_date
      ? new Date(`${registration.birth_date}T00:00:00`).toLocaleDateString('de-DE')
      : '';
    const genderGerman = registration.gender === 'Kız' ? 'Mädchen' : registration.gender === 'Erkek' ? 'Junge' : '—';
    const labels = {
      'Çocuk': 'Kind', 'Cinsiyet': 'Geschlecht', 'Doğum tarihi': 'Geburtsdatum',
      'Grup': 'Gruppe', 'Sınıf': 'Klasse', 'Anne': 'Mutter', 'Baba': 'Vater',
      'Adres': 'Anschrift', 'E-posta': 'E-Mail', 'Telefon': 'Telefon',
      'Alerji': 'Allergien', 'Alıcı': 'Empfänger', 'Tutar': 'Betrag', 'Açıklama': 'Verwendungszweck'
    };
    if (value === mail.html) {
      Object.entries(labels).forEach(([from, to]) => {
        result = result.replace(new RegExp(`(>\\s*)${from}(\\s*</td>)`, 'g'), `$1${to}$2`);
      });
      if (registration.gender) result = result.replace(`>${registration.gender}</td>`, `>${genderGerman}</td>`);
      if (dateGerman) result = result.replaceAll(formatTrDate(registration.birth_date), dateGerman);
      result = result.replace(/<html lang="tr">/, '<html lang="de">');
    } else {
      result = result.split('\n').map((line) => {
        const separator = line.indexOf(':');
        if (separator < 0) return line;
        const label = line.slice(0, separator);
        return labels[label] ? `${labels[label]}${line.slice(separator)}` : line;
      }).join('\n');
      result = result.replace(/Doğum tarihi: ([^\n]+) \((\d+) yaş\)/g, (_, date, age) => `Geburtsdatum: ${new Date(`${registration.birth_date}T00:00:00`).toLocaleDateString('de-DE')} (${age} Jahre)`);
      result = result.replace(/Grup: Grup ([12])/g, 'Gruppe: Gruppe $1');
      result = result.replace(/Geschlecht: (?:Kız|Erkek|—)/g, `Geschlecht: ${genderGerman}`);
      if (dateGerman) result = result.replaceAll(formatTrDate(registration.birth_date), dateGerman);
    }
    return result;
  };
  return {
    subject: replace(mail.subject),
    text: replace(mail.text),
    html: replace(mail.html).replace('<html lang="tr">', '<html lang="de">')
  };
};

const row = (label, value) =>
  value
    ? `<tr>
         <td style="padding:9px 0;color:#278b9b;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.07em;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
         <td style="padding:9px 0 9px 18px;color:#1e3a4d;font-size:15px;vertical-align:top;">${escapeHtml(value)}</td>
       </tr>`
    : '';

const shell = (title, inner) => `<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#e4f3ef;font-family:'Manrope',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1e3a4d;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(180deg,#e4f3ef,#fff8e9);padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:rgba(255,255,255,.92);border:1px solid rgba(30,58,77,.13);border-radius:24px;overflow:hidden;box-shadow:0 20px 45px rgba(19,44,57,.1);">
        ${inner}
        <tr><td style="background:#1e3a4d;padding:22px 24px;">
          <p style="margin:0 0 8px;font-size:14px;font-weight:800;color:#e4f3ef;">${escapeHtml(CONTACT.name)}</p>
          <p style="margin:0;font-size:13px;color:rgba(228,243,239,.82);line-height:1.7;">
            ${escapeHtml(CONTACT.street)}, ${escapeHtml(CONTACT.city)}<br>
            Telefon: <a href="tel:${escapeHtml(CONTACT.phone.replace(/\s/g, ''))}" style="color:#ffd96f;text-decoration:none;">${escapeHtml(CONTACT.phone)}</a><br>
            E-posta: <a href="mailto:${escapeHtml(CONTACT.email)}" style="color:#ffd96f;text-decoration:none;">${escapeHtml(CONTACT.email)}</a>
          </p>
        </td></tr>
      </table>
      <p style="margin:16px 0 0;font-size:12px;color:#52656d;">Bu e-posta başvurunuz üzerine otomatik olarak gönderilmiştir.</p>
    </td></tr>
  </table>
</body>
</html>`;

// Das Logo kommt als CID-Anhang (siehe mailer.js). Ein alt-Text steht
// bereit, falls der Empfänger Bilder blockiert.
const LOGO_CID = 'fulya-logo';

const header = (heading, sub, background = '#fff1bd', color = '#1e3a4d') => `
  <tr><td style="background:${background};padding:24px;text-align:center;border-bottom:1px solid rgba(30,58,77,.13);">
    <img src="cid:${LOGO_CID}" alt="Fulya Akademi" width="104" height="148"
         style="display:block;margin:0 auto 14px;width:104px;height:auto;border:0;outline:none;text-decoration:none;border-radius:10px;">
    <h1 style="margin:0;font-family:'Manrope',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:25px;font-weight:800;color:${color};">${escapeHtml(heading)}</h1>
    <p style="margin:7px 0 0;font-size:15px;color:${color};opacity:.85;">${escapeHtml(sub)}</p>
  </td></tr>`;

/* ============================================================
   1. Bestätigung nach dem Absenden des Formulars
   ============================================================ */
const confirmation = (r) => {
  const child = childName(r);

  const text = [
    'Merhaba,',
    '',
    `${child} için Fulya Akademi Çocuk Kulübü başvurunuzu aldık. Teşekkür ederiz.`,
    '',
    '— BAŞVURU BİLGİLERİ —',
    `Çocuk: ${child}`,
    `Cinsiyet: ${r.gender || '—'}`,
    `Doğum tarihi: ${formatTrDate(r.birth_date)} (${r.age} yaş)`,
    `Grup: ${r.group}`,
    `Sınıf: ${r.class_level}`,
    `Anne: ${r.mother_name}`,
    r.father_name ? `Baba: ${r.father_name}` : null,
    `Adres: ${r.address}`,
    `E-posta: ${r.email}`,
    `Telefon: ${r.phone}`,
    `Alerji: ${r.allergies}`,
    '',
    '— SON ADIM: BANKA HAVALESİ —',
    `Alıcı: ${BANK.recipient}`,
    `IBAN: ${BANK.iban}`,
    `Tutar: ${BANK.amount}`,
    `Açıklama: Fulya Academy - ${child}`,
    '',
    'ÖNEMLİ: Havale açıklamasına mutlaka Fulya Academy - çocuğunuzun adını ve soyadını yazın.',
    'Böylece ödemenizi doğru başvuruyla eşleştirebiliriz.',
    '',
    'Ödeme hesabımıza ulaştıktan sonra kaydınızı kesinleştirir ve size bilgi veririz.',
    '',
    `${CONTACT.name}`,
    `${CONTACT.street}, ${CONTACT.city}`,
    `Telefon: ${CONTACT.phone}`,
    `E-posta: ${CONTACT.email}`
  ]
    .filter((line) => line !== null)
    .join('\n');

  const html = shell(
    'Başvurunuz alındı',
    header('Başvurunuz alındı', 'Fulya Akademi · Çocuk Kulübü') +
      `<tr><td style="padding:26px 24px;">
        <p style="margin:0 0 14px;font-size:16px;color:#1e3a4d;">Merhaba,</p>
        <p style="margin:0 0 22px;font-size:16px;color:#4a423a;line-height:1.65;">
          <strong style="color:#1e3a4d;">${escapeHtml(child)}</strong> için başvurunuzu aldık, teşekkür ederiz.
          Aşağıda başvuru bilgileriniz ve son adım olan banka havalesi yer alıyor.
        </p>

        <h2 style="margin:0 0 6px;font-family:'Manrope',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:18px;font-weight:800;color:#1e3a4d;">Başvuru bilgileri</h2>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:2px dashed rgba(20,18,16,.18);">
          ${row('Çocuk', child)}
          ${row('Cinsiyet', r.gender)}
          ${row('Doğum tarihi', `${formatTrDate(r.birth_date)} (${r.age} yaş)`)}
          ${row('Grup', r.group)}
          ${row('Sınıf', r.class_level)}
          ${row('Anne', r.mother_name)}
          ${row('Baba', r.father_name)}
          ${row('Adres', r.address)}
          ${row('E-posta', r.email)}
          ${row('Telefon', r.phone)}
          ${row('Alerji', r.allergies)}
        </table>

        <h2 style="margin:30px 0 10px;font-family:'Manrope',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:18px;font-weight:800;color:#1e3a4d;">Son adım: banka havalesi</h2>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,rgba(228,243,239,.62),rgba(255,241,189,.28));border:1px solid rgba(66,183,189,.2);border-radius:22px;">
          <tr><td style="padding:8px 18px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${row('Alıcı', BANK.recipient)}
              ${row('IBAN', BANK.iban)}
              ${row('Tutar', BANK.amount)}
              ${row('Açıklama', `Fulya Academy - ${child}`)}
            </table>
          </td></tr>
        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;background:rgba(255,217,111,.3);border:1px solid rgba(232,185,47,.45);border-radius:18px;">
          <tr><td style="padding:16px 18px;">
            <p style="margin:0 0 6px;font-size:15px;font-weight:800;color:#1e3a4d;">Havale açıklaması nasıl yazılmalı?</p>
            <p style="margin:0;font-size:14px;color:#4a423a;line-height:1.65;">
              Açıklama bölümüne mutlaka <strong>Fulya Academy - çocuğunuzun adını ve soyadını</strong> yazın.
              Böylece ödemenizi doğru başvuruyla eşleştirebiliriz.
            </p>
          </td></tr>
        </table>

        <p style="margin:22px 0 0;font-size:15px;color:#4a423a;line-height:1.65;">
          Ödeme hesabımıza ulaştıktan sonra kaydınızı kesinleştirir ve size bilgi veririz.
        </p>
      </td></tr>`
  );

  return localizeEmail({ subject: `Başvurunuz alındı — ${child}`, text, html }, r.language, r);
};

/* ============================================================
   2. Statusmeldungen (Kontaktiert / Bezahlt)
   ============================================================ */
const statusUpdate = (r, status) => {
  const child = childName(r);
  const isPaid = status === 'Bezahlt';

  const heading = isPaid ? 'Kaydınız kesinleşti' : 'Başvurunuz değerlendiriliyor';
  const message = isPaid
    ? `${child} için ödemenizi aldık. Kaydınız kesinleşmiştir. Ders tarihleri ve buluşma detayları için sizinle iletişimde kalacağız.`
    : `${child} için başvurunuzu inceledik ve en kısa sürede sizinle iletişime geçeceğiz.`;

  const text = [
    'Merhaba,',
    '',
    message,
    ...(!isPaid ? [`Cinsiyet: ${r.gender || '—'}`] : []),
    '',
    !isPaid ? `Havale bilgileri:\nAlıcı: ${BANK.recipient}\nIBAN: ${BANK.iban}\nAçıklama: Fulya Academy - ${child}\n` : null,
    `${CONTACT.name}`,
    `${CONTACT.street}, ${CONTACT.city}`,
    `Telefon: ${CONTACT.phone}`,
    `E-posta: ${CONTACT.email}`
  ]
    .filter((line) => line !== null)
    .join('\n');

  const html = shell(
    heading,
    header(
      heading,
      'Fulya Akademi · Çocuk Kulübü',
      isPaid ? '#bfe8e4' : '#fff8e9',
      '#1e3a4d'
    ) +
      `<tr><td style="padding:26px 24px;">
        <p style="margin:0 0 14px;font-size:16px;color:#1e3a4d;">Merhaba,</p>
        <p style="margin:0 0 18px;font-size:16px;color:#4a423a;line-height:1.65;">${escapeHtml(message)}</p>
        ${!isPaid ? `<p style="margin:0 0 18px;font-size:14px;color:#52656d;">Cinsiyet: <strong>${escapeHtml(r.gender || '—')}</strong></p>` : ''}
        ${
          isPaid
            ? ''
            : `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,rgba(228,243,239,.62),rgba(255,241,189,.28));border:1px solid rgba(66,183,189,.2);border-radius:22px;">
                 <tr><td style="padding:8px 18px;">
                   <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                     ${row('Alıcı', BANK.recipient)}
                     ${row('IBAN', BANK.iban)}
                     ${row('Açıklama', `Fulya Academy - ${child}`)}
                   </table>
                 </td></tr>
               </table>`
        }
      </td></tr>`
  );

  return localizeEmail({ subject: `${heading} — ${child}`, text, html }, r.language, r);
};

/* ============================================================
   3. Interne Benachrichtigung an den Verein
   ============================================================ */
const internalNotice = (r) => {
  const child = childName(r);

  const text = [
    'Yeni başvuru alındı.',
    '',
    `Çocuk: ${child}`,
    `Cinsiyet: ${r.gender || '—'}`,
    `Grup: ${r.group} · ${r.age} yaş · ${r.class_level}`,
    `Doğum tarihi: ${formatTrDate(r.birth_date)}`,
    `Anne: ${r.mother_name}`,
    r.father_name ? `Baba: ${r.father_name}` : null,
    `Adres: ${r.address}`,
    `E-posta: ${r.email}`,
    `Telefon: ${r.phone}`,
    `Alerji: ${r.allergies}`
  ]
    .filter((line) => line !== null)
    .join('\n');

  const html = shell(
    'Yeni başvuru',
    header('Yeni başvuru', `${r.group} · ${r.age} yaş`, '#42b7bd', '#ffffff') +
      `<tr><td style="padding:24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:2px dashed rgba(20,18,16,.18);">
          ${row('Çocuk', child)}
          ${row('Cinsiyet', r.gender)}
          ${row('Grup', r.group)}
          ${row('Doğum tarihi', `${formatTrDate(r.birth_date)} (${r.age} yaş)`)}
          ${row('Sınıf', r.class_level)}
          ${row('Anne', r.mother_name)}
          ${row('Baba', r.father_name)}
          ${row('Adres', r.address)}
          ${row('E-posta', r.email)}
          ${row('Telefon', r.phone)}
          ${row('Alerji', r.allergies)}
        </table>
      </td></tr>`
  );

  return localizeEmail({ subject: `Yeni başvuru: ${child} (${r.group})`, text, html }, r.language, r);
};

module.exports = { confirmation, statusUpdate, internalNotice, BANK, CONTACT };
