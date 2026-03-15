
import { SPONSORS } from '../data/sponsors';
import { useVisibility } from '../hooks/useVisibility';
import './SponsorMarquee.css';

export const SponsorMarquee = () => {
    const { ref, isVisible } = useVisibility<HTMLElement>();
    const trackClass = `marquee-track${isVisible ? '' : ' marquee-paused'}`;

    return (
        <section className="marquee-section" ref={ref}>
            <div className="container marquee-header reveal">
                <h2 className="marquee-title text-shimmer">Proud Sponsors of Dushahra</h2>
                <p className="marquee-subtitle">Supported by our generous community partners</p>
            </div>

            <div className="marquee-container reveal reveal-delay-200" aria-label="Sponsor logos">
                <div className="marquee-row">
                    <div className={trackClass}>
                        {SPONSORS.map(sponsor => (
                            <img src={sponsor.imgUrl} alt={`${sponsor.name} logo`} className="sponsor-logo" key={`row1-${sponsor.id}`} loading="lazy" />
                        ))}
                        {SPONSORS.map(sponsor => (
                            <img src={sponsor.imgUrl} alt="" className="sponsor-logo" key={`row1-dup-${sponsor.id}`} loading="lazy" aria-hidden="true" />
                        ))}
                    </div>
                </div>
                <div className="marquee-row">
                    <div className={`${trackClass} marquee-track-reverse`} aria-hidden="true">
                        {SPONSORS.map(sponsor => (
                            <img src={sponsor.imgUrl} alt="" className="sponsor-logo" key={`row2-${sponsor.id}`} loading="lazy" />
                        ))}
                        {SPONSORS.map(sponsor => (
                            <img src={sponsor.imgUrl} alt="" className="sponsor-logo" key={`row2-dup-${sponsor.id}`} loading="lazy" />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
