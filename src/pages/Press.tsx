import { ConchIcon } from '../components/icons/CulturalIcons';
import './MediaGrid.css';

const DOCS_DATA = [
    { id: 1, title: '28th Edition Dushahra Press Release', date: 'August 15, 2026', size: '1.2 MB' },
    { id: 2, title: 'Media Alert: Ravan Dahan Schedule', date: 'September 10, 2026', size: '0.8 MB' },
    { id: 3, title: 'Sponsorship Prospectus 2026', date: 'April 5, 2026', size: '3.4 MB' },
];

export const Press = () => {
    return (
        <div className="media-page media-page-light">
            <div className="page-header page-header-dark">
                <div className="container">
                    <h1 className="page-title text-shimmer">Press & Media Coverage</h1>
                    <p className="page-subtitle">Official press releases and media resources</p>
                </div>
            </div>

            <div className="reading-container mt-spacing-8">
                <div className="flex-col-gap-4">
                    {DOCS_DATA.map((doc, i) => (
                        <div key={doc.id} className={`document-card card-shimmer mehndi-corner reveal reveal-delay-${(i + 1) * 100}`}>
                            <div className="doc-icon"><ConchIcon size={40} /></div>
                            <div className="doc-content">
                                <div className="doc-title">{doc.title}</div>
                                <div className="doc-meta">Published: {doc.date} &bull; PDF {doc.size}</div>
                            </div>
                            <a href="#" className="btn btn-secondary btn-ripple btn-sm" aria-label={`Download ${doc.title}`}>Download</a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
