/* ============================================================
   FULYA AKADEMİ — Mailversand über Microsoft Graph
   Shared Mailbox (fulya@human-culture.com) mit OAuth2
   Client-Credentials. Kein SMTP: Microsoft hat die
   Basisauthentifizierung für Exchange Online abgeschaltet.
   ============================================================ */

const fs = require('fs');
const path = require('path');

const GRAPH_SCOPE = 'https://graph.microsoft.com/.default';

/* ---------- Eingebettetes Logo ----------
   Als CID-Anhang, nicht als data:-URI: Gmail blockiert data:-Bilder
   in E-Mails vollstaendig, CID-Anhaenge zeigt es an. */
const LOGO_CID = 'fulya-logo';
const LOGO_PATH = path.join(__dirname, 'assets-mail', 'fulya-logo-mail.png');

let logoBase64 = null;
try {
  logoBase64 = fs.readFileSync(LOGO_PATH).toString('base64');
} catch (error) {
  console.warn('[mail] Logo nicht gefunden, E-Mails werden ohne Logo versendet:', LOGO_PATH);
}

const logoAttachment = () =>
  logoBase64
    ? [{
        '@odata.type': '#microsoft.graph.fileAttachment',
        name: 'fulya-logo.png',
        contentType: 'image/png',
        contentBytes: logoBase64,
        contentId: LOGO_CID,
        isInline: true
      }]
    : [];

const config = {
  tenantId: process.env.AZURE_TENANT_ID,
  clientId: process.env.AZURE_CLIENT_ID,
  clientSecret: process.env.AZURE_CLIENT_SECRET,
  sender: process.env.AZURE_SENDER_EMAIL
};

const isConfigured = () =>
  Boolean(config.tenantId && config.clientId && config.clientSecret && config.sender);

/* ---------- Token holen und zwischenspeichern ---------- */
let cachedToken = null;
let tokenExpiresAt = 0;

const getAccessToken = async () => {
  // 60 Sekunden Sicherheitsabstand, damit kein Token mitten im Versand abläuft.
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) return cachedToken;

  const url = `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`;
  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    scope: GRAPH_SCOPE,
    grant_type: 'client_credentials'
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Token konnte nicht abgerufen werden (${response.status}): ${detail.slice(0, 300)}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + Number(data.expires_in || 3600) * 1000;
  return cachedToken;
};

/* ---------- Mail senden ---------- */
const sendMail = async ({ to, subject, text, html, replyTo, bcc }) => {
  if (!isConfigured()) return { sent: false, reason: 'not-configured' };
  if (!to) return { sent: false, reason: 'no-recipient' };

  const token = await getAccessToken();
  const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(config.sender)}/sendMail`;

  const message = {
    subject,
    body: { contentType: html ? 'HTML' : 'Text', content: html || text },
    toRecipients: [{ emailAddress: { address: to } }]
  };

  // Inline-Logo nur bei HTML-Mails.
  if (html) {
    const attachments = logoAttachment();
    if (attachments.length) message.attachments = attachments;
  }

  if (bcc) {
    message.bccRecipients = String(bcc)
      .split(',')
      .map((address) => address.trim())
      .filter(Boolean)
      .map((address) => ({ emailAddress: { address } }));
  }
  if (replyTo) {
    message.replyTo = [{ emailAddress: { address: replyTo } }];
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message, saveToSentItems: true })
  });

  // 202 Accepted = angenommen, kein Antwortkörper.
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Graph sendMail fehlgeschlagen (${response.status}): ${detail.slice(0, 300)}`);
  }

  return { sent: true };
};

/* ---------- Verbindung prüfen (nur Token, kein Versand) ---------- */
const verify = async () => {
  if (!isConfigured()) return { ok: false, reason: 'not-configured' };
  try {
    await getAccessToken();
    return { ok: true, sender: config.sender };
  } catch (error) {
    return { ok: false, reason: error.message };
  }
};

module.exports = { sendMail, verify, isConfigured, sender: () => config.sender, LOGO_CID, hasLogo: () => Boolean(logoBase64) };
