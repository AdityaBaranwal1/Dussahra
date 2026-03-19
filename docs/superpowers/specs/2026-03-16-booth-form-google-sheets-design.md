# Booth Booking → Google Sheets Integration Design

**Date:** 2026-03-16
**Status:** Approved, implementing

## Overview

Two-phase form submission pipeline: Booth Booking form on the Dussehra 2026 website submits vendor applications to a Google Sheet via Apps Script, with Zelle payment verification (including screenshot upload) updating the same row.

## Decisions Made

- **Payment:** Zelle only, no PayPal
- **Scope:** Booth Booking form only (Contact Us / Volunteer forms later)
- **Auth:** None — unguessable Apps Script URL is sufficient for ~100 submissions/year
- **Session model:** Same-session only — Zelle verification appears after form submit, no magic links
- **Row strategy:** One row per vendor, Phase 2 updates the existing row (Option A)
- **Image handling:** Option B2 — CellImage embedded thumbnail + private Drive backup
- **Compression:** Client-side canvas resize (max 1200px, JPEG 75%) before base64 encoding

## Google Sheet Layout — "Dushahra Submissions"

| Col | Header | Phase | Description |
|-----|--------|-------|-------------|
| A | Timestamp | 1 | ISO datetime of form submission |
| B | FormId | 1 | Unique ID (BOOTH-{timestamp}) |
| C | Status | Both | "Pending" → "Zelle Submitted" |
| D | BoothType | 1 | e.g. "Dedicated Booth - 20x20" |
| E | AdditionalChairs | 1 | Number |
| F | AdditionalTables | 1 | Number |
| G | Total | 1 | Dollar amount |
| H | ContactPerson | 1 | Name |
| I | Title | 1 | Mr., Mrs., etc. |
| J | Phone | 1 | Tel number |
| K | BusinessName | 1 | Business / org name |
| L | PostalAddress | 1 | Street address |
| M | City | 1 | City |
| N | Email | 1 | Email address |
| O | TaxId | 1 | Tax ID |
| P | VendorPermit | 1 | Permit number/status |
| Q | Date | 1 | Date field |
| R | Description | 1 | Items to be sold |
| S | ZelleSenderName | 2 | Name on Zelle account |
| T | ZelleConfirmationCode | 2 | Transaction code |
| U | ZelleScreenshot | 2 | CellImage thumbnail |
| V | ZelleScreenshotDriveUrl | 2 | Full-res Drive link |
| W | ZelleVerifiedAt | 2 | ISO datetime |

## Google Drive Folder Structure

```
Dushahra Zelle Screenshots/        ← root (manual create, ID in Script Properties)
  └── 2026/                         ← auto-created per year
       ├── BOOTH-1710612345678_AcmeCraftGoods.jpg
       └── ...
```

File naming: `{FormId}_{SanitizedBusinessName}.jpg`

## Apps Script Architecture

Single `doPost(e)` routes on `form_type`:
- `booth_application` → append row, return `{ status: 'ok', formId }`
- `zelle_verification` → find row by FormId, save image to Drive, embed CellImage, update row

Script Properties required:
- `DRIVE_FOLDER_ID` — root screenshots folder ID

## Frontend Architecture

- `src/utils/formSubmit.ts` — rewritten with `submitBoothForm()` and `submitZelleVerification()`
- `src/utils/imageCompress.ts` — new, canvas-based resize + JPEG export → base64
- `src/pages/BoothBooking.tsx` — minimal edits: wire new functions, store formId in state

## Files Changed

| File | Action |
|------|--------|
| `src/utils/formSubmit.ts` | Rewrite |
| `src/utils/imageCompress.ts` | New |
| `src/pages/BoothBooking.tsx` | Edit |
| `google-apps-script/Code.gs` | New |
| `google-apps-script/README.md` | New |
