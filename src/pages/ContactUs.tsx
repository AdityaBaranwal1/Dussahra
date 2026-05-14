import { useState } from 'react';
import { LocationPinIcon, MailIcon, PhoneIcon, FaxIcon } from '../components/icons/CulturalIcons';
import { PageHeader } from '../components/PageHeader';
import { FormField } from '../components/forms/FormField';
import { FormSuccess } from '../components/forms/FormSuccess';
import { FormError } from '../components/forms/FormError';
import { useFormSubmission } from '../hooks/useFormSubmission';
import { submitForm } from '../utils/formSubmit';
import { EVENT_INFO } from '../data/event-info';
import './ContactUs.css';

const BLANK_FORM = { name: '', email: '', subject: '', message: '' };

export const ContactUs = () => {
    const [formData, setFormData] = useState(BLANK_FORM);
    const { status, isSubmitting, isError, isSuccess, submit, reset } = useFormSubmission();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await submit(() => submitForm({ form_type: 'Contact Us', ...formData }));
        if (result?.status === 'ok') setFormData(BLANK_FORM);
    };

    return (
        <div className="contact-page">
            <PageHeader title="Contact Us" subtitle="We would love to hear from you" />

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

                        {isSuccess ? (
                            <FormSuccess
                                title="Message Sent!"
                                message="Thank you for reaching out. We will get back to you shortly."
                                resetLabel="Send Another Message"
                                onReset={reset}
                            />
                        ) : (
                            <form className="contact-form" onSubmit={handleSubmit}>
                                <FormField label="Full Name" htmlFor="contact-name">
                                    <input id="contact-name" type="text" name="name" value={formData.name} onChange={handleChange} className="form-input input-glow-focus" placeholder="Your Name" required disabled={isSubmitting} />
                                </FormField>

                                <FormField label="Email Address" htmlFor="contact-email">
                                    <input id="contact-email" type="email" name="email" value={formData.email} onChange={handleChange} className="form-input input-glow-focus" placeholder="you@example.com" required disabled={isSubmitting} />
                                </FormField>

                                <FormField label="Subject" htmlFor="contact-subject">
                                    <input id="contact-subject" type="text" name="subject" value={formData.subject} onChange={handleChange} className="form-input input-glow-focus" placeholder="How can we help?" required disabled={isSubmitting} />
                                </FormField>

                                <FormField label="Message" htmlFor="contact-message">
                                    <textarea id="contact-message" name="message" value={formData.message} onChange={handleChange} className="form-input input-glow-focus" rows={5} placeholder="Your message details..." required disabled={isSubmitting}></textarea>
                                </FormField>

                                {isError && <FormError />}

                                <button type="submit" className="btn btn-primary btn-ripple btn-glow btn-full-width" data-status={status} disabled={isSubmitting}>
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
