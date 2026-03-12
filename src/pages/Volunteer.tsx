import { useState } from 'react';
import { CheckmarkIcon, LotusIcon } from '../components/icons/CulturalIcons';
import './Volunteer.css';

export const Volunteer = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contactNumber: '',
        address: '',
        agreeToTerms: false,
    });
    const [_file, setFile] = useState<File | null>(null);
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

        try {
            const SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL';

            if (SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL') {
                setTimeout(() => setStatus('success'), 1200);
                return;
            }

            await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({ form_type: 'Volunteer Sign-Up', ...formData })
            });

            setStatus('success');
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <div className="volunteer-page">
            <div className="page-header temple-arch">
                <div className="container">
                    <h1 className="page-title text-shimmer">Volunteer With Us</h1>
                    <p className="page-subtitle">Join our team and make a difference</p>
                </div>
            </div>

            <div className="container" style={{ marginTop: 'var(--spacing-12)' }}>
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
                            Download Here
                        </a>
                    </div>
                </div>

                <div className="divider-mandala-spin reveal" style={{ margin: 'var(--spacing-8) auto' }}>
                    <LotusIcon size={32} />
                </div>

                <div className="volunteer-form-section card card-shimmer mehndi-corner reveal">
                    <div className="form-header">
                        <h2><span className="text-gradient">Volunteer Sign-Up</span></h2>
                        <p>Fill out the form below to join our volunteer team.</p>
                    </div>

                    {status === 'success' ? (
                        <div className="form-success-message" style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--color-bg-base)', borderRadius: 'var(--radius-md)', marginTop: '2rem' }}>
                            <div style={{ marginBottom: '1rem' }}><CheckmarkIcon size={48} /></div>
                            <h3>Thank You for Signing Up!</h3>
                            <p>We have received your volunteer application. Our team will reach out to you soon.</p>
                            <button className="btn btn-secondary btn-ripple" style={{ marginTop: '1rem' }} onClick={() => {
                                setStatus('idle');
                                setFormData({ name: '', email: '', contactNumber: '', address: '', agreeToTerms: false });
                                setFile(null);
                            }}>Submit Another Application</button>
                        </div>
                    ) : (
                        <form className="volunteer-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Your Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" placeholder="Full name" required disabled={status === 'submitting'} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email *</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" placeholder="you@example.com" required disabled={status === 'submitting'} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Contact Number *</label>
                                <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className="form-input" placeholder="(555) 123-4567" required disabled={status === 'submitting'} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Address *</label>
                                <textarea name="address" value={formData.address} onChange={handleChange} className="form-input" rows={3} placeholder="Your full address" required disabled={status === 'submitting'}></textarea>
                            </div>

                            <div className="form-group">
                                <label className="form-label">File Upload</label>
                                <input type="file" className="form-input" onChange={e => setFile(e.target.files?.[0] || null)} disabled={status === 'submitting'} />
                            </div>

                            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-2)' }}>
                                <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} required disabled={status === 'submitting'} style={{ marginTop: '4px' }} />
                                <label style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                    I agree to the Volunteer Agreement.{' '}
                                    <a href="/IAF-Volunteer_Agreement_and_Policy-2023.pdf" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600 }}>
                                        Please read here
                                    </a>
                                </label>
                            </div>

                            {status === 'error' && (
                                <div style={{ color: 'var(--color-accent)', marginBottom: '1rem', fontWeight: 600 }}>
                                    An error occurred. Please try again.
                                </div>
                            )}

                            <button type="submit" className="btn btn-primary btn-ripple" style={{ width: '100%', opacity: status === 'submitting' ? 0.7 : 1 }} disabled={status === 'submitting'}>
                                {status === 'submitting' ? 'Submitting...' : 'Submit'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
