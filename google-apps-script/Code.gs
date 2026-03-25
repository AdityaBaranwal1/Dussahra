/* ============================================================
   Dussehra Festival — Booth Booking Google Apps Script Web App
   ============================================================
   Receives JSON POST requests from the React frontend.
   Routes on the `form_type` field in the request body.
   ============================================================ */

const SHEET_NAME = 'Dushahra Submissions';
const HEADERS = [
  'Timestamp', 'FormId', 'Status', 'BoothType', 'AdditionalChairs', 'AdditionalTables',
  'Total', 'ContactPerson', 'Title', 'Phone', 'BusinessName', 'PostalAddress', 'City',
  'Email', 'TaxId', 'VendorPermit', 'Date', 'Description', 'TermsAgreement',
  'ZelleSenderName', 'ZelleConfirmationCode', 'ZelleScreenshot', 'ZelleScreenshotDriveUrl', 'ZelleVerifiedAt'
];

// ── GET (health-check / deployment test) ────────────────────

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Dussehra Booth Booking API is running.' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── POST (main entry point) ─────────────────────────────────

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var formType = body.form_type;

    if (formType === 'booth_application') {
      return handleBoothApplication_(body);
    }

    if (formType === 'zelle_verification') {
      return handleZelleVerification_(body);
    }

    return jsonResponse_({ status: 'error', message: 'Unknown form_type: ' + formType });
  } catch (err) {
    return jsonResponse_({ status: 'error', message: err.toString() });
  }
}

// ── Phase 1: Booth Application ──────────────────────────────

function handleBoothApplication_(body) {
  var formId = body.formId || ('BOOTH-' + Date.now());
  var sheet  = getOrCreateSheet_();

  ensureHeaderRow_(sheet);

  var row = [
    new Date().toISOString(),        // Timestamp
    formId,                          // FormId
    'Pending',                       // Status
    body.boothType        || '',     // BoothType
    body.additionalChair  || '',     // AdditionalChairs
    body.additionalTable  || '',     // AdditionalTables
    body.calculatedTotal  || '',     // Total
    body.contactPerson    || '',     // ContactPerson
    body.title            || '',     // Title
    body.phone            || '',     // Phone
    body.businessName     || '',     // BusinessName
    body.postalAddress    || '',     // PostalAddress
    body.city             || '',     // City
    body.email            || '',     // Email
    body.taxId            || '',     // TaxId
    body.vendorPermit     || '',     // VendorPermit
    body.date             || '',     // Date
    body.description      || '',     // Description
    'I/We agree to abide by the terms and conditions established by Indo American Festivals, Inc. And confirm that we will fully comply with all requirements.',  // TermsAgreement
    '',                              // ZelleSenderName
    '',                              // ZelleConfirmationCode
    '',                              // ZelleScreenshot
    '',                              // ZelleScreenshotDriveUrl
    ''                               // ZelleVerifiedAt
  ];

  sheet.appendRow(row);

  return jsonResponse_({ status: 'ok', formId: formId });
}

// ── Phase 2: Zelle Verification ─────────────────────────────

function handleZelleVerification_(body) {
  var sheet = getOrCreateSheet_();
  var targetRow = findRowByFormId_(sheet, body.formId);

  if (targetRow === -1) {
    return jsonResponse_({ status: 'error', message: 'Application not found' });
  }

  // ── Decode screenshot & persist to Drive ──────────────────
  var decoded   = Utilities.base64Decode(body.screenshotBase64);
  var blob      = Utilities.newBlob(decoded, body.screenshotMimeType);
  var sanitized = sanitizeFilename_(body.businessName);

  blob.setName(body.formId + '_' + sanitized + '.jpg');

  var rootFolderId = PropertiesService.getScriptProperties().getProperty('DRIVE_FOLDER_ID');
  var rootFolder   = DriveApp.getFolderById(rootFolderId);
  var yearFolder   = getOrCreateYearFolder_(rootFolder);
  var file         = yearFolder.createFile(blob);
  var fileUrl      = file.getUrl();

  // ── Build CellImage from original base64 ──────────────────
  var dataUri   = 'data:' + body.screenshotMimeType + ';base64,' + body.screenshotBase64;
  var cellImage = SpreadsheetApp.newCellImage()
    .setSourceUrl(dataUri)
    .build();

  // ── Update the matched row ────────────────────────────────
  // Column indices are 1-based in Sheets: T=20, U=21, V=22, W=23, X=24, C=3
  sheet.getRange(targetRow, 20).setValue(body.senderName);           // ZelleSenderName
  sheet.getRange(targetRow, 21).setValue(body.confirmationCode);     // ZelleConfirmationCode
  sheet.getRange(targetRow, 22).setValue(cellImage);                 // ZelleScreenshot (CellImage)
  sheet.getRange(targetRow, 23).setValue(fileUrl);                   // ZelleScreenshotDriveUrl
  sheet.getRange(targetRow, 24).setValue(new Date().toISOString());  // ZelleVerifiedAt
  sheet.getRange(targetRow, 3).setValue('Zelle Submitted');          // Status

  return jsonResponse_({ status: 'ok' });
}

// ── Helper: get or create the named sheet ───────────────────

function getOrCreateSheet_() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  return sheet;
}

// ── Helper: ensure header row ───────────────────────────────

function ensureHeaderRow_(sheet) {
  var firstRowValues = sheet.getRange(1, 1, 1, sheet.getMaxColumns()).getValues()[0];
  var isEmpty = firstRowValues.every(function(cell) { return cell === '' || cell === null; });

  if (isEmpty) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }
}

// ── Helper: find row by FormId (column B) ───────────────────

function findRowByFormId_(sheet, formId) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;

  var values = sheet.getRange(2, 2, lastRow - 1, 1).getValues(); // Column B, starting at row 2
  for (var i = 0; i < values.length; i++) {
    if (values[i][0] === formId) {
      return i + 2; // convert to 1-based row number (offset by header)
    }
  }
  return -1;
}

// ── Helper: get or create year subfolder ────────────────────

function getOrCreateYearFolder_(rootFolder) {
  var year = new Date().getFullYear().toString();
  var folders = rootFolder.getFoldersByName(year);

  if (folders.hasNext()) {
    return folders.next();
  }

  return rootFolder.createFolder(year);
}

// ── Helper: sanitize a string for use as a filename ─────────

function sanitizeFilename_(name) {
  var safe = (name || 'unknown')
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_\-]/g, '');

  return safe.substring(0, 50);
}

// ── Helper: create a JSON response ──────────────────────────

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
