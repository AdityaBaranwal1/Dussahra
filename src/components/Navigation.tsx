import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import './Navigation.css';

interface NavLink {
    name: string;
    path: string;
    children?: { name: string; path: string }[];
}

const links: NavLink[] = [
    { name: 'Home', path: '/' },
    {
        name: 'About IAF',
        path: '/about',
        children: [
            { name: 'About IAF', path: '/about' },
            { name: 'Family', path: '/family' },
        ],
    },
    { name: 'Schedule', path: '/events' },
    { name: 'Sponsors', path: '/our-sponsors' },
    { name: 'Media', path: '/photos' },
    {
        name: 'Contact Us',
        path: '/contact-us',
        children: [
            { name: 'Contact Us', path: '/contact-us' },
            { name: 'Volunteer', path: '/volunteer' },
        ],
    },
];

export const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const location = useLocation();
    const navMenuRef = useRef<HTMLUListElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);

    const toggleDropdown = (name: string) => {
        setOpenDropdown(prev => (prev === name ? null : name));
    };

    const closeAll = () => {
        setIsOpen(false);
        setOpenDropdown(null);
    };

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            if (openDropdown) {
                setOpenDropdown(null);
            } else if (isOpen) {
                setIsOpen(false);
                menuButtonRef.current?.focus();
            }
        }

        if (isOpen && navMenuRef.current && window.innerWidth <= 1024) {
            const focusableElements = navMenuRef.current.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled])'
            );
            if (focusableElements.length === 0) return;

            const firstEl = focusableElements[0];
            const lastEl = focusableElements[focusableElements.length - 1];

            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstEl) {
                    e.preventDefault();
                    lastEl.focus();
                } else if (!e.shiftKey && document.activeElement === lastEl) {
                    e.preventDefault();
                    firstEl.focus();
                }
            }
        }
    }, [isOpen, openDropdown]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <nav className="navbar" aria-label="Main navigation">
            <div className="navbar-container container">
                <Link to="/" className="navbar-logo" onClick={closeAll}>
                    <img src="/iaf-logo.png" alt="Indo-American Festivals Inc." className="navbar-logo-img" />
                    <span className="logo-text">Dushahra</span>
                </Link>

                <button ref={menuButtonRef} className="menu-icon" aria-label={isOpen ? 'Close menu' : 'Open menu'} aria-expanded={isOpen} aria-controls="main-nav-menu" type="button" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} aria-hidden="true" /> : <Menu size={28} aria-hidden="true" />}
                </button>

                <ul id="main-nav-menu" ref={navMenuRef} className={isOpen ? 'nav-menu active' : 'nav-menu'} role="menubar">
                    {links.map((link) =>
                        link.children ? (
                            <li
                                className={`nav-item has-dropdown ${openDropdown === link.name ? 'dropdown-open' : ''}`}
                                key={link.name}
                                role="none"
                            >
                                <Link
                                    to={link.path}
                                    className={location.pathname === link.path ? 'nav-links active' : 'nav-links'}
                                    aria-haspopup="true"
                                    aria-expanded={openDropdown === link.name}
                                    role="menuitem"
                                    onClick={(e) => {
                                        if (window.innerWidth <= 1024 && openDropdown !== link.name) {
                                            e.preventDefault();
                                            toggleDropdown(link.name);
                                        } else {
                                            closeAll();
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            if (window.innerWidth <= 1024 && openDropdown !== link.name) {
                                                e.preventDefault();
                                                toggleDropdown(link.name);
                                            }
                                        }
                                    }}
                                >
                                    {link.name}
                                    <ChevronDown size={14} className="dropdown-chevron" aria-hidden="true" />
                                    <span className="nav-hover-frame" aria-hidden="true"></span>
                                </Link>
                                <ul className="nav-dropdown" role="menu" aria-label={`${link.name} submenu`}>
                                    {link.children.map((child) => (
                                        <li key={child.name} role="none">
                                            <Link
                                                to={child.path}
                                                className={location.pathname === child.path ? 'nav-links active' : 'nav-links'}
                                                onClick={closeAll}
                                                role="menuitem"
                                            >
                                                {child.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ) : (
                            <li className="nav-item" key={link.name} role="none">
                                <Link
                                    to={link.path}
                                    className={location.pathname === link.path ? 'nav-links active' : 'nav-links'}
                                    onClick={closeAll}
                                    role="menuitem"
                                >
                                    {link.name}
                                    <span className="nav-hover-frame" aria-hidden="true"></span>
                                </Link>
                            </li>
                        )
                    )}
                    <li className="nav-item-btn" role="none">
                        <Link to="/booth-booking" className="btn btn-primary nav-btn" onClick={closeAll} role="menuitem">
                            Book a Booth
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};
