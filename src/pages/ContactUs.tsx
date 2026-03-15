import { useState } from 'react';
import { LocationPinIcon, MailIcon, PhoneIcon, FaxIcon, CheckmarkIcon } from '../components/icons/CulturalIcons';
import { submitForm } from '../utils/formSubmit';
import { EVENT_INFO } from '../data/event-info';
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

        await submitForm(
            { form_type: 'Contact Us', ...formData },
            () => {
                setStatus('success');
                setFormData({ name: '', email: '', subject: '', message: '' });
            },
            () => setStatus('error')
        );
    };

    return (
        <div className="contact-page">
            <div className="page-header">
                <div className="container">
                    <h1 className="page-title">Contact Us</h1>
                    <p className="page-subtitle">We would love to hear from you</p>
                </div>
            </div>

            <div className="container mt-spacing-12">
                <div className="contact-grid">
                    <div className="contact-info card card-shimmer mehndi-corner">
                        <h2>Get in Touch</h2>
                        <p className="margin-bottom-4 text-muted">Whether you have a question about the festival, volunteering, or sponsorships, our team is ready to answer.</p>

                        <div className="info-block">
                            <span className="info-icon"><LocationPinIcon size={24} /></span>
                            <div>
                                <strong>Location</strong>
                                <p>{EVENT_INFO.location.fullAddress}</p>
                            </div>
                        </div>

                        <div className="info-block">
                            <span className="info-icon"><MailIcon size={24} /></span>
                            <div>
                                <strong>Email</strong>
                                <p>{EVENT_INFO.org.zelleEmail}</p>
                            </div>
                        </div>

                        <div className="info-block">
                            <span className="info-icon"><PhoneIcon size={24} /></span>
                            <div>
                                <strong>Phone</strong>
                                <p>{EVENT_INFO.org.phone}</p>
                            </div>
                        </div>

                        <div className="info-block">
                            <span className="info-icon"><FaxIcon size={24} /></span>
                            <div>
                                <strong>Fax</strong>
                                <p>{EVENT_INFO.org.faxAlt}</p>
                            </div>
                        </div>
                    </div>

                    <div className="contact-form-container card">
                        <h2>Send a Message</h2>

                        {status === 'success' ? (
                            <div className="form-success-message form-success-card">
                                <div className="form-success-icon"><CheckmarkIcon size={48} /></div>
                                <h3>Message Sent!</h3>
                                <p>Thank you for reaching out. We will get back to you shortly.</p>
                                <button className="btn btn-secondary form-success-btn" onClick={() => setStatus('idle')}>Send Another Message</button>
                            </div>
                        ) : (
                            <form className="contact-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="contact-name">Full Name</label>
                                    <input id="contact-name" type="text" name="name" value={formData.name} onChange={handleChange} className="form-input input-glow-focus" placeholder="Your Name" required disabled={status === 'submitting'} />
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="contact-email">Email Address</label>
                                    <input id="contact-email" type="email" name="email" value={formData.email} onChange={handleChange} className="form-input input-glow-focus" placeholder="you@example.com" required disabled={status === 'submitting'} />
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="contact-subject">Subject</label>
                                    <input id="contact-subject" type="text" name="subject" value={formData.subject} onChange={handleChange} className="form-input input-glow-focus" placeholder="How can we help?" required disabled={status === 'submitting'} />
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="contact-message">Message</label>
                                    <textarea id="contact-message" name="message" value={formData.message} onChange={handleChange} className="form-input input-glow-focus" rows={5} placeholder="Your message details..." required disabled={status === 'submitting'}></textarea>
                                </div>

                                {status === 'error' && (
                                    <div className="form-error-message" role="alert">
                                        An error occurred. Please try again.
                                    </div>
                                )}

                                <button type="submit" className={`btn btn-primary btn-ripple btn-glow btn-full-width${status === 'submitting' ? ' booth-submit-opacity' : ''}`} disabled={status === 'submitting'}>
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
