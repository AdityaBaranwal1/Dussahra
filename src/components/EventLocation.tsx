import { Link } from 'react-router-dom';
import { EVENT_INFO } from '../data/event-info';
import './EventLocation.css';

export const EventLocation = () => {
    return (
        <section className="event-location-section" data-ember-zone>
            <div className="location-zone-frame">
                <div className="location-content reveal">
                    <span className="location-eyebrow">The Sacred Ground</span>
                    <h2 className="location-title">
                        {EVENT_INFO.location.name}
                    </h2>
                    <p className="location-subtitle">
                        Join 10,000 souls under the open sky as the effigy of evil
                        is consumed by sacred fire.
                    </p>
                    <p className="location-address">
                        {EVENT_INFO.location.address}
                    </p>
                    <div className="location-ctas reveal reveal-delay-200">
                        <Link to="/booth-booking" className="btn btn-primary btn-ripple">
                            Book a Booth
                        </Link>
                        <Link to="/volunteer" className="btn btn-secondary btn-ripple">
                            Volunteer With Us
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};
