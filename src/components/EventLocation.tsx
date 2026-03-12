import './EventLocation.css';
import { LocationPinIcon } from './icons/CulturalIcons';

export const EventLocation = () => {
    return (
        <section className="event-location-section">
            <div className="location-container">
                <div className="location-header reveal">
                    <h2 className="location-title text-shimmer">Event Locations</h2>
                </div>

                <div className="location-card card-shimmer reveal reveal-delay-200">
                    <div className="location-icon-wrapper">
                        <div className="icon-pulse"></div>
                        <LocationPinIcon size={32} />
                    </div>

                    <div className="location-details">
                        <h3 className="location-state">NEW JERSEY</h3>
                        <p className="location-address">
                            Lake Papaianni Park, 100 Municipal Blvd, Edison,<br />
                            NJ 08817
                        </p>
                        <a
                            href="https://goo.gl/maps/example"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="view-location-btn btn-ripple"
                        >
                            View Location
                        </a>
                    </div>
                </div>
            </div>

            {/* Decorative festive overlay elements */}
            <div className="festive-decor-left"></div>
            <div className="festive-decor-right"></div>
        </section>
    );
};
