import { useState, useMemo } from 'react';
import { CheckmarkIcon, AlertIcon, PhoneIcon, PaymentIcon, ShieldCheckIcon } from '../components/icons/CulturalIcons';
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
    const [zelleData, setZelleData] = useState({
        senderName: '',
        confirmationCode: '',
        screenshot: null as File | null,
    });
    const [zelleStatus, setZelleStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

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
            const SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL';

            if (SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL') {
                setTimeout(() => setStatus('success'), 1200);
                return;
            }

            await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({ form_type: 'Booth Request', ...formData, calculatedTotal })
            });

            setStatus('success');
        } catch (error) {
            setStatus('error');
        }
    };

    const handleZelleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setZelleStatus('submitting');

        try {
            const SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL';

            if (SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL') {
                setTimeout(() => setZelleStatus('success'), 1200);
                return;
            }

            await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({
                    form_type: 'Zelle Verification',
                    businessName: formData.businessName,
                    senderName: zelleData.senderName,
                    confirmationCode: zelleData.confirmationCode,
                    amount: calculatedTotal,
                })
            });

            setZelleStatus('success');
        } catch {
            setZelleStatus('idle');
        }
    };

    const resetAll = () => {
        setStatus('idle');
        setZelleStatus('idle');
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
                    <p className="page-subtitle">Reserve your space at the 28th Annual Dushahra Festival</p>
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
                            <div key={tier.id} className="pricing-card card card-shimmer mehndi-corner">
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

                    <div className="pricing-header reveal" style={{ marginTop: '4rem' }}>
                        <h2><span className="text-gradient">Food Vendor Rates (Vegetarian Only)</span></h2>
                    </div>
                    <div className="pricing-cards reveal reveal-delay-200">
                        {PRICING_FOOD.map(tier => (
                            <div key={tier.id} className="pricing-card card card-shimmer mehndi-corner">
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

                <div className="disclaimers-section card card-shimmer reveal" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Rules, Disclaimers & Cancellation Policy</h3>

                    <div className="disclaimer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        <div className="disclaimer-block">
                                <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><PhoneIcon size={18} /> Contact Persons</strong>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                                Chanchal Gupta: 732-360-2059<br />
                                Raj Mittal: 732-423-4619<br />
                                Shalini Chhabra: 732-915-5634
                            </p>
                        </div>

                        <div className="disclaimer-block">
                                <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><CheckmarkIcon size={18} /> Booking Confirmation</strong>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                                Booking will be confirmed after receiving payment. For quick confirmation Zelle: <br /><strong>dushahra.usa@gmail.com</strong>
                            </p>
                        </div>

                        <div className="disclaimer-block">
                                <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><ShieldCheckIcon size={18} /> Organization Setup</strong>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                                Indo-American Festivals, Inc.<br />
                                40 La Valencia Road, Old Bridge, NJ 08857 USA<br />
                                Phone: (732)-444-8381, (732)-360-2059<br />
                                Fax: (732)-360-2545<br />
                                Email: Contact@dushahra.com
                            </p>
                        </div>
                    </div>

                    <div className="cancellation-policy" style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: 'var(--color-success-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-success-border)' }}>
                        <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--color-accent)' }}><AlertIcon size={18} /> Cancellation Policy</strong>
                        <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>All cancellations must be in writing.</p>
                        <ul style={{ fontSize: '0.9rem', marginLeft: '1.5rem', color: 'var(--color-text-muted)' }}>
                            <li>If canceled before July 31st, a full refund will be issued.</li>
                            <li>From August 1 to September 10, 2026, a 50% refund will be issued based on the full published price of the booth. No refund will be issued thereafter.</li>
                            <li>If the event is moved to the rain date (October 24th), no refunds will be given.</li>
                            <li>No refunds will be issued after September 10, 2026, or due to rain, rain date changes, or any act of God.</li>
                        </ul>
                    </div>
                </div>

                <div className="booking-form-section card card-shimmer mehndi-corner reveal">
                    <div className="form-header">
                        <h2>Vendor Application Form</h2>
                        <p>Please fill out your details below. Once submitted, our team will review and contact you with Zelle payment instructions.</p>
                    </div>

                    {status === 'success' || status === 'zelle-finalized' ? (
                        <div className="form-success-message" style={{ padding: '2rem', textAlign: 'left', backgroundColor: 'var(--color-bg-base)', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ textAlign: 'center', marginBottom: '1rem' }}><CheckmarkIcon size={48} /></div>
                            <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Application Successfully Received!</h3>

                            <div className="zelle-instructions" style={{ backgroundColor: 'var(--color-bg-surface)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                                <h4 style={{ color: 'var(--color-secondary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                                    <PaymentIcon size={24} /> Zelle Payment Instructions
                                </h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    <li><strong>Recipient Name:</strong> Indo-American Festivals, Inc.</li>
                                    <li><strong>Zelle Email:</strong> dushahra.usa@gmail.com</li>
                                    <li><strong>Amount Due:</strong> ${calculatedTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</li>
                                    <li style={{ color: 'var(--color-accent)', padding: '0.75rem', backgroundColor: 'var(--color-success-bg)', borderRadius: '6px' }}>
                                        <strong><AlertIcon size={14} /> Important Memo:</strong> You MUST include your Business Name in the Zelle memo field so we can verify your booking.
                                    </li>
                                </ul>
                                <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                                    Note: Your booth is not reserved until the transfer is manually verified by our staff.
                                </p>
                            </div>

                            {zelleStatus === 'success' ? (
                                <div style={{ textAlign: 'center', marginTop: '2rem', padding: '2rem', backgroundColor: 'var(--color-success-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-success-border)' }}>
                                    <div style={{ marginBottom: '1rem' }}><CheckmarkIcon size={40} /></div>
                                    <h3 style={{ marginBottom: '0.5rem' }}>Thank You!</h3>
                                    <p style={{ color: 'var(--color-text-muted)' }}>Your booking and payment verification have been submitted. Our team will verify and confirm your booth reservation.</p>
                                                    <button className="btn btn-secondary btn-ripple" style={{ marginTop: '1.5rem' }} onClick={resetAll}>Submit Another Application</button>
                                </div>
                            ) : (
                                <form onSubmit={handleZelleSubmit} style={{ marginTop: '2rem' }}>
                                    <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>Payment Verification</h4>

                                    <div className="form-group">
                                        <label className="form-label">Zelle Sender Name</label>
                                        <input type="text" className="form-input" placeholder="Enter the name on your Zelle account" value={zelleData.senderName} onChange={e => setZelleData({ ...zelleData, senderName: e.target.value })} required disabled={zelleStatus === 'submitting'} />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Zelle Confirmation Screenshot</label>
                                        <input type="file" className="form-input" accept="image/*" onChange={e => setZelleData({ ...zelleData, screenshot: e.target.files?.[0] || null })} disabled={zelleStatus === 'submitting'} />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Confirmation Code</label>
                                        <input type="text" className="form-input" placeholder="Enter your Zelle confirmation/transaction code" value={zelleData.confirmationCode} onChange={e => setZelleData({ ...zelleData, confirmationCode: e.target.value })} required disabled={zelleStatus === 'submitting'} />
                                    </div>

                                    <button type="submit" className="btn btn-primary btn-ripple submit-btn" style={{ opacity: zelleStatus === 'submitting' ? 0.7 : 1 }} disabled={zelleStatus === 'submitting'}>
                                        {zelleStatus === 'submitting' ? 'Submitting...' : 'Finalize Booking'}
                                    </button>
                                </form>
                            )}
                        </div>
                    ) : (
                        <form className="booking-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Select Booth</label>
                                <select name="boothType" value={formData.boothType} onChange={handleChange} className="form-input" required disabled={status === 'submitting'}>
                                    <option value="">Select a booth type...</option>
                                    {PRICING_GENERAL.map(t => <option key={t.id} value={`${t.type} - ${t.size}`}>{t.type} - {t.size} ({t.price})</option>)}
                                    <option disabled>--- Food Vendors ---</option>
                                    <option value="Food/Snacks Booth">Food/Snacks Booth ($3500)</option>
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Additional Chair</label>
                                    <input type="number" name="additionalChair" value={formData.additionalChair} onChange={handleChange} className="form-input" min="0" disabled={status === 'submitting'} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Additional Table</label>
                                    <input type="number" name="additionalTable" value={formData.additionalTable} onChange={handleChange} className="form-input" min="0" disabled={status === 'submitting'} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Name</label>
                                    <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="form-input" placeholder="First and Last Name" required disabled={status === 'submitting'} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Title</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="form-input" placeholder="e.g. Mr., Mrs., Manager" disabled={status === 'submitting'} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Tel No</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input" placeholder="(555) 123-4567" required disabled={status === 'submitting'} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Business / Organization Name</label>
                                    <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="form-input" placeholder="e.g. Acme Craft Goods" required disabled={status === 'submitting'} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Postal Address</label>
                                    <input type="text" name="postalAddress" value={formData.postalAddress} onChange={handleChange} className="form-input" placeholder="Street address" disabled={status === 'submitting'} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">City</label>
                                    <input type="text" name="city" value={formData.city} onChange={handleChange} className="form-input" placeholder="City" disabled={status === 'submitting'} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" placeholder="you@example.com" required disabled={status === 'submitting'} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Tax ID</label>
                                    <input type="text" name="taxId" value={formData.taxId} onChange={handleChange} className="form-input" placeholder="Tax ID number" disabled={status === 'submitting'} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Vendor/Food Permit</label>
                                    <input type="text" name="vendorPermit" value={formData.vendorPermit} onChange={handleChange} className="form-input" placeholder="Permit number or status" disabled={status === 'submitting'} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Date</label>
                                    <input type="date" name="date" value={formData.date} onChange={handleChange} className="form-input" disabled={status === 'submitting'} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description of items to be sold</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} className="form-input" rows={4} placeholder="Please detail the items you plan to sell or display..." required disabled={status === 'submitting'}></textarea>
                            </div>

                            <div className="calculations-section" style={{ padding: '1.5rem', backgroundColor: 'var(--color-bg-base)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', marginBottom: 'var(--spacing-4)' }}>
                                <h4 style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }}>Calculations</h4>
                                {selectedBooth ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.95rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>Booth ({formData.boothType})</span>
                                            <span>${selectedBooth.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                        {formData.additionalChair > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span>Additional Chair x{formData.additionalChair}</span>
                                                <span>${(formData.additionalChair * 10).toFixed(2)}</span>
                                            </div>
                                        )}
                                        {formData.additionalTable > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span>Additional Table x{formData.additionalTable}</span>
                                                <span>${(formData.additionalTable * 25).toFixed(2)}</span>
                                            </div>
                                        )}
                                        {selectedBooth.isSelfBooth && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span>Permit Fee (Self Booth)</span>
                                                <span>$25.00</span>
                                            </div>
                                        )}
                                        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '0.5rem 0' }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.15rem', color: 'var(--color-primary)' }}>
                                            <span>Total</span>
                                            <span>${calculatedTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Select a booth to see pricing breakdown.</p>
                                )}
                            </div>

                            {status === 'error' && (
                                <div style={{ color: 'var(--color-accent)', marginBottom: '1rem', fontWeight: 600 }}>
                                    An error occurred sending your application. Please try again or contact us directly.
                                </div>
                            )}

                            <button type="submit" className="btn btn-primary btn-ripple submit-btn" style={{ opacity: status === 'submitting' ? 0.7 : 1 }} disabled={status === 'submitting'}>
                                {status === 'submitting' ? 'Submitting...' : 'Submit Application'}
                            </button>
                            <p className="form-disclaimer">By signing this document, I confirm that I have read and agree to the attached rules, terms and conditions and understand that Indo American Festivals, Inc. is not responsible for loss, theft or damage of my property. I will abide by the terms and conditions of Indo American Festivals, Inc. and the rules and regulations of Edison Township New Jersey.</p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
