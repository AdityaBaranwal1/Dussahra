import './MediaGrid.css';

const VIDEO_DATA = [
    { id: 1, title: 'Dushahra 27th Edition Highlights', ytId: 'dQw4w9WgXcQ' },
    { id: 2, title: 'Ram Leela Performance 2025', ytId: 'dQw4w9WgXcQ' },
    { id: 3, title: 'Ravan Dahan 2025 Full Video', ytId: 'dQw4w9WgXcQ' },
    { id: 4, title: 'Community Interviews', ytId: 'dQw4w9WgXcQ' },
];

export const Videos = () => {
    return (
        <div className="media-page pos-relative">
            <div className="page-header z-2">
                <div className="container">
                    <h1 className="page-title text-shimmer">Video Highlights</h1>
                    <p className="page-subtitle">Watch the magic of the festival unfold</p>
                </div>
            </div>

            <div className="container mt-spacing-8 z-2">
                <div className="media-grid">
                    {VIDEO_DATA.map((video, i) => (
                        <div key={video.id} className={`media-card video-card-inner reveal reveal-delay-${(i % 3 + 1) * 100}`}>
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${video.ytId}`}
                                title={video.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="video-iframe"
                            ></iframe>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
