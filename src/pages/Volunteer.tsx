import { useState } from 'react';
import { LotusIcon } from '../components/icons/CulturalIcons';
import { PageHeader } from '../components/PageHeader';
import { FormField } from '../components/forms/FormField';
import { FormSuccess } from '../components/forms/FormSuccess';
import { FormError } from '../components/forms/FormError';
import { useFormSubmission } from '../hooks/useFormSubmission';
import { submitForm } from '../utils/formSubmit';
import { fileToBase64 } from '../utils/fileToBase64';
import './Volunteer.css';

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const BLANK_FORM = { name: '', email: '', contactNumber: '', address: '', agreeToTerms: false };

export const Volunteer = () => {
    const [formData, setFormData] = useState(BLANK_FORM);
    const [file, setFile] = useState<File | null>(null);
    const [oversizedFile, setOversizedFile] = useState(false);
    const { isSubmitting, isError, isSuccess, submit, reset } = useFormSubmission();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const resetAll = () => {
        reset();
        setFormData(BLANK_FORM);
        setFile(null);
        setOversizedFile(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.agreeToTerms) return;

        if (file && file.size > MAX_UPLOAD_BYTES) {
            setOversizedFile(true);
            return;
        }
        setOversizedFile(false);

        const attachment = file ? await fileToBase64(file) : null;
        const result = await submit(() =>
            submitForm({
                form_type: 'Volunteer Sign-Up',
                ...formData,
                ...(attachment && {
                    fileBase64: attachment.base64,
                    fileMimeType: attachment.mimeType,
                    fileName: attachment.name,
                }),
            })
        );
        if (result?.status === 'ok') {
            setFormData(BLANK_FORM);
            setFile(null);
        }
    };

    return (
        <div className="volunteer-page">
            <PageHeader title="Volunteer With Us" subtitle="Join our team and make a difference" templeArch shimmer />

            <div className="container mt-spacing-12">
                <div className="volunteer-intro lotus-watermark reveal">
                    <p>
                        Indo-American Festivals, Inc. (IAF) welcomes volunteers who want to contribute to our community events.
                        IAF is an approved organization for the <strong>President's Volunteer Service Award (PVSA)</strong> program —
                        volunteers can earn national recognition through their service hours.
                    </p>
                </div>

                <div className="volunteer-download card card-shimmer reveal">
                    <div className="download-content">
                        <div>
                            <h3>Volunteer / Member Guidelines</h3>
                            <p className="text-muted">Click below to download our Volunteer Agreement and Policy document.</p>
                        </div>
                        <a
                            href="/IAF-Volunteer_Agreement_and_Policy-2023.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-ripple"
                        >
                            Download Volunteer Agreement (PDF)
                        </a>
                    </div>
                </div>

                <div className="divider-mandala-spin reveal divider-margin-auto">
                    <LotusIcon size={32} />
                </div>

                <div className="volunteer-form-section card card-shimmer mehndi-corner reveal">
                    <div className="form-header">
                        <h2><span className="text-gradient">Volunteer Sign-Up</span></h2>
                        <p>Fill out the form below to join our volunteer team.</p>
                    </div>

                    {isSuccess ? (
                        <FormSuccess
                            title="Thank You for Signing Up!"
                            message="We have received your volunteer application. Our team will reach out to you soon."
                            resetLabel="Submit Another Application"
                            onReset={resetAll}
                        />
                    ) : (
                        <form className="volunteer-form" onSubmit={handleSubmit}>
                            <FormField label="Your Name *" htmlFor="vol-name">
                                <input id="vol-name" type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" placeholder="Full name" required disabled={isSubmitting} />
                            </FormField>

                            <FormField label="Email *" htmlFor="vol-email">
                                <input id="vol-email" type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" placeholder="you@example.com" required disabled={isSubmitting} />
                            </FormField>

                            <FormField label="Contact Number *" htmlFor="vol-contact">
                                <input id="vol-contact" type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className="form-input" placeholder="(555) 123-4567" required disabled={isSubmitting} />
                            </FormField>

                            <FormField label="Address *" htmlFor="vol-address">
                                <textarea id="vol-address" name="address" value={formData.address} onChange={handleChange} className="form-input" rows={3} placeholder="Your full address" required disabled={isSubmitting}></textarea>
                            </FormField>

                            <FormField label="File Upload (max 5 MB)" htmlFor="vol-file">
                                <input id="vol-file" type="file" className="form-input" onChange={e => setFile(e.target.files?.[0] || null)} disabled={isSubmitting} />
                            </FormField>

                            <div className="form-group flex-start-gap">
                                <input id="vol-agree" type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} required disabled={isSubmitting} className="checkbox-input" />
                                <label htmlFor="vol-agree" className="checkbox-label">
                                    I agree to the Volunteer Agreement.{' '}
                                    <a href="/IAF-Volunteer_Agreement_and_Policy-2023.pdf" target="_blank" rel="noopener noreferrer">
                                        <strong>Read the Volunteer Agreement</strong>
                                    </a>
                                </label>
                            </div>

                            {oversizedFile && <FormError message="File is larger than 5 MB. Please choose a smaller file." />}
                            {isError && <FormError />}

                            <button type="submit" className="btn btn-primary btn-ripple btn-full-width" disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
