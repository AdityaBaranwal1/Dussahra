import { ReactNode } from 'react';
import { CheckmarkIcon } from '../icons/CulturalIcons';

interface Props {
    title: string;
    message: string;
    resetLabel: string;
    onReset: () => void;
    children?: ReactNode;
}

export const FormSuccess = ({ title, message, resetLabel, onReset, children }: Props) => (
    <div className="form-success-message form-success-card">
        <div className="form-success-icon"><CheckmarkIcon size={48} /></div>
        <h3>{title}</h3>
        <p>{message}</p>
        {children}
        <button type="button" className="btn btn-secondary form-success-btn" onClick={onReset}>
            {resetLabel}
        </button>
    </div>
);
