import './MediaGrid.css';

const PHOTO_DATA = [
    { id: 1, url: '/images/gallery/DUSHAHRA-PHOTO-ONE-RAVAN.jpg', alt: 'Ravan Effigy at Dussehra Festival' },
    { id: 2, url: '/images/gallery/Ram_Lakshman_SitaHanuman_Pic-1.jpg', alt: 'Ram, Lakshman, Sita & Hanuman' },
    { id: 3, url: '/images/gallery/photo2.webp', alt: 'Ram Leela Performance' },
    { id: 4, url: '/images/gallery/484000207_1049737137199351_7671589044877751254_n.jpg', alt: 'Community Celebration' },
    { id: 5, url: '/images/gallery/photo5.webp', alt: 'Ravan Dahan Setup' },
    { id: 6, url: '/images/gallery/506634869_3420424851431176_4775225427117286899_n.jpg', alt: 'Festival Moments' },
    { id: 7, url: '/images/gallery/72065020_1595374497269563_2043957494304210944_n.jpg', alt: 'Cultural Program' },
    { id: 8, url: '/images/gallery/photo8.jpg', alt: 'Festival Highlights' },
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
