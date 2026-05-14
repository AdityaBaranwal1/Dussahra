import { SPONSORS } from '../data/sponsors';
import { PageHeader } from '../components/PageHeader';
import './Sponsors.css';

export const Sponsors = () => {
    return (
        <div className="sponsors-page">
            <PageHeader
                title="Our Sponsors"
                subtitle="We deeply appreciate the unified support of all our community partners."
                templeArch
                dark
                shimmer
            />

            <div className="container sponsors-container">
                <section className="sponsor-tier reveal">
                    <div className="sponsor-grid grid-medium reveal reveal-delay-200">
                        {SPONSORS.map(s => (
                            <div key={s.id} className="sponsor-card glass-card card-shimmer sponsor-card-inner">
                                <img src={s.imgUrl} alt={s.name} className="sponsor-card-img" loading="lazy" />
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};
