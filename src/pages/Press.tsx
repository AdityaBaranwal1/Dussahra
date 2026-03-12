import { ConchIcon } from '../components/icons/CulturalIcons';
import './MediaGrid.css';

const DOCS_DATA = [
    { id: 1, title: '28th Edition Dushahra Press Release', date: 'August 15, 2026', size: '1.2 MB' },
    { id: 2, title: 'Media Alert: Ravan Dahan Schedule', date: 'September 10, 2026', size: '0.8 MB' },
    { id: 3, title: 'Sponsorship Prospectus 2026', date: 'April 5, 2026', size: '3.4 MB' },
];

export const Press = () => {
    return (
        <div className="media-page" style={{ backgroundColor: 'var(--color-bg-base)' }}>
            <div className="page-header" style={{ backgroundColor: 'var(--color-bg-dark)' }}>
                <div className="container">
                    <h1 className="page-title text-shimmer">Press & Media Coverage</h1>
                    <p className="page-subtitle">Official press releases and media resources</p>
                </div>
            </div>

            <div className="container" style={{ marginTop: 'var(--spacing-8)', maxWidth: '900px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                    {DOCS_DATA.map((doc, i) => (
                        <div key={doc.id} className={`document-card card-shimmer mehndi-corner reveal reveal-delay-${(i + 1) * 100}`}>
                            <div className="doc-icon"><ConchIcon size={40} /></div>
                            <div style={{ flexGrow: 1 }}>
                                <div className="doc-title">{doc.title}</div>
                                <div className="doc-meta">Published: {doc.date} &bull; PDF {doc.size}</div>
                            </div>
                            <a href="#" className="btn btn-secondary btn-ripple" style={{ padding: '0.5rem 1rem' }}>Download</a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
