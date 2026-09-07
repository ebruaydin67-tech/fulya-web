require('dotenv').config();

const path = require('path');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const Datastore = require('nedb-promises');
const mailer = require('./mailer');
const templates = require('./mail-templates');
const QRCode = require('qrcode');

const app = express();
const port = Number(process.env.PORT) || 3000;
const GROUP_CAPACITY = 20;

// Bankdaten und Kontakt kommen aus mail-templates.js (eine Quelle).
const { BANK, CONTACT } = templates;

const dataDirectory = path.join(__dirname, 'data');
fs.mkdirSync(dataDirectory, { recursive: true });

const database = Datastore.create({ filename: path.join(dataDirectory, 'registrations.db'), autoload: true });

// Hinter dem Reverse Proxy: X-Forwarded-Proto auswerten, sonst hält Express
// die Verbindung für HTTP und sendet das secure-Cookie nicht -> Login scheitert.
app.set('trust proxy', 1);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', (request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (request.method === 'OPTIONS') return response.sendStatus(204);
  return next();
});
app.use(session({
  secret: process.env.SESSION_SECRET || 'change-this-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 8 * 60 * 60 * 1000 }
}));
app.get('/api/transfer-qr', async (request, response) => {
  try {
    const qrData = [
      'Überweisung',
      'Empfänger: HumanSufi Culture & Arts e.V.',
      'IBAN: DE14340500000012105466',
      'Verwendungszweck: Name und Nachname des Kindes'
    ].join('\n');
    const qrDataUrl = await QRCode.toDataURL(qrData, { width: 220, margin: 2, color: { dark: '#1e3a4d', light: '#ffffff' } });
    response.type('png').send(Buffer.from(qrDataUrl.split(',')[1], 'base64'));
  } catch (error) {
    response.status(500).send('QR-Code konnte nicht erstellt werden.');
  }
});
app.use(express.static(__dirname, { index: 'index.html' }));

const requireAdmin = (request, response, next) => {
  if (request.session.isAdmin) return next();
  return response.status(401).json({ error: 'Yetkisiz erişim.' });
};

const getAgeFromBirthDate = (value) => {
  const birthDate = new Date(`${value}T00:00:00`);
  if (!value || Number.isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  const dayDifference = today.getDate() - birthDate.getDate();
  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) age -= 1;
  return age;
};

/* ---------- Mailversand ---------- */

// Ein Fehlschlag beim Mailversand darf die Anmeldung nie scheitern lassen.
const sendSafely = async (label, payload, to, extra = {}) => {
  try {
    const result = await mailer.sendMail({ to, ...payload, ...extra });
    if (!result.sent && result.reason === 'not-configured') {
      console.warn(`[mail] ${label} nicht gesendet: Azure-Zugangsdaten fehlen.`);
    }
    return result.sent;
  } catch (error) {
    console.error(`[mail] ${label} fehlgeschlagen:`, error.message);
    return false;
  }
};

const sendConfirmation = (registration) =>
  sendSafely('Bestätigung', templates.confirmation(registration), registration.email, {
    replyTo: process.env.MAIL_REPLY_TO || CONTACT.email
  });

const sendInternalNotice = (registration) => {
  const to = process.env.MAIL_NOTIFY_TO;
  if (!to) return Promise.resolve(false);
  return sendSafely('Interne Meldung', templates.internalNotice(registration), to, {
    replyTo: registration.email
  });
};

const sendStatusNotification = (registration, status) =>
  sendSafely('Statusmeldung', templates.statusUpdate(registration, status), registration.email, {
    replyTo: process.env.MAIL_REPLY_TO || CONTACT.email
  });

app.post('/api/registrations', async (request, response) => {
  const body = request.body;
  const requiredFields = ['ad', 'soyad', 'dogum_tarihi', 'sinif', 'anne_adi', 'adres_strasse', 'adres_plz', 'adres_stadt', 'email', 'telefon', 'alerji'];
  if (requiredFields.some((field) => !String(body[field] || '').trim()) || !body.datenschutz || !body.whatsapp_izni) {
    return response.status(400).json({ error: 'Lütfen tüm zorunlu alanları doldurun.' });
  }

  try {
    const age = getAgeFromBirthDate(String(body.dogum_tarihi).trim());
    const group = age === 6 ? 'Grup 1' : age === 7 || age === 8 ? 'Grup 2' : null;
    if (!group) {
      return response.status(400).json({ error: 'Bu başvuru yalnızca 6–8 yaş aralığındaki çocuklar için uygundur.' });
    }

    const groupCount = await database.count({ group });
    if (groupCount >= GROUP_CAPACITY) {
      return response.status(409).json({ error: `${group} kapasitesi dolu. Bu grup için artık başvuru kabul edilemiyor.` });
    }

    const registration = await database.insert({
      created_at: new Date().toISOString(),
      program: String(body.program || 'Çocuk Kulübü').trim(),
      first_name: String(body.ad).trim(),
      last_name: String(body.soyad).trim(),
      birth_date: String(body.dogum_tarihi).trim(),
      age,
      group,
      class_level: String(body.sinif).trim(),
      mother_name: String(body.anne_adi).trim(),
      father_name: String(body.baba_adi || '').trim(),
      address: [body.adres_strasse, body.adres_plz, body.adres_stadt].map((part) => String(part || '').trim()).join(', '),
      email: String(body.email).trim(),
      phone: String(body.telefon).trim(),
      allergies: String(body.alerji).trim(),
      whatsapp_consent: Boolean(body.whatsapp_izni),
      privacy_consent: Boolean(body.datenschutz),
      status: 'Neu'
    });
    // Antwort nicht auf den Mailversand warten lassen: Graph kann Sekunden brauchen.
    const mailPromise = Promise.allSettled([
      sendConfirmation(registration),
      sendInternalNotice(registration)
    ]);

    const [confirmationResult] = await mailPromise;
    const confirmationSent = confirmationResult.status === 'fulfilled' && confirmationResult.value;

    return response.status(201).json({
      success: true,
      id: registration._id,
      group,
      confirmationSent
    });
  } catch (error) {
    return response.status(500).json({ error: 'Başvuru kaydedilemedi.' });
  }
});

app.post('/admin/login', async (request, response) => {
  const password = String(request.body.password || '');
  const configuredPassword = process.env.ADMIN_PASSWORD || '';
  if (!configuredPassword || !(await bcrypt.compare(password, await bcrypt.hash(configuredPassword, 10)))) {
    return response.status(401).json({ error: 'Şifre hatalı.' });
  }
  request.session.isAdmin = true;
  return response.json({ success: true });
});

app.post('/admin/logout', (request, response) => {
  request.session.destroy(() => response.json({ success: true }));
});

app.get('/api/admin/registrations', requireAdmin, async (request, response) => {
  const registrations = await database.find({}).sort({ created_at: -1 });
  return response.json(registrations);
});

app.patch('/api/admin/registrations/:id/status', requireAdmin, async (request, response) => {
  const allowedStatuses = ['Neu', 'Kontaktiert', 'Bezahlt', 'Abgeschlossen'];
  const status = String(request.body.status || '');
  if (!allowedStatuses.includes(status)) return response.status(400).json({ error: 'Ungültiger Status.' });
  const registration = await database.findOne({ _id: request.params.id });
  if (!registration) return response.status(404).json({ error: 'Anmeldung nicht gefunden.' });

  await database.update({ _id: request.params.id }, { $set: { status } });
  let emailSent = false;
  if (registration.status !== status && ['Kontaktiert', 'Bezahlt'].includes(status)) {
    try {
      emailSent = await sendStatusNotification(registration, status);
    } catch (error) {
      console.error('Status-E-Mail konnte nicht gesendet werden:', error.message);
    }
  }

  return response.json({ success: true, emailSent, emailConfigured: mailer.isConfigured() });
});

app.get('/admin', (request, response) => response.sendFile(path.join(__dirname, 'admin.html')));

app.listen(port, async () => {
  console.log(`Fulya server running at http://localhost:${port}`);

  const mail = await mailer.verify();
  if (mail.ok) {
    console.log(`[mail] Microsoft Graph bereit — Absender: ${mail.sender}`);
  } else if (mail.reason === 'not-configured') {
    console.warn('[mail] Deaktiviert: AZURE_* Variablen fehlen in der .env.');
  } else {
    console.error(`[mail] Nicht verfügbar: ${mail.reason}`);
  }
});
