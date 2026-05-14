interface Props {
    message?: string;
}

export const FormError = ({ message = 'An error occurred. Please try again.' }: Props) => (
    <div className="form-error-message" role="alert">{message}</div>
);
