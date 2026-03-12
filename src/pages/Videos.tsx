import './MediaGrid.css';

const VIDEO_DATA = [
    { id: 1, title: 'Dushahra 27th Edition Highlights', ytId: 'dQw4w9WgXcQ' },
    { id: 2, title: 'Ram Leela Performance 2025', ytId: 'dQw4w9WgXcQ' },
    { id: 3, title: 'Ravan Dahan 2025 Full Video', ytId: 'dQw4w9WgXcQ' },
    { id: 4, title: 'Community Interviews', ytId: 'dQw4w9WgXcQ' },
];

export const Videos = () => {
    return (
        <div className="media-page" style={{ position: 'relative' }}>
            <div className="page-header" style={{ position: 'relative', zIndex: 2 }}>
                <div className="container">
                    <h1 className="page-title text-shimmer">Video Highlights</h1>
                    <p className="page-subtitle">Watch the magic of the festival unfold</p>
                </div>
            </div>

            <div className="container" style={{ marginTop: 'var(--spacing-8)', position: 'relative', zIndex: 2 }}>
                <div className="media-grid">
                    {VIDEO_DATA.map((video, i) => (
                        <div key={video.id} className={`media-card reveal reveal-delay-${(i % 3 + 1) * 100}`} style={{ padding: '0', backgroundColor: 'var(--color-bg-dark)' }}>
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${video.ytId}`}
                                title={video.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ position: 'absolute', top: 0, left: 0 }}
                            ></iframe>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
