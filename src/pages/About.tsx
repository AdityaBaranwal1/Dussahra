import { LotusIcon, OmIcon } from '../components/icons/CulturalIcons';
import './About.css';

export const About = () => {
    return (
        <div className="about-page">
            <div className="page-header temple-arch">
                <div className="container">
                    <h1 className="page-title text-shimmer">About Us</h1>
                    <p className="page-subtitle">Preserving Cultural Heritage in New Jersey</p>
                </div>
            </div>

            <div className="reading-container about-content glass-panel lotus-watermark mt-spacing-8">
                <section className="about-section reveal reveal-left">
                    <h2><span className="text-gradient">How it Started</span></h2>
                    <p>
                        Indo- American Festivals (IAF) was formed by the late Mr. Mangal Gupta in the year 1999 with a few members.
                    </p>
                    <p>
                        The purpose of forming the IAF was to celebrate the Dushahra festival. There were several organizations in the Tri-State that were celebrating Holi, Diwali, Janmashtami, and other festivals but none were celebrating Dushahra Festival. Mangal ji was planning to celebrate Dushahra for a long time and many hurdles were coming in the way because of the peculiarity of this festival as it consisted burning of a Ravan Effigy. Burning a 25'-30' Ravan effigy in an open ground in the US is important as it creates a severe fire hazard and most towns do not permit burning that in their towns.
                    </p>
                    <p>
                        After working hard and applying in several townships, finally, Mangal ji got permission to celebrate Dushahra in East Brunswick Township. His long-time dream came true and finally, we had the first Dushahra Festival on October 9, 1999, and his old dream has become a reality. The First Dushahra Festival was inaugurated by then NJ Governor, Christine Wittman.
                    </p>
                </section>

                <div className="divider-mandala-spin reveal">
                    <LotusIcon size={32} />
                </div>

                <section className="about-section reveal reveal-right">
                    <h2><span className="text-gradient">Our Mission & Aim</span></h2>
                    <ul className="mission-list">
                        <li className="card-shimmer"><strong>What We Do:</strong> Since then, we have been celebrating it every year. Dushahra is a celebration of the 'Victory of Good over evil'.</li>
                        <li className="card-shimmer"><strong>Why We Do It:</strong> By celebrating this festival, children and adults learn respect for elders, tolerance, sacrifice, giving, sharing, and family values from Lord Rama's life.</li>
                        <li className="card-shimmer"><strong>Our Aim:</strong> Lord Rama's life is considered an ideal family life to follow and has a deep influence on Indian culture. Cultural events such as this strengthen the bond of friendship between the two great democracies of the world. It also cultivates our rich cultural heritage in our young generation.</li>
                    </ul>
                </section>

                <div className="divider-mandala-spin reveal">
                    <OmIcon size={32} />
                </div>

                <section className="about-section reveal reveal-left">
                    <h2><span className="text-gradient">About the Event</span></h2>
                    <p>
                        This event draws a crowd of over 10,000 people and it's completely free for the public which means Free Admission and Free Parking. Organizing such a big event of that magnitude requires a lot of volunteers and funding. Our source of funding is the Middlesex County and local businesses and stall vendors. Many times, we can't raise enough funds to cover the huge cost of it then many of our volunteers and the Board of Directors come forward and chip in the money to cover the losses.
                    </p>
                </section>
            </div>
        </div>
    );
};
