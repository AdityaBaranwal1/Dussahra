const SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL';

export async function submitForm(
    data: Record<string, unknown>,
    onSuccess: () => void,
    onError: () => void
): Promise<void> {
    try {
        if (SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL') {
            setTimeout(onSuccess, 1200);
            return;
        }

        await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(data),
        });

        onSuccess();
    } catch {
        onError();
    }
}
