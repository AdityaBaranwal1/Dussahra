import { EmberParticles } from '../components/EmberParticles';
import './MediaGrid.css';

const PHOTO_DATA = [
    { id: 1, url: 'https://www.dushahra.com/wp-content/uploads/2022/10/2022-Dushahra-Festiva-62-scaled.jpg', alt: 'Festival Crowd' },
    { id: 2, url: 'https://www.dushahra.com/wp-content/uploads/2023/04/2022-Dushahra-Festiva-513-scaled-1.webp', alt: 'Ram Leela Performance' },
    { id: 3, url: 'https://www.dushahra.com/wp-content/uploads/2022/10/2022-Dushahra-Festiva-109-scaled.jpg', alt: 'Decorations' },
    { id: 4, url: 'https://www.dushahra.com/wp-content/uploads/2022/10/2022-Dushahra-Festiva-55-scaled.jpg', alt: 'Food Stalls' },
    { id: 5, url: 'https://www.dushahra.com/wp-content/uploads/2023/04/2022-Dushahra-Festiva-593-scaled-1.webp', alt: 'Ravan Dahan Setup' },
    { id: 6, url: 'https://www.dushahra.com/wp-content/uploads/2022/10/2022-Dushahra-Festiva-27-1-scaled.jpg', alt: 'Community Gather' },
    { id: 7, url: 'https://www.dushahra.com/wp-content/uploads/2022/10/2022-Dushahra-Festiva-22-1-scaled.jpg', alt: 'Festivities' },
    { id: 8, url: 'https://www.dushahra.com/wp-content/uploads/2022/10/2022-Dushahra-Festiva-225-scaled.jpg', alt: 'Evening Program' },
    { id: 9, url: 'https://www.dushahra.com/wp-content/uploads/2022/10/2022-Dushahra-Festiva-385-scaled.jpg', alt: 'Main Wide Shot' }
];

export const Photos = () => {
    return (
        <div className="media-page" style={{ position: 'relative' }}>
            <EmberParticles density="low" intensity={0.4} style={{ zIndex: 1 }} />
            <div className="page-header" style={{ position: 'relative', zIndex: 2 }}>
                <div className="container">
                    <h1 className="page-title text-shimmer">Photo Gallery</h1>
                    <p className="page-subtitle">A look back at our magnificent celebrations</p>
                </div>
            </div>

            <div className="container" style={{ marginTop: 'var(--spacing-8)', position: 'relative', zIndex: 2 }}>
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
