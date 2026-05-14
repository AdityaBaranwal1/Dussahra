import { useState, useMemo } from 'react';
import { CheckmarkIcon, AlertIcon, PhoneIcon, PaymentIcon, ShieldCheckIcon } from '../components/icons/CulturalIcons';
import { PageHeader } from '../components/PageHeader';
import { FormField } from '../components/forms/FormField';
import { FormError } from '../components/forms/FormError';
import { useFormSubmission } from '../hooks/useFormSubmission';
import { submitBoothForm, submitZelleVerification } from '../utils/formSubmit';
import { compressImage } from '../utils/imageCompress';
import { EVENT_INFO } from '../data/event-info';
import {
    PRICING_GENERAL,
    PRICING_FOOD,
    ADD_ONS,
    ALL_BOOTHS,
    ADD_ON_CHAIR_PRICE,
    ADD_ON_TABLE_PRICE,
    SELF_BOOTH_PERMIT_FEE,
} from '../data/booth-pricing';
import './BoothBooking.css';

const BLANK_FORM = {
    businessName: '', contactPerson: '', title: '', phone: '', email: '',
    boothType: '', postalAddress: '', city: '', taxId: '', vendorPermit: '',
    date: '', additionalChair: 0, additionalTable: 0, description: '',
};

export const BoothBooking = () => {
    const [formData, setFormData] = useState(BLANK_FORM);
    const { isSubmitting, isError, isSuccess, submit, reset } = useFormSubmission();
    const [formId, setFormId] = useState('');
    const [zelleData, setZelleData] = useState({
        senderName: '',
        confirmationCode: '',
        screenshot: null as File | null,
    });
    const [zelleStatus, setZelleStatus] = useState<'idle' | 'submitting' | 'compressing' | 'success' | 'error'>('idle');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [agreedToCompliance, setAgreedToCompliance] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'number' ? Math.max(0, parseInt(value) || 0) : value
        });
    };

    const selectedBooth = useMemo(() => ALL_BOOTHS.find(b => b.value === formData.boothType), [formData.boothType]);

    const calculatedTotal = useMemo(() => {
        if (!selectedBooth) return 0;
        let total = selectedBooth.price;
        total += formData.additionalChair * ADD_ON_CHAIR_PRICE;
        total += formData.additionalTable * ADD_ON_TABLE_PRICE;
        if (selectedBooth.isSelfBooth) total += SELF_BOOTH_PERMIT_FEE;
        return total;
    }, [selectedBooth, formData.additionalChair, formData.additionalTable]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await submit(() =>
            submitBoothForm({
                boothType: formData.boothType,
                additionalChair: formData.additionalChair,
                additionalTable: formData.additionalTable,
                calculatedTotal,
                contactPerson: formData.contactPerson,
                title: formData.title,
                phone: formData.phone,
                businessName: formData.businessName,
                postalAddress: formData.postalAddress,
                city: formData.city,
                email: formData.email,
                taxId: formData.taxId,
                vendorPermit: formData.vendorPermit,
                date: formData.date,
                description: formData.description,
            })
        );
        if (result?.status === 'ok') setFormId(result.formId || '');
    };

    const handleZelleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setZelleStatus('compressing');

        try {
            let screenshotBase64 = '';
            let screenshotMimeType = 'image/jpeg';

            if (zelleData.screenshot) {
                const compressed = await compressImage(zelleData.screenshot);
                screenshotBase64 = compressed.base64;
                screenshotMimeType = compressed.mimeType;
            }

            setZelleStatus('submitting');

            const result = await submitZelleVerification({
                formId,
                senderName: zelleData.senderName,
                confirmationCode: zelleData.confirmationCode,
                screenshotBase64,
                screenshotMimeType,
                businessName: formData.businessName,
            });
            if (result.status !== 'ok') {
                setZelleStatus('error');
                return;
            }
            setZelleStatus('success');
        } catch {
            setZelleStatus('error');
        }
    };

    const resetAll = () => {
        reset();
        setFormId('');
        setZelleStatus('idle');
        setAgreedToTerms(false);
        setAgreedToCompliance(false);
        setZelleData({ senderName: '', confirmationCode: '', screenshot: null });
        setFormData(BLANK_FORM);
    };

    return (
        <div className="booking-page">
            <PageHeader
                title="Vendor Booth Booking"
                subtitle={`Reserve your space at the ${EVENT_INFO.editionLabel.replace(' Edition', '')} Festival`}
                templeArch
                shimmer
            />

            <div className="container booking-content">
                <div className="pricing-section">
                    <div className="pricing-header reveal">
                        <h2>Non-Food Vendor Rates</h2>
                        <p>Select the booth size that fits your business. Note: Permits are included in the price.</p>
                    </div>
                    <div className="pricing-cards reveal reveal-delay-200">
                        {PRICING_GENERAL.map(tier => (
                            <div key={tier.id} className={`pricing-card glass-card card-shimmer mehndi-corner${tier.type === 'Self Booth' ? ' pricing-card--self-booth' : ''}`}>
                                <h3>{tier.type}</h3>
                                <div className="price">{tier.price}</div>
                                <div className="size">{tier.size}</div>
                                <hr />
                                <ul className="includes-list">
                                    <li><CheckmarkIcon size={16} /> {tier.includes}</li>
                                    {tier.note && tier.type !== 'Self Booth' && <li><CheckmarkIcon size={16} /> {tier.note}</li>}
                                </ul>
                                {tier.type === 'Self Booth' && (
                                    <div className="permit-fee-callout">
                                        <AlertIcon size={16} />
                                        <span><strong>+$25 Permit Fee</strong> — Tent/Canopy provided by vendor</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="pricing-header reveal booth-food-header">
                        <h2><span className="text-gradient">Food Vendor Rates (Vegetarian Only)</span></h2>
                    </div>
                    <div className="pricing-cards reveal reveal-delay-200">
                        {PRICING_FOOD.map(tier => (
                            <div key={tier.id} className="pricing-card glass-card card-shimmer mehndi-corner">
                                <h3>{tier.type}</h3>
                                <div className="price">{tier.price}</div>
                                <div className="size">{tier.size}</div>
                                <hr />
                                <ul className="includes-list">
                                    <li><CheckmarkIcon size={16} /> {tier.includes}</li>
                                    {tier.note && <li><AlertIcon size={16} /> {tier.note}</li>}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="addons-section card card-shimmer reveal">
                        <h3>Add-On Pricing</h3>
                        <ul className="addons-list">
                            {ADD_ONS.map(addon => (
                                <li key={addon.id}>
                                    <span>{addon.item}</span>
                                    <span className="addon-price">{addon.price}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="disclaimers-section card card-shimmer reveal booth-disclaimers">
                    <h3>Rules, Disclaimers & Cancellation Policy</h3>

                    <div className="disclaimer-grid booth-disclaimer-grid">
                        <div className="disclaimer-block">
                                <strong className="booth-disclaimer-label"><PhoneIcon size={18} /> Contact Persons</strong>
                            <p className="text-muted booth-disclaimer-text">
                                {EVENT_INFO.contacts[0].name}: {EVENT_INFO.contacts[0].phone}<br />
                                {EVENT_INFO.contacts[1].name}: {EVENT_INFO.contacts[1].phone}<br />
                                {EVENT_INFO.contacts[5].name}: {EVENT_INFO.contacts[5].phone}
                            </p>
                        </div>

                        <div className="disclaimer-block">
                                <strong className="booth-disclaimer-label"><CheckmarkIcon size={18} /> Booking Confirmation</strong>
                            <p className="text-muted booth-disclaimer-text">
                                Booking will be confirmed after receiving payment. For quick confirmation Zelle: <br /><strong>{EVENT_INFO.org.zelleEmail}</strong>
                            </p>
                        </div>

                        <div className="disclaimer-block">
                                <strong className="booth-disclaimer-label"><ShieldCheckIcon size={18} /> Organization Setup</strong>
                            <p className="text-muted booth-disclaimer-text">
                                {EVENT_INFO.org.name}<br />
                                {EVENT_INFO.org.address}<br />
                                Phone: {EVENT_INFO.org.phone}, {EVENT_INFO.org.phoneAlt}<br />
                                Fax: {EVENT_INFO.org.fax}<br />
                                Email: {EVENT_INFO.org.email}
                            </p>
                        </div>
                    </div>

                    <div className="cancellation-policy booth-cancellation">
                        <strong className="booth-cancellation-title"><AlertIcon size={18} /> Cancellation Policy</strong>
                        <p className="booth-cancellation-intro">There are no cancellations and no refunds. All sales are final.</p>
                    </div>
                </div>

                <div className="booking-form-section card card-shimmer mehndi-corner reveal">
                    <div className="form-header">
                        <h2>Vendor Application Form</h2>
                        <p>Please fill out your details below. Once submitted, our team will review and contact you with Zelle payment instructions.</p>
                    </div>

                    {isSuccess ? (
                        <div className="form-success-message booth-success-message">
                            <div className="booth-success-icon"><CheckmarkIcon size={48} /></div>
                            <h3 className="booth-success-title">Application Successfully Received!</h3>

                            <div className="zelle-instructions booth-zelle-instructions">
                                <h4 className="booth-zelle-header">
                                    <PaymentIcon size={24} /> Zelle Payment Instructions
                                </h4>
                                <ul className="booth-zelle-list">
                                    <li><strong>Recipient Name:</strong> {EVENT_INFO.org.name}</li>
                                    <li><strong>Zelle Email:</strong> {EVENT_INFO.org.zelleEmail}</li>
                                    <li><strong>Amount Due:</strong> ${calculatedTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</li>
                                    <li className="booth-zelle-important">
                                        <strong><AlertIcon size={14} /> Important Memo:</strong> You MUST include your Business Name in the Zelle memo field so we can verify your booking.
                                    </li>
                                </ul>
                                <p className="booth-zelle-note">
                                    Note: Your booth is not reserved until the transfer is manually verified by our staff.
                                </p>
                            </div>

                            {zelleStatus === 'success' ? (
                                <div className="booth-zelle-confirmed">
                                    <div className="booth-zelle-confirmed-icon"><CheckmarkIcon size={40} /></div>
                                    <h3>Thank You!</h3>
                                    <p>Your booking and payment verification have been submitted. Our team will verify and confirm your booth reservation.</p>
                                                    <button className="btn btn-secondary btn-ripple" onClick={resetAll}>Submit Another Application</button>
                                </div>
                            ) : (
                                <form onSubmit={handleZelleSubmit} className="booth-zelle-form">
                                    <h4>Payment Verification</h4>

                                    <FormField label="Zelle Sender Name" htmlFor="booth-zelleSender">
                                        <input id="booth-zelleSender" type="text" className="form-input" placeholder="Enter the name on your Zelle account" value={zelleData.senderName} onChange={e => setZelleData({ ...zelleData, senderName: e.target.value })} required disabled={zelleStatus === 'submitting' || zelleStatus === 'compressing'} />
                                    </FormField>

                                    <FormField label="Zelle Confirmation Screenshot" htmlFor="booth-zelleScreenshot">
                                        <input id="booth-zelleScreenshot" type="file" className="form-input" accept="image/*" onChange={e => setZelleData({ ...zelleData, screenshot: e.target.files?.[0] || null })} disabled={zelleStatus === 'submitting' || zelleStatus === 'compressing'} />
                                    </FormField>

                                    <FormField label="Confirmation Code" htmlFor="booth-zelleCode">
                                        <input id="booth-zelleCode" type="text" className="form-input" placeholder="Enter your Zelle confirmation/transaction code" value={zelleData.confirmationCode} onChange={e => setZelleData({ ...zelleData, confirmationCode: e.target.value })} required disabled={zelleStatus === 'submitting' || zelleStatus === 'compressing'} />
                                    </FormField>

                                    {zelleStatus === 'error' && <FormError message="Your application was submitted, but we could not upload your Zelle proof. Please try again or contact us directly." />}

                                    <button type="submit" className="btn btn-primary btn-ripple submit-btn" disabled={zelleStatus === 'submitting' || zelleStatus === 'compressing'}>
                                        {zelleStatus === 'compressing' ? 'Compressing image...' : zelleStatus === 'submitting' ? 'Uploading...' : 'Finalize Booking'}
                                    </button>
                                </form>
                            )}
                        </div>
                    ) : (
                        <form className="booking-form" onSubmit={handleSubmit}>
                            <FormField label="Select Booth" htmlFor="booth-boothType">
                                <select id="booth-boothType" name="boothType" value={formData.boothType} onChange={handleChange} className="form-input" required disabled={isSubmitting}>
                                    <option value="">Select a booth type...</option>
                                    {PRICING_GENERAL.map(t => <option key={t.id} value={`${t.type} - ${t.size}`}>{t.type} - {t.size} ({t.price})</option>)}
                                    <option disabled>--- Food Vendors ---</option>
                                    <option value="Food/Snacks Booth">Food/Snacks Booth ($3500)</option>
                                </select>
                            </FormField>

                            <div className="form-row">
                                <FormField label="Additional Chair" htmlFor="booth-additionalChair">
                                    <input id="booth-additionalChair" type="number" name="additionalChair" value={formData.additionalChair} onChange={handleChange} className="form-input" min="0" disabled={isSubmitting} />
                                </FormField>
                                <FormField label="Additional Table" htmlFor="booth-additionalTable">
                                    <input id="booth-additionalTable" type="number" name="additionalTable" value={formData.additionalTable} onChange={handleChange} className="form-input" min="0" disabled={isSubmitting} />
                                </FormField>
                            </div>

                            <div className="form-row">
                                <FormField label="Name" htmlFor="booth-contactPerson">
                                    <input id="booth-contactPerson" type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="form-input" placeholder="First and Last Name" required disabled={isSubmitting} />
                                </FormField>
                                <FormField label="Title" htmlFor="booth-title">
                                    <input id="booth-title" type="text" name="title" value={formData.title} onChange={handleChange} className="form-input" placeholder="e.g. Mr., Mrs., Manager" disabled={isSubmitting} />
                                </FormField>
                            </div>

                            <div className="form-row">
                                <FormField label="Tel No" htmlFor="booth-phone">
                                    <input id="booth-phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input" placeholder="(555) 123-4567" required disabled={isSubmitting} />
                                </FormField>
                                <FormField label="Business / Organization Name" htmlFor="booth-businessName">
                                    <input id="booth-businessName" type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="form-input" placeholder="e.g. Acme Craft Goods" required disabled={isSubmitting} />
                                </FormField>
                            </div>

                            <div className="form-row">
                                <FormField label="Postal Address" htmlFor="booth-postalAddress">
                                    <input id="booth-postalAddress" type="text" name="postalAddress" value={formData.postalAddress} onChange={handleChange} className="form-input" placeholder="Street address" disabled={isSubmitting} />
                                </FormField>
                                <FormField label="City" htmlFor="booth-city">
                                    <input id="booth-city" type="text" name="city" value={formData.city} onChange={handleChange} className="form-input" placeholder="City" disabled={isSubmitting} />
                                </FormField>
                            </div>

                            <div className="form-row">
                                <FormField label="Email Address" htmlFor="booth-email">
                                    <input id="booth-email" type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" placeholder="you@example.com" required disabled={isSubmitting} />
                                </FormField>
                                <FormField label="Tax ID" htmlFor="booth-taxId">
                                    <input id="booth-taxId" type="text" name="taxId" value={formData.taxId} onChange={handleChange} className="form-input" placeholder="Tax ID number" disabled={isSubmitting} />
                                </FormField>
                            </div>

                            <div className="form-row">
                                <FormField label="Vendor/Food Permit" htmlFor="booth-vendorPermit">
                                    <input id="booth-vendorPermit" type="text" name="vendorPermit" value={formData.vendorPermit} onChange={handleChange} className="form-input" placeholder="Permit number or status" disabled={isSubmitting} />
                                </FormField>
                                <FormField label="Date" htmlFor="booth-date">
                                    <input id="booth-date" type="date" name="date" value={formData.date} onChange={handleChange} className="form-input" disabled={isSubmitting} />
                                </FormField>
                            </div>

                            <FormField label="Description of items to be sold" htmlFor="booth-description">
                                <textarea id="booth-description" name="description" value={formData.description} onChange={handleChange} className="form-input" rows={4} placeholder="Please detail the items you plan to sell or display..." required disabled={isSubmitting}></textarea>
                            </FormField>

                            <div className="calculations-section booth-calculations">
                                <h4>Calculations</h4>
                                {selectedBooth ? (
                                    <div className="booth-calc-rows">
                                        <div className="booth-calc-row">
                                            <span>Booth ({formData.boothType})</span>
                                            <span>${selectedBooth.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                        {formData.additionalChair > 0 && (
                                            <div className="booth-calc-row">
                                                <span>Additional Chair x{formData.additionalChair}</span>
                                                <span>${(formData.additionalChair * ADD_ON_CHAIR_PRICE).toFixed(2)}</span>
                                            </div>
                                        )}
                                        {formData.additionalTable > 0 && (
                                            <div className="booth-calc-row">
                                                <span>Additional Table x{formData.additionalTable}</span>
                                                <span>${(formData.additionalTable * ADD_ON_TABLE_PRICE).toFixed(2)}</span>
                                            </div>
                                        )}
                                        {selectedBooth.isSelfBooth && (
                                            <div className="booth-calc-row">
                                                <span>Permit Fee (Self Booth)</span>
                                                <span>${SELF_BOOTH_PERMIT_FEE.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <hr className="booth-calc-divider" />
                                        <div className="booth-calc-total">
                                            <span>Total</span>
                                            <span>${calculatedTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="booth-calc-empty">Select a booth to see pricing breakdown.</p>
                                )}
                            </div>

                            {isError && <FormError message="An error occurred sending your application. Please try again or contact us directly." />}

                            <label className="form-disclaimer-checkbox" htmlFor="booth-agreeTerms">
                                <input
                                    id="booth-agreeTerms"
                                    type="checkbox"
                                    checked={agreedToTerms}
                                    onChange={e => setAgreedToTerms(e.target.checked)}
                                    required
                                    disabled={isSubmitting}
                                />
                                <span>I confirm that I have read and agree to the attached rules, terms and conditions and understand that Indo American Festivals, Inc. is not responsible for loss, theft or damage of my property. I will abide by the terms and conditions of Indo American Festivals, Inc. and the rules and regulations of Edison Township, New Jersey.</span>
                            </label>

                            <label className="form-disclaimer-checkbox form-compliance-checkbox" htmlFor="booth-agreeCompliance">
                                <input
                                    id="booth-agreeCompliance"
                                    type="checkbox"
                                    checked={agreedToCompliance}
                                    onChange={e => setAgreedToCompliance(e.target.checked)}
                                    required
                                    disabled={isSubmitting}
                                />
                                <span>I/We agree to abide by the terms and conditions established by Indo American Festivals, Inc. And confirm that we will fully comply with all requirements.</span>
                            </label>

                            <button type="submit" className="btn btn-primary btn-ripple submit-btn" disabled={isSubmitting || !agreedToTerms || !agreedToCompliance}>
                                {isSubmitting ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
