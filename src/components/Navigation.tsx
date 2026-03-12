import { useState } from 'react';
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

    const toggleDropdown = (name: string) => {
        setOpenDropdown(prev => (prev === name ? null : name));
    };

    const closeAll = () => {
        setIsOpen(false);
        setOpenDropdown(null);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container container">
                <Link to="/" className="navbar-logo" onClick={closeAll}>
                    <span className="logo-text">Dushahra</span>
                </Link>

                <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </div>

                <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
                    {links.map((link) =>
                        link.children ? (
                            <li
                                className={`nav-item has-dropdown ${openDropdown === link.name ? 'dropdown-open' : ''}`}
                                key={link.name}
                            >
                                <Link
                                    to={link.path}
                                    className={location.pathname === link.path ? 'nav-links active' : 'nav-links'}
                                    onClick={(e) => {
                                        // On mobile, first tap opens dropdown; second tap navigates
                                        if (window.innerWidth <= 960 && openDropdown !== link.name) {
                                            e.preventDefault();
                                            toggleDropdown(link.name);
                                        } else {
                                            closeAll();
                                        }
                                    }}
                                >
                                    {link.name}
                                    <ChevronDown size={14} className="dropdown-chevron" />
                                    <span className="nav-hover-frame" aria-hidden="true"></span>
                                </Link>
                                <ul className="nav-dropdown">
                                    {link.children.map((child) => (
                                        <li key={child.name}>
                                            <Link
                                                to={child.path}
                                                className={location.pathname === child.path ? 'nav-links active' : 'nav-links'}
                                                onClick={closeAll}
                                            >
                                                {child.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ) : (
                            <li className="nav-item" key={link.name}>
                                <Link
                                    to={link.path}
                                    className={location.pathname === link.path ? 'nav-links active' : 'nav-links'}
                                    onClick={closeAll}
                                >
                                    {link.name}
                                    <span className="nav-hover-frame" aria-hidden="true"></span>
                                </Link>
                            </li>
                        )
                    )}
                    <li className="nav-item-btn">
                        <Link to="/booth-booking" className="btn btn-primary nav-btn" onClick={closeAll}>
                            Book a Booth
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};
