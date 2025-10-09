/****************************************************
 Selvi Home Stay — Google Apps Script Backend
****************************************************/
const BOOKINGS_SHEET_NAME = 'Bookings';
const CONFIG_SHEET_NAME = 'Config';
const ADMIN_PASSWORD = 'SELVI@2025'; // 🔒 Change this password

function _getSheet() {
  return SpreadsheetApp.getActive().getSheetByName(BOOKINGS_SHEET_NAME);
}

function _getConfig() {
  const cfg = {};
  const sheet = SpreadsheetApp.getActive().getSheetByName(CONFIG_SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  data.forEach(r => { if (r[0]) cfg[r[0]] = r[1]; });
  return cfg;
}

function generateBookingId() {
  const d = new Date();
  return 'SHS-' + Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss');
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (body.action === 'create_booking') return handlePublicBooking(body);
    if (body.action === 'admin_booking') return handleAdminBooking(body);
    return _json({ error: 'Invalid action' });
  } catch (err) {
    return _json({ error: err.message });
  }
}

function handlePublicBooking(data) {
  const sheet = _getSheet();
  const bookingId = generateBookingId();
  const cfg = _getConfig();
  const rate = parseFloat(cfg.RatePerNight || 3600);
  const from = new Date(data.FromDate);
  const to = new Date(data.ToDate);
  const nights = Math.max(1, (to - from) / (1000 * 3600 * 24));
  const total = nights * rate;

  sheet.appendRow([
    bookingId, 'Website',
    data.Name, data.Aadhaar, data.Mobile, data.Address,
    data.FromDate, data.ToDate,
    data.PaymentDate, data.PaymentRefNo, data.PaymentAmount,
    new Date()
  ]);

  return _json({ success: true, bookingId: bookingId, total: total });
}

function handleAdminBooking(data) {
  if (data.admin_password !== ADMIN_PASSWORD) return _json({ error: 'Unauthorized: Invalid password' });

  const sheet = _getSheet();
  const bookingId = generateBookingId();

  sheet.appendRow([
    bookingId, 'Admin',
    data.Name, data.Aadhaar, data.Mobile, data.Address,
    data.FromDate, data.ToDate,
    data.PaymentDate, data.PaymentRefNo, data.PaymentAmount,
    new Date()
  ]);

  return _json({ success: true, bookingId: bookingId });
}

function _json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
