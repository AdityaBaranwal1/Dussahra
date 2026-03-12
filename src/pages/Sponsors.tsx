import './Sponsors.css';

const SPONSORS_DATA = [
    { id: 1, name: 'Sponsor 1', imgUrl: '/sponsors/05.png' },
    { id: 2, name: 'Chowpatty', imgUrl: '/sponsors/Chowpatty-New-Logo-2048x859.webp' },
    { id: 3, name: 'EBC Radio', imgUrl: '/sponsors/EBC-Radio-1024x569.png' },
    { id: 4, name: 'Grafine', imgUrl: '/sponsors/Grafine-975x1024.jpeg' },
    { id: 5, name: 'ITV', imgUrl: '/sponsors/ITV.jpg' },
    { id: 6, name: 'PNC Bank', imgUrl: '/sponsors/PNC-Bank-1024x280.png' },
    { id: 7, name: 'Royal Albert', imgUrl: '/sponsors/RoyalAlbert.jpeg' },
    { id: 8, name: 'Sai', imgUrl: '/sponsors/Sai.jpg' },
    { id: 9, name: 'Samosa Factory', imgUrl: '/sponsors/SamosaFactoryUSA.jpeg' },
    { id: 10, name: 'Sewa', imgUrl: '/sponsors/Sewa-Logo-1.jpeg' },
    { id: 11, name: 'Star Tours', imgUrl: '/sponsors/Star-Tours-Logo_Only-1024x512.jpg' },
    { id: 12, name: 'Suhag Jewelers', imgUrl: '/sponsors/Suhag-Jewelwers.jpg' },
    { id: 13, name: 'TV Asia', imgUrl: '/sponsors/TV-Asia-img.jpg' },
    { id: 14, name: 'Sponsor 14', imgUrl: '/sponsors/Untitled-10.jpg' },
    { id: 15, name: 'Sponsor 15', imgUrl: '/sponsors/Untitled-11-1.jpg' },
    { id: 16, name: 'Sponsor 16', imgUrl: '/sponsors/Untitled-13-1.jpg' },
    { id: 17, name: 'Sponsor 17', imgUrl: '/sponsors/Untitled-18.jpg' },
    { id: 18, name: 'Sponsor 18', imgUrl: '/sponsors/Untitled-2-1.jpg' },
    { id: 19, name: 'Sponsor 19', imgUrl: '/sponsors/Untitled-2.jpg' },
    { id: 20, name: 'Sponsor 20', imgUrl: '/sponsors/Untitled-30.jpg' },
    { id: 21, name: 'Sponsor 21', imgUrl: '/sponsors/Untitled-35.jpg' },
    { id: 22, name: 'Sponsor 22', imgUrl: '/sponsors/Untitled-38.jpg' },
    { id: 23, name: 'Sponsor 23', imgUrl: '/sponsors/Untitled-4.jpg' },
    { id: 24, name: 'Sponsor 24', imgUrl: '/sponsors/Untitled-45.jpg' },
    { id: 25, name: 'Sponsor 25', imgUrl: '/sponsors/Untitled-47.jpg' },
    { id: 26, name: 'Sponsor 26', imgUrl: '/sponsors/Untitled-48.jpg' },
    { id: 27, name: 'Sponsor 27', imgUrl: '/sponsors/Untitled-51.jpg' },
    { id: 28, name: 'Sponsor 28', imgUrl: '/sponsors/Untitled-52.jpg' },
    { id: 29, name: 'Sponsor 29', imgUrl: '/sponsors/Untitled-53-1.jpg' },
    { id: 30, name: 'Sponsor 30', imgUrl: '/sponsors/Untitled-54.jpg' },
    { id: 31, name: 'Sponsor 31', imgUrl: '/sponsors/Untitled-6.jpg' },
    { id: 32, name: 'Sponsor 32', imgUrl: '/sponsors/Untitled-8-1.jpg' },
    { id: 33, name: 'WhatsApp 1', imgUrl: '/sponsors/WhatsApp-Image-2024-10-04-at-12.30.03-PM-768x513.jpeg' },
    { id: 34, name: 'WhatsApp 2', imgUrl: '/sponsors/WhatsApp-Image-2024-10-04-at-12.31.27-PM.jpeg' },
    { id: 35, name: 'Logo 1', imgUrl: '/sponsors/logo-1.jpg' },
    { id: 36, name: 'Logo 2', imgUrl: '/sponsors/logo-2.jpg' },
    { id: 37, name: 'Logo 3', imgUrl: '/sponsors/logo-3.jpg' },
    { id: 38, name: 'Nav', imgUrl: '/sponsors/nav.jpg' },
    { id: 39, name: 'NJSCA', imgUrl: '/sponsors/njsca-01-1024x1024-1.webp' },
    { id: 40, name: 'Parikh', imgUrl: '/sponsors/parikh-media.jpg' }
];

export const Sponsors = () => {
    return (
        <div className="sponsors-page">
            <div className="page-header temple-arch">
                <div className="container">
                    <h1 className="page-title text-shimmer">Our Sponsors</h1>
                    <p className="page-subtitle">We deeply appreciate the unified support of all our community partners.</p>
                </div>
            </div>

            <div className="container" style={{ padding: '4rem 0' }}>
                <section className="sponsor-tier reveal">
                    <div className="sponsor-grid grid-medium reveal reveal-delay-200">
                        {SPONSORS_DATA.map(s => (
                            <div key={s.id} className="sponsor-card card card-shimmer" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <img src={s.imgUrl} alt={s.name} style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain' }} />
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};
