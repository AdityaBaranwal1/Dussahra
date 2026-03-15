import { useState } from 'react';
import { CheckmarkIcon, LotusIcon } from '../components/icons/CulturalIcons';
import { submitForm } from '../utils/formSubmit';
import './Volunteer.css';

export const Volunteer = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contactNumber: '',
        address: '',
        agreeToTerms: false,
    });
    const [, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.agreeToTerms) return;
        setStatus('submitting');

        await submitForm(
            { form_type: 'Volunteer Sign-Up', ...formData },
            () => setStatus('success'),
            () => setStatus('error')
        );
    };

    return (
        <div className="volunteer-page">
            <div className="page-header temple-arch">
                <div className="container">
                    <h1 className="page-title text-shimmer">Volunteer With Us</h1>
                    <p className="page-subtitle">Join our team and make a difference</p>
                </div>
            </div>

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

                    {status === 'success' ? (
                        <div className="form-success-message form-success-card">
                            <div className="form-success-icon"><CheckmarkIcon size={48} /></div>
                            <h3>Thank You for Signing Up!</h3>
                            <p>We have received your volunteer application. Our team will reach out to you soon.</p>
                            <button className="btn btn-secondary btn-ripple form-success-btn" onClick={() => {
                                setStatus('idle');
                                setFormData({ name: '', email: '', contactNumber: '', address: '', agreeToTerms: false });
                                setFile(null);
                            }}>Submit Another Application</button>
                        </div>
                    ) : (
                        <form className="volunteer-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="vol-name">Your Name *</label>
                                <input id="vol-name" type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" placeholder="Full name" required disabled={status === 'submitting'} />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="vol-email">Email *</label>
                                <input id="vol-email" type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" placeholder="you@example.com" required disabled={status === 'submitting'} />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="vol-contact">Contact Number *</label>
                                <input id="vol-contact" type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className="form-input" placeholder="(555) 123-4567" required disabled={status === 'submitting'} />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="vol-address">Address *</label>
                                <textarea id="vol-address" name="address" value={formData.address} onChange={handleChange} className="form-input" rows={3} placeholder="Your full address" required disabled={status === 'submitting'}></textarea>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="vol-file">File Upload</label>
                                <input id="vol-file" type="file" className="form-input" onChange={e => setFile(e.target.files?.[0] || null)} disabled={status === 'submitting'} />
                            </div>

                            <div className="form-group flex-start-gap">
                                <input id="vol-agree" type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} required disabled={status === 'submitting'} className="checkbox-input" />
                                <label htmlFor="vol-agree" className="checkbox-label">
                                    I agree to the Volunteer Agreement.{' '}
                                    <a href="/IAF-Volunteer_Agreement_and_Policy-2023.pdf" target="_blank" rel="noopener noreferrer">
                                        <strong>Read the Volunteer Agreement</strong>
                                    </a>
                                </label>
                            </div>

                            {status === 'error' && (
                                <div className="form-error-message" role="alert">
                                    An error occurred. Please try again.
                                </div>
                            )}

                            <button type="submit" className={`btn btn-primary btn-ripple btn-full-width${status === 'submitting' ? ' booth-submit-opacity' : ''}`} disabled={status === 'submitting'}>
                                {status === 'submitting' ? 'Submitting...' : 'Submit'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
