import { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import './Events.css';
import { GhungrooIcon, MudraIcon, BowArrowIcon, FlameIcon, ClockIcon, LocationPinIcon } from '../components/icons/CulturalIcons';
import { EVENT_INFO } from '../data/event-info';
import { RamasArrow } from '../game/RamasArrow';

const ArrowDash = lazy(() => import('../game/ArrowDash/ArrowDash').then(m => ({ default: m.ArrowDash })));

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

const SECRET_WORD = 'rama';

export const Events = () => {
    const [gameOpen, setGameOpen] = useState(false);
    const [bowClicks, setBowClicks] = useState(0);
    const [typedKeys, setTypedKeys] = useState('');

    // Easter egg: type "rama" anywhere on the page
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (gameOpen) return;
            const next = (typedKeys + e.key.toLowerCase()).slice(-SECRET_WORD.length);
            setTypedKeys(next);
            if (next === SECRET_WORD) {
                setGameOpen(true);
                setTypedKeys('');
            }
        };
        window.addEventListener('keypress', handleKeyPress);
        return () => window.removeEventListener('keypress', handleKeyPress);
    }, [typedKeys, gameOpen]);

    // Easter egg: click bow icon 3 times
    const handleBowClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        const next = bowClicks + 1;
        if (next >= 3) {
            setGameOpen(true);
            setBowClicks(0);
        } else {
            setBowClicks(next);
            // Reset after 2 seconds of no clicks
            setTimeout(() => setBowClicks(0), 2000);
        }
    }, [bowClicks]);

    return (
        <div className="events-page">
            {gameOpen && (
                <Suspense fallback={null}>
                    <RamasArrow onClose={() => setGameOpen(false)} />
                </Suspense>
            )}

            <div className="page-header">
                <div className="container">
                    <h1 className="page-title">Event Schedule</h1>
                    <p className="page-subtitle">{EVENT_INFO.eventDateDisplay} | Rain Date: {EVENT_INFO.rainDate}</p>
                </div>
            </div>

            <div className="container event-container">
                <div className="events-grid">
                    {EVENT_DATA.map((event, index) => (
                        <div key={event.id}>
                            <div className={`event-card glass-card card-shimmer reveal reveal-delay-${(index % 3 + 1) * 100}`}>
                                <div
                                    className="event-icon"
                                    onClick={event.id === 3 ? handleBowClick : undefined}
                                    style={event.id === 3 ? { cursor: 'pointer' } : undefined}
                                    title={event.id === 3 ? (bowClicks > 0 ? '...' : undefined) : undefined}
                                >
                                    {event.icon}
                                </div>
                                <div className="event-details">
                                    <h2 className="event-title">{event.title}</h2>
                                    <div className="event-meta">
                                        <span className="event-tag"><ClockIcon size={16} /> {event.time}</span>
                                        <span className="event-tag"><LocationPinIcon size={16} /> {event.location}</span>
                                    </div>
                                    <p className="event-desc">{event.description}</p>
                                </div>
                            </div>

                            {/* Inline mini-game after the 2nd event card */}
                            {index === 1 && (
                                <div className="arrow-dash-slot reveal reveal-delay-200">
                                    <Suspense fallback={null}>
                                        <ArrowDash />
                                    </Suspense>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
