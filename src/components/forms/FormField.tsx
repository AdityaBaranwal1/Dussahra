import { ReactNode } from 'react';

interface Props {
    label: string;
    htmlFor: string;
    children: ReactNode;
}

export const FormField = ({ label, htmlFor, children }: Props) => (
    <div className="form-group">
        <label className="form-label" htmlFor={htmlFor}>{label}</label>
        {children}
    </div>
);
