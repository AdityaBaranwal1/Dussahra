const SCRIPT_URL: string = 'https://script.google.com/macros/s/AKfycbycxdiHVFRUFA1YKXeBaAAJHJ-uAesnjIMJZxACI-l-5QXE2BgfbEariloPiHMwrLHs/exec';

const DEMO_MODE = SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL';

/* ------------------------------------------------------------------ */
/*  Booth Application                                                 */
/* ------------------------------------------------------------------ */

interface BoothFormData {
  boothType: string;
  additionalChair: number;
  additionalTable: number;
  calculatedTotal: number;
  contactPerson: string;
  title: string;
  phone: string;
  businessName: string;
  postalAddress: string;
  city: string;
  email: string;
  taxId: string;
  vendorPermit: string;
  date: string;
  description: string;
}

interface SubmitResponse {
  status: 'ok' | 'error';
  formId?: string;
  message?: string;
}

/**
 * Google Apps Script web apps don't support CORS for readable responses.
 * We use mode: 'no-cors' (opaque response) and generate formId client-side.
 */
export async function submitBoothForm(
  data: BoothFormData
): Promise<SubmitResponse> {
  const formId = 'BOOTH-' + Date.now();

  if (DEMO_MODE) {
    await new Promise((r) => setTimeout(r, 1200));
    return { status: 'ok', formId };
  }

  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ form_type: 'booth_application', formId, ...data }),
    });

    // With no-cors the response is opaque — we trust it landed if no network error
    return { status: 'ok', formId };
  } catch (err) {
    throw new Error(
      'Failed to submit booth application: ' +
        (err instanceof Error ? err.message : String(err))
    );
  }
}

/* ------------------------------------------------------------------ */
/*  Zelle Verification                                                */
/* ------------------------------------------------------------------ */

interface ZelleData {
  formId: string;
  senderName: string;
  confirmationCode: string;
  screenshotBase64: string;
  screenshotMimeType: string;
  businessName: string;
}

export async function submitZelleVerification(
  data: ZelleData
): Promise<SubmitResponse> {
  if (DEMO_MODE) {
    await new Promise((r) => setTimeout(r, 1500));
    return { status: 'ok' };
  }

  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ form_type: 'zelle_verification', ...data }),
    });

    return { status: 'ok' };
  } catch (err) {
    throw new Error(
      'Failed to submit Zelle verification: ' +
        (err instanceof Error ? err.message : String(err))
    );
  }
}

/* ------------------------------------------------------------------ */
/*  Legacy helper (ContactUs / Volunteer forms)                       */
/* ------------------------------------------------------------------ */

export async function submitForm(
  data: Record<string, unknown>,
  onSuccess: () => void,
  onError: () => void
): Promise<void> {
  try {
    if (DEMO_MODE) {
      setTimeout(onSuccess, 1200);
      return;
    }

    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(data),
    });

    onSuccess();
  } catch {
    onError();
  }
}
