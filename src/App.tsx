import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { EventLocation } from './components/EventLocation';
import { SponsorMarquee } from './components/SponsorMarquee';
import { Highlights } from './components/Highlights';
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
import { useScrollReveal } from './hooks/useScrollReveal';
import { ThemeSelector } from './components/ThemeSelector';
import PixelVineCanvas from './components/PixelVineCanvas';


const Home = () => (
    <div>
        <Hero />
        <EventLocation />
        <Highlights />
        <SponsorMarquee />
    </div>
);

const AppLayout = () => {
    const location = useLocation();
    useScrollReveal();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div className="app-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
            <Navigation />
            <main style={{ flex: '1', zIndex: 1 }}>
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
                    <Route path="/vines" element={<PixelVineCanvas />} />
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
            <ThemeSelector />
        </Router>
    );
}

export default App;
