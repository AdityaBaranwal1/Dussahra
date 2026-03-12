import { useEffect, useState } from 'react';
import './ThemeSelector.css';

const THEMES = [
    { id: 'theme-default', name: 'Default Festival', color: '#E85D04' },
    { id: 'theme-ravana-dahan', name: 'Ravana Dahan', color: '#FF7A00' },
    { id: 'theme-vijaya', name: 'Vijaya', color: '#1B4B8A' },
    { id: 'theme-shakti', name: 'Shakti', color: '#C41E3A' },
    { id: 'theme-deepotsav', name: 'Deepotsav', color: '#D4760A' },
    { id: 'theme-premium-heritage', name: 'Premium Heritage', color: '#C5283D' },
    { id: 'theme-modern-festival', name: 'Modern Festival', color: '#FF6B35' },
    { id: 'theme-earthy-grounded', name: 'Earthy & Grounded', color: '#B85042' },
];

export const ThemeSelector = () => {
    const [activeTheme, setActiveTheme] = useState(() => {
        return localStorage.getItem('app-theme') || 'theme-default';
    });
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        THEMES.forEach(theme => document.documentElement.classList.remove(theme.id));
        document.documentElement.classList.add(activeTheme);
        localStorage.setItem('app-theme', activeTheme);
    }, [activeTheme]);

    return (
        <div className={`theme-selector-wrapper ${isOpen ? 'open' : ''}`}>
            <button
                className="theme-toggle-btn"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle theme selector"
            >
                🎨
            </button>

            {isOpen && (
                <div className="theme-options-panel">
                    <h3 className="theme-panel-title">Select Theme</h3>
                    <div className="theme-list">
                        {THEMES.map(theme => (
                            <button
                                key={theme.id}
                                className={`theme-option-btn ${activeTheme === theme.id ? 'active' : ''}`}
                                onClick={() => setActiveTheme(theme.id)}
                            >
                                <span
                                    className="theme-preview"
                                    style={{ backgroundColor: theme.color }}
                                ></span>
                                {theme.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
