import './MediaGrid.css';

const PHOTO_DATA = [
    { id: 1, url: '/images/gallery/photo2.webp', alt: 'Ram Leela Performance' },
    { id: 2, url: '/images/gallery/photo3.jpg', alt: 'Festival Celebrations' },
    { id: 3, url: '/images/gallery/photo4.jpg', alt: 'Community Gathering' },
    { id: 4, url: '/images/gallery/photo5.webp', alt: 'Ravan Dahan Setup' },
    { id: 5, url: '/images/gallery/photo6.jpg', alt: 'Festivities' },
    { id: 6, url: '/images/gallery/photo7.jpg', alt: 'Evening Program' },
    { id: 7, url: '/images/gallery/photo8.jpg', alt: 'Past Celebrations' },
];

export const Photos = () => {
    return (
        <div className="media-page pos-relative">
            <div className="page-header z-2">
                <div className="container">
                    <h1 className="page-title text-shimmer">Photo Gallery</h1>
                    <p className="page-subtitle">A look back at our magnificent celebrations</p>
                </div>
            </div>

            <div className="container mt-spacing-8 z-2">
                <div className="media-grid">
                    {PHOTO_DATA.map((photo, i) => (
                        <div key={photo.id} className={`media-card img-parallax-hover reveal reveal-delay-${(i % 4 + 1) * 100}`}>
                            <img src={photo.url} alt={photo.alt} className="media-thumbnail" loading="lazy" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
