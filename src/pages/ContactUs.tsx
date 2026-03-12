import { useState } from 'react';
import { LocationPinIcon, MailIcon, PhoneIcon, FaxIcon } from '../components/icons/CulturalIcons';
import './ContactUs.css';

export const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL';

            if (SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL') {
                setTimeout(() => setStatus('success'), 1200);
                return;
            }

            await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({ form_type: 'Contact Us', ...formData })
            });

            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <div className="contact-page">
            <div className="page-header">
                <div className="container">
                    <h1 className="page-title">Contact Us</h1>
                    <p className="page-subtitle">We would love to hear from you</p>
                </div>
            </div>

            <div className="container" style={{ marginTop: 'var(--spacing-12)' }}>
                <div className="contact-grid">
                    <div className="contact-info card card-shimmer mehndi-corner">
                        <h2>Get in Touch</h2>
                        <p className="margin-bottom-4 text-muted">Whether you have a question about the festival, volunteering, or sponsorships, our team is ready to answer.</p>

                        <div className="info-block">
                            <span className="info-icon"><LocationPinIcon size={24} /></span>
                            <div>
                                <strong>Location</strong>
                                <p>Lake Papaianni Park, 100 Municipal Blvd, Edison, NJ 08817</p>
                            </div>
                        </div>

                        <div className="info-block">
                            <span className="info-icon"><MailIcon size={24} /></span>
                            <div>
                                <strong>Email</strong>
                                <p>dushahra.usa@gmail.com</p>
                            </div>
                        </div>

                        <div className="info-block">
                            <span className="info-icon"><PhoneIcon size={24} /></span>
                            <div>
                                <strong>Phone</strong>
                                <p>732-444-8381</p>
                            </div>
                        </div>

                        <div className="info-block">
                            <span className="info-icon"><FaxIcon size={24} /></span>
                            <div>
                                <strong>Fax</strong>
                                <p>610-427-5277</p>
                            </div>
                        </div>
                    </div>

                    <div className="contact-form-container card">
                        <h2>Send a Message</h2>

                        {status === 'success' ? (
                            <div className="form-success-message" style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--color-bg-base)', borderRadius: 'var(--radius-md)', marginTop: '2rem' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                                <h3>Message Sent!</h3>
                                <p>Thank you for reaching out. We will get back to you shortly.</p>
                                <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => setStatus('idle')}>Send Another Message</button>
                            </div>
                        ) : (
                            <form className="contact-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input input-glow-focus" placeholder="Your Name" required disabled={status === 'submitting'} />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input input-glow-focus" placeholder="you@example.com" required disabled={status === 'submitting'} />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Subject</label>
                                    <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="form-input input-glow-focus" placeholder="How can we help?" required disabled={status === 'submitting'} />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Message</label>
                                    <textarea name="message" value={formData.message} onChange={handleChange} className="form-input input-glow-focus" rows={5} placeholder="Your message details..." required disabled={status === 'submitting'}></textarea>
                                </div>

                                {status === 'error' && (
                                    <div style={{ color: 'var(--color-accent)', marginBottom: '1rem', fontWeight: 600 }}>
                                        An error occurred. Please try again.
                                    </div>
                                )}

                                <button type="submit" className="btn btn-primary btn-ripple btn-glow" style={{ width: '100%', opacity: status === 'submitting' ? 0.7 : 1 }} disabled={status === 'submitting'}>
                                    {status === 'submitting' ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
