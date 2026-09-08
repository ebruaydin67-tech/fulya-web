const SHEET_NAME = 'Anmeldungen';

function doPost(event) {
  const sheet = getSheet_();
  const data = event.parameter;

  sheet.appendRow([
    new Date(),
    data.program || 'Çocuk Kulübü',
    data.ad || '',
    data.soyad || '',
    data.cinsiyet || '',
    data.foto_izni ? 'Evet' : 'Hayır',
    data.dogum_tarihi || '',
    data.sinif || '',
    data.anne_adi || '',
    data.baba_adi || '',
    data.adres || '',
    data.email || '',
    data.telefon || '',
    data.alerji || '',
    data.whatsapp_izni ? 'Evet' : 'Hayır',
    data.datenschutz ? 'Evet' : 'Hayır'
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Zeitpunkt',
      'Programm',
      'Vorname',
      'Nachname',
      'Cinsiyet',
      'Fotoğraf-Einwilligung',
      'Geburtsdatum',
      'Klassenstufe',
      'Name Mutter',
      'Name Vater',
      'Adresse',
      'E-Mail',
      'Telefon',
      'Allergien',
      'WhatsApp-Einwilligung',
      'Datenschutz-Einwilligung'
    ]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}
