import { useState } from 'react';

export type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export interface FormSubmissionResult {
    status: 'ok' | 'error';
}

export function useFormSubmission() {
    const [status, setStatus] = useState<FormStatus>('idle');

    const submit = async <T extends FormSubmissionResult>(
        action: () => Promise<T>
    ): Promise<T | null> => {
        setStatus('submitting');
        try {
            const result = await action();
            setStatus(result.status === 'ok' ? 'success' : 'error');
            return result;
        } catch {
            setStatus('error');
            return null;
        }
    };

    const reset = () => setStatus('idle');

    return {
        status,
        submit,
        reset,
        isSubmitting: status === 'submitting',
        isSuccess: status === 'success',
        isError: status === 'error',
    };
}
