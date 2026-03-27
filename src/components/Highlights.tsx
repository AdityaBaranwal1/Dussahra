import { Link } from 'react-router-dom';
import { FlameIcon, BowArrowIcon, BazaarIcon } from './icons/CulturalIcons';
import './Highlights.css';

export const Highlights = () => {
    return (
        <section className="highlights-section">
            <div className="container">
                <div className="highlights-header reveal">
                    <h2 className="section-title text-gradient">Experience the Magic of Dushahra</h2>
                    <p className="section-subtitle">
                        Join thousands of families in celebrating the triumph of good over evil. The 28th Edition brings tradition, food, and festivity to New Jersey.
                    </p>
                </div>

                <div className="highlights-grid">
                    <div className="highlight-card glass-card card-shimmer card-float reveal reveal-delay-100 mehndi-corner">
                        <img src="/images/ravan-effigy.jpg" alt="Ravan Effigy" className="highlight-image" loading="lazy" />
                        <div className="highlight-icon"><FlameIcon size={48} /></div>
                        <h3>Ravan Dahan</h3>
                        <p>Witness the spectacular burning of the 50-foot effigies, a majestic symbol of victory and light.</p>
                        <Link to="/events" className="highlight-link">View Schedule &rarr;</Link>
                    </div>

                    <div className="highlight-card glass-card card-shimmer card-float reveal reveal-delay-200 mehndi-corner">
                        <img src="/images/ram-leela.jpg" alt="Ram Leela" className="highlight-image" loading="lazy" />
                        <div className="highlight-icon"><BowArrowIcon size={48} /></div>
                        <h3>Ram Leela</h3>
                        <p>Enjoy the dramatic folk re-enactment of the life of Lord Rama, performed by talented local artists.</p>
                        <Link to="/events" className="highlight-link">Learn More &rarr;</Link>
                    </div>

                    <div className="highlight-card glass-card card-shimmer card-float reveal reveal-delay-300 mehndi-corner">
                        <img src="/images/cultural-programs.jpg" alt="Cultural Programs" className="highlight-image" loading="lazy" />
                        <div className="highlight-icon"><BazaarIcon size={48} /></div>
                        <h3>Meena Bazaar</h3>
                        <p>Shop for traditional clothing, jewelry, and crafts, and taste incredible food from our diverse vendors.</p>
                        <Link to="/booth-booking" className="highlight-link">Become a Vendor &rarr;</Link>
                    </div>
                </div>
            </div>
        </section>
    );
};
