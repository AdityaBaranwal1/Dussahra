# Google Apps Script — Booth Booking Integration

## Setup Instructions

### 1. Create the Drive Folder

1. Go to [Google Drive](https://drive.google.com)
2. Create a folder called **"Dushahra Zelle Screenshots"**
3. Copy the folder ID from the URL: `drive.google.com/drive/folders/THIS_PART_HERE`
https://drive.google.com/drive/folders/1ui89h6Xex9rn5esRvKnJ0w27jAAy1oB7?usp=drive_link
### 2. Set Up the Apps Script

1. Open your **"Dushahra Submissions"** Google Sheet
2. Go to **Extensions → Apps Script**
3. Delete any existing code in `Code.gs`
4. Paste the contents of `Code.gs` from this directory
5. Go to **Project Settings** (gear icon on left sidebar)
6. Scroll to **Script Properties** → click **Add Script Property**
7. Add: `DRIVE_FOLDER_ID` = the folder ID from Step 1
8. Click **Save**

### 3. Deploy as Web App

1. In Apps Script, click **Deploy → New deployment**
2. Click the gear icon → select **Web app**
3. Set **Execute as:** `Me`
4. Set **Who has access:** `Anyone`
5. Click **Deploy**
6. **Authorize** the app when prompted (review permissions, allow access to Drive + Sheets)
7. Copy the **Web app URL** (looks like `https://script.google.com/macros/s/XXXXX/exec`)

### 4. Update the Frontend

1. Open `src/utils/formSubmit.ts`
2. Replace `'YOUR_GOOGLE_SCRIPT_WEB_APP_URL'` with the Web app URL from Step 3

### 5. Verify

1. Run the site locally (`npm run dev`)
2. Submit a test booth application
3. Check the Google Sheet — you should see a new row with Status = "Pending"
4. Complete the Zelle verification step with a test screenshot
5. Check the Sheet — same row should now have Zelle columns filled + a thumbnail
6. Check the Drive folder — a `2026/` subfolder should contain the screenshot

## Architecture

```
Browser (React)
  │
  ├─ Phase 1: POST { form_type: 'booth_application', ...fields }
  │    → Apps Script creates row, returns { formId }
  │
  └─ Phase 2: POST { form_type: 'zelle_verification', formId, base64 image, ... }
       → Apps Script finds row by formId
       → Saves image to Drive (year subfolder)
       → Embeds CellImage thumbnail in sheet
       → Updates Zelle columns + Status
```

## Redeployment

If you update `Code.gs`:
1. In Apps Script, click **Deploy → Manage deployments**
2. Click the pencil icon on the active deployment
3. Change **Version** to **New version**
4. Click **Deploy**

The URL stays the same — no frontend changes needed.

## Sharing

- Share the Google Sheet with other organizers for read/write access
- Share the Drive folder for direct access to screenshots
- The web app URL should NOT be shared publicly (it's embedded in the frontend code)
