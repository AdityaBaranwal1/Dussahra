// To swap deployments, override via VITE_SCRIPT_URL in .env (see .env.example).
const DEFAULT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbycxdiHVFRUFA1YKXeBaAAJHJ-uAesnjIMJZxACI-l-5QXE2BgfbEariloPiHMwrLHs/exec';
const SCRIPT_URL = import.meta.env.VITE_SCRIPT_URL || DEFAULT_SCRIPT_URL;
const DEMO_MODE = !SCRIPT_URL;

interface SubmitResponse {
    status: 'ok' | 'error';
    formId?: string;
    message?: string;
}

async function postToScript(payload: Record<string, unknown>): Promise<SubmitResponse> {
    // GAS web apps don't let us set CORS headers, but a POST with the default
    // text/plain content-type is a CORS-safelisted "simple request" — no
    // preflight, and the response is readable. Don't add a Content-Type header
    // or the browser will preflight and the request will fail.
    const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        return { status: 'error', message: `HTTP ${response.status}` };
    }

    const data = (await response.json()) as SubmitResponse;
    if (data.status !== 'ok') {
        return { status: 'error', message: data.message ?? 'Unknown error' };
    }
    return data;
}

export interface BoothFormData {
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

export async function submitBoothForm(data: BoothFormData): Promise<SubmitResponse> {
    const formId = 'BOOTH-' + Date.now();

    if (DEMO_MODE) {
        await new Promise((r) => setTimeout(r, 1200));
        return { status: 'ok', formId };
    }

    return postToScript({ form_type: 'booth_application', formId, ...data });
}

export interface ZelleData {
    formId: string;
    senderName: string;
    confirmationCode: string;
    screenshotBase64: string;
    screenshotMimeType: string;
    businessName: string;
}

export async function submitZelleVerification(data: ZelleData): Promise<SubmitResponse> {
    if (DEMO_MODE) {
        await new Promise((r) => setTimeout(r, 1500));
        return { status: 'ok' };
    }

    return postToScript({ form_type: 'zelle_verification', ...data });
}

export async function submitForm(data: Record<string, unknown>): Promise<SubmitResponse> {
    if (DEMO_MODE) {
        await new Promise((r) => setTimeout(r, 1200));
        return { status: 'ok' };
    }
    return postToScript(data);
}
