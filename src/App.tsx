import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { EmberParticles } from './components/EmberParticles';
import { EventLocation } from './components/EventLocation';
import { SponsorMarquee } from './components/SponsorMarquee';
import { Highlights } from './components/Highlights';
import { useScrollReveal } from './hooks/useScrollReveal';

import { About } from './pages/About';
import { Events } from './pages/Events';
import { Sponsors } from './pages/Sponsors';
import { BoothBooking } from './pages/BoothBooking';
import { Photos } from './pages/Photos';
import { Videos } from './pages/Videos';
import { Press } from './pages/Press';
import { ContactUs } from './pages/ContactUs';
import { Volunteer } from './pages/Volunteer';
import { Family } from './pages/Family';


const Home = () => (
    <div>
        <Hero />
        <EventLocation />
        <Highlights />
        <SponsorMarquee />
    </div>
);

const NotFound = () => (
    <div className="not-found-page">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-text">Page not found</p>
        <Link to="/" className="btn btn-primary btn-ripple">Back to Home</Link>
    </div>
);

const AppLayout = () => {
    const location = useLocation();
    useScrollReveal();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div className="app-layout">
            <div className="ground-fire" aria-hidden="true" />
            <EmberParticles />
            <a href="#main-content" className="skip-to-content">Skip to content</a>
            <Navigation />
            <main id="main-content" className="app-main">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/our-sponsors" element={<Sponsors />} />
                        <Route path="/photos" element={<Photos />} />
                        <Route path="/videos" element={<Videos />} />
                        <Route path="/media-coverage-and-press-releases" element={<Press />} />
                        <Route path="/contact-us" element={<ContactUs />} />
                        <Route path="/booth-booking" element={<BoothBooking />} />
                        <Route path="/volunteer" element={<Volunteer />} />
                        <Route path="/family" element={<Family />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
            </main>
            <Footer />
        </div>
    );
};

function App() {
    return (
        <Router>
            <AppLayout />
        </Router>
    );
}

export default App;
