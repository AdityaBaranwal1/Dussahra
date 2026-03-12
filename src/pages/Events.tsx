import './Events.css';
import { GhungrooIcon, MudraIcon, BowArrowIcon, FlameIcon, ClockIcon, LocationPinIcon } from '../components/icons/CulturalIcons';

const EVENT_DATA = [
    {
        id: 1,
        title: 'Meena Bazaar',
        time: '1:00 PM - 8:00 PM',
        location: 'Main Grounds',
        description: 'A vibrant marketplace featuring traditional Indian clothing, exquisite jewelry, handicrafts, and diverse food stalls offering authentic regional delicacies from across India.',
        icon: <GhungrooIcon size={56} />
    },
    {
        id: 2,
        title: 'Cultural Performances',
        time: '2:00 PM - 5:00 PM',
        location: 'Center Stage',
        description: 'Enjoy a spectacular lineup of classical, folk, and contemporary Indian dance performances by talented troupes from the local community and beyond.',
        icon: <MudraIcon size={56} />
    },
    {
        id: 3,
        title: 'Ram Leela',
        time: '5:30 PM - 7:00 PM',
        location: 'Center Stage',
        description: 'A captivating dramatic folk re-enactment of the epic Ramayana. Watch the legendary tale of Lord Rama unfold through dramatic storytelling and elaborate costumes.',
        icon: <BowArrowIcon size={56} />
    },
    {
        id: 4,
        title: 'Ravan Dahan',
        time: '7:30 PM',
        location: 'Open Field',
        description: 'The grand finale of Dushahra. Join thousands of spectators to witness the spectacular burning of the 50-foot effigy of Ravana, symbolizing the triumph of good over evil.',
        icon: <FlameIcon size={56} />
    }
];

export const Events = () => {
    return (
        <div className="events-page">
            <div className="page-header">
                <div className="container">
                    <h1 className="page-title">Event Schedule</h1>
                    <p className="page-subtitle">October 10th, 2026 | Rain Date: October 24th</p>
                </div>
            </div>

            <div className="container event-container">
                <div className="events-grid">
                    {EVENT_DATA.map((event, index) => (
                        <div className={`event-card glass-panel card-shimmer reveal reveal-delay-${(index % 3 + 1) * 100}`} key={event.id}>
                            <div className="event-icon">{event.icon}</div>
                            <div className="event-details">
                                <h3 className="event-title">{event.title}</h3>
                                <div className="event-meta">
                                    <span className="event-tag"><ClockIcon size={16} /> {event.time}</span>
                                    <span className="event-tag"><LocationPinIcon size={16} /> {event.location}</span>
                                </div>
                                <p className="event-desc">{event.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
