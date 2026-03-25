import { useState, useMemo } from 'react';
import { CheckmarkIcon, AlertIcon, PhoneIcon, PaymentIcon, ShieldCheckIcon } from '../components/icons/CulturalIcons';
import { submitBoothForm, submitZelleVerification } from '../utils/formSubmit';
import { compressImage } from '../utils/imageCompress';
import { EVENT_INFO } from '../data/event-info';
import './BoothBooking.css';

const PRICING_GENERAL = [
    { id: 1, type: 'Dedicated Booth', size: '20x20', price: '$1500', includes: '4 Tables – 4 Chairs', note: 'Permit Included' },
    { id: 2, type: 'Dedicated Booth', size: '20x10', price: '$1100', includes: '2 Tables – 2 Chairs', note: 'Permit Included' },
    { id: 3, type: 'Dedicated Booth', size: '10x10', price: '$900', includes: '1 Table – 2 Chairs', note: 'Permit Included' },
    { id: 4, type: 'Self Booth', size: '10x10', price: '$1000', includes: '1 Table – 2 Chairs', note: 'Permit Fee $25 extra — Tent/Canopy provided by vendor' },
    { id: 5, type: 'Split Booth', size: '20x10/2', price: '$650', includes: '1 Table – 2 Chairs', note: 'Permit Included' },
    { id: 6, type: 'Split Booth', size: '20x20/4', price: '$500', includes: '1 Table – 2 Chairs', note: 'Permit Included' },
    { id: 7, type: 'Table in Open Area', size: 'Table', price: '$300', includes: '1 Table – 1 Chair', note: '' },
];

const PRICING_FOOD = [
    { id: 101, type: 'Dedicated Booth', size: '20x20', price: '$3500', includes: '4 Tables – 4 Chairs', note: 'Permit Not Included — must be obtained by vendor. Vegetarian food only.' },
];

const ADD_ONS = [
    { id: 201, item: 'Extra Table', price: '$25' },
    { id: 202, item: 'Extra Chair', price: '$10' },
    { id: 203, item: 'Ads Displayed on Screen', price: 'Contact Us' },
    { id: 204, item: 'Physical Banner Space', price: 'Contact Us' },
];

const ALL_BOOTHS = [
    ...PRICING_GENERAL.map(t => ({ label: `${t.type} - ${t.size} (${t.price})`, value: `${t.type} - ${t.size}`, price: parseInt(t.price.replace(/[^0-9]/g, '')), isSelfBooth: t.type === 'Self Booth' })),
    ...PRICING_FOOD.map(t => ({ label: `Food: ${t.type} - ${t.size} (${t.price})`, value: `Food/Snacks Booth`, price: parseInt(t.price.replace(/[^0-9]/g, '')), isSelfBooth: false })),
];

export const BoothBooking = () => {
    const [formData, setFormData] = useState({
        businessName: '',
        contactPerson: '',
        title: '',
        phone: '',
        email: '',
        boothType: '',
        postalAddress: '',
        city: '',
        taxId: '',
        vendorPermit: '',
        date: '',
        additionalChair: 0,
        additionalTable: 0,
        description: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'zelle-finalized' | 'error'>('idle');
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
        total += formData.additionalChair * 10;
        total += formData.additionalTable * 25;
        if (selectedBooth.isSelfBooth) total += 25;
        return total;
    }, [selectedBooth, formData.additionalChair, formData.additionalTable]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const result = await submitBoothForm({
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
            });
            setFormId(result.formId || '');
            setStatus('success');
        } catch {
            setStatus('error');
        }
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

            await submitZelleVerification({
                formId,
                senderName: zelleData.senderName,
                confirmationCode: zelleData.confirmationCode,
                screenshotBase64,
                screenshotMimeType,
                businessName: formData.businessName,
            });
            setZelleStatus('success');
        } catch {
            setZelleStatus('error');
        }
    };

    const resetAll = () => {
        setStatus('idle');
        setFormId('');
        setZelleStatus('idle');
        setAgreedToTerms(false);
        setAgreedToCompliance(false);
        setZelleData({ senderName: '', confirmationCode: '', screenshot: null });
        setFormData({
            businessName: '', contactPerson: '', title: '', phone: '', email: '',
            boothType: '', postalAddress: '', city: '', taxId: '', vendorPermit: '',
            date: '', additionalChair: 0, additionalTable: 0, description: ''
        });
    };

    return (
        <div className="booking-page">
            <div className="page-header temple-arch">
                <div className="container">
                    <h1 className="page-title text-shimmer">Vendor Booth Booking</h1>
                    <p className="page-subtitle">Reserve your space at the {EVENT_INFO.editionLabel.replace(' Edition', '')} Dushahra Festival</p>
                </div>
            </div>

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
                        <p className="booth-cancellation-intro">All cancellations must be in writing.</p>
                        <ul className="booth-cancellation-list">
                            <li>If canceled before July 31st, a full refund will be issued.</li>
                            <li>From August 1 to {EVENT_INFO.cancellationDeadline}, a 50% refund will be issued based on the full published price of the booth. No refund will be issued thereafter.</li>
                            <li>If the event is moved to the rain date ({EVENT_INFO.rainDate}), no refunds will be given.</li>
                            <li>No refunds will be issued after {EVENT_INFO.cancellationDeadline}, or due to rain, rain date changes, or any act of God.</li>
                        </ul>
                    </div>
                </div>

                <div className="booking-form-section card card-shimmer mehndi-corner reveal">
                    <div className="form-header">
                        <h2>Vendor Application Form</h2>
                        <p>Please fill out your details below. Once submitted, our team will review and contact you with Zelle payment instructions.</p>
                    </div>

                    {status === 'success' || status === 'zelle-finalized' ? (
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

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="booth-zelleSender">Zelle Sender Name</label>
                                        <input id="booth-zelleSender" type="text" className="form-input" placeholder="Enter the name on your Zelle account" value={zelleData.senderName} onChange={e => setZelleData({ ...zelleData, senderName: e.target.value })} required disabled={zelleStatus === 'submitting' || zelleStatus === 'compressing'} />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="booth-zelleScreenshot">Zelle Confirmation Screenshot</label>
                                        <input id="booth-zelleScreenshot" type="file" className="form-input" accept="image/*" onChange={e => setZelleData({ ...zelleData, screenshot: e.target.files?.[0] || null })} disabled={zelleStatus === 'submitting' || zelleStatus === 'compressing'} />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="booth-zelleCode">Confirmation Code</label>
                                        <input id="booth-zelleCode" type="text" className="form-input" placeholder="Enter your Zelle confirmation/transaction code" value={zelleData.confirmationCode} onChange={e => setZelleData({ ...zelleData, confirmationCode: e.target.value })} required disabled={zelleStatus === 'submitting' || zelleStatus === 'compressing'} />
                                    </div>

                                    {zelleStatus === 'error' && (
                                        <div className="booth-error" role="alert">
                                            Your application was submitted, but we could not upload your Zelle proof. Please try again or contact us directly.
                                        </div>
                                    )}

                                    <button type="submit" className={`btn btn-primary btn-ripple submit-btn${zelleStatus !== 'idle' && zelleStatus !== 'error' ? ' booth-submit-opacity' : ''}`} disabled={zelleStatus === 'submitting' || zelleStatus === 'compressing'}>
                                        {zelleStatus === 'compressing' ? 'Compressing image...' : zelleStatus === 'submitting' ? 'Uploading...' : 'Finalize Booking'}
                                    </button>
                                </form>
                            )}
                        </div>
                    ) : (
                        <form className="booking-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="booth-boothType">Select Booth</label>
                                <select id="booth-boothType" name="boothType" value={formData.boothType} onChange={handleChange} className="form-input" required disabled={status === 'submitting'}>
                                    <option value="">Select a booth type...</option>
                                    {PRICING_GENERAL.map(t => <option key={t.id} value={`${t.type} - ${t.size}`}>{t.type} - {t.size} ({t.price})</option>)}
                                    <option disabled>--- Food Vendors ---</option>
                                    <option value="Food/Snacks Booth">Food/Snacks Booth ($3500)</option>
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="booth-additionalChair">Additional Chair</label>
                                    <input id="booth-additionalChair" type="number" name="additionalChair" value={formData.additionalChair} onChange={handleChange} className="form-input" min="0" disabled={status === 'submitting'} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="booth-additionalTable">Additional Table</label>
                                    <input id="booth-additionalTable" type="number" name="additionalTable" value={formData.additionalTable} onChange={handleChange} className="form-input" min="0" disabled={status === 'submitting'} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="booth-contactPerson">Name</label>
                                    <input id="booth-contactPerson" type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="form-input" placeholder="First and Last Name" required disabled={status === 'submitting'} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="booth-title">Title</label>
                                    <input id="booth-title" type="text" name="title" value={formData.title} onChange={handleChange} className="form-input" placeholder="e.g. Mr., Mrs., Manager" disabled={status === 'submitting'} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="booth-phone">Tel No</label>
                                    <input id="booth-phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input" placeholder="(555) 123-4567" required disabled={status === 'submitting'} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="booth-businessName">Business / Organization Name</label>
                                    <input id="booth-businessName" type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="form-input" placeholder="e.g. Acme Craft Goods" required disabled={status === 'submitting'} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="booth-postalAddress">Postal Address</label>
                                    <input id="booth-postalAddress" type="text" name="postalAddress" value={formData.postalAddress} onChange={handleChange} className="form-input" placeholder="Street address" disabled={status === 'submitting'} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="booth-city">City</label>
                                    <input id="booth-city" type="text" name="city" value={formData.city} onChange={handleChange} className="form-input" placeholder="City" disabled={status === 'submitting'} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="booth-email">Email Address</label>
                                    <input id="booth-email" type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" placeholder="you@example.com" required disabled={status === 'submitting'} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="booth-taxId">Tax ID</label>
                                    <input id="booth-taxId" type="text" name="taxId" value={formData.taxId} onChange={handleChange} className="form-input" placeholder="Tax ID number" disabled={status === 'submitting'} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="booth-vendorPermit">Vendor/Food Permit</label>
                                    <input id="booth-vendorPermit" type="text" name="vendorPermit" value={formData.vendorPermit} onChange={handleChange} className="form-input" placeholder="Permit number or status" disabled={status === 'submitting'} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="booth-date">Date</label>
                                    <input id="booth-date" type="date" name="date" value={formData.date} onChange={handleChange} className="form-input" disabled={status === 'submitting'} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="booth-description">Description of items to be sold</label>
                                <textarea id="booth-description" name="description" value={formData.description} onChange={handleChange} className="form-input" rows={4} placeholder="Please detail the items you plan to sell or display..." required disabled={status === 'submitting'}></textarea>
                            </div>

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
                                                <span>${(formData.additionalChair * 10).toFixed(2)}</span>
                                            </div>
                                        )}
                                        {formData.additionalTable > 0 && (
                                            <div className="booth-calc-row">
                                                <span>Additional Table x{formData.additionalTable}</span>
                                                <span>${(formData.additionalTable * 25).toFixed(2)}</span>
                                            </div>
                                        )}
                                        {selectedBooth.isSelfBooth && (
                                            <div className="booth-calc-row">
                                                <span>Permit Fee (Self Booth)</span>
                                                <span>$25.00</span>
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

                            {status === 'error' && (
                                <div className="booth-error" role="alert">
                                    An error occurred sending your application. Please try again or contact us directly.
                                </div>
                            )}

                            <label className="form-disclaimer-checkbox" htmlFor="booth-agreeTerms">
                                <input
                                    id="booth-agreeTerms"
                                    type="checkbox"
                                    checked={agreedToTerms}
                                    onChange={e => setAgreedToTerms(e.target.checked)}
                                    required
                                    disabled={status === 'submitting'}
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
                                    disabled={status === 'submitting'}
                                />
                                <span>I/We agree to abide by the terms and conditions established by Indo American Festivals, Inc. And confirm that we will fully comply with all requirements.</span>
                            </label>

                            <button type="submit" className={`btn btn-primary btn-ripple submit-btn${status === 'submitting' ? ' booth-submit-opacity' : ''}`} disabled={status === 'submitting' || !agreedToTerms || !agreedToCompliance}>
                                {status === 'submitting' ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
