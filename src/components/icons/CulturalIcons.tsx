import './CulturalIcons.css';

/**
 * Ghungroo (Ankle Bells) — Meena Bazaar icon
 * Monoline, rounded caps, animated jingle on hover
 */
export const GhungrooIcon = ({ size = 48 }: { size?: number }) => (
    <span className="cultural-icon ghungroo-icon" style={{ width: size, height: size }}>
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16 C16 12, 48 12, 52 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            {/* String */}
            <path d="M16 16 L16 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M28 16 L28 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M40 16 L40 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M52 16 L52 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            {/* Bells */}
            <circle cx="16" cy="30" r="6" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="28" cy="28" r="6" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="40" cy="28" r="6" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="52" cy="30" r="6" stroke="currentColor" strokeWidth="2.5" />
            {/* Bell details (clappers) */}
            <circle cx="16" cy="33" r="1.5" fill="currentColor" />
            <circle cx="28" cy="31" r="1.5" fill="currentColor" />
            <circle cx="40" cy="31" r="1.5" fill="currentColor" />
            <circle cx="52" cy="33" r="1.5" fill="currentColor" />
        </svg>
    </span>
);

/**
 * Mudra Hand — Cultural Performances icon
 * Classical dance hand gesture, subtle wave on hover
 */
export const MudraIcon = ({ size = 48 }: { size?: number }) => (
    <span className="cultural-icon mudra-icon" style={{ width: size, height: size }}>
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Palm */}
            <path d="M32 52 C26 48, 22 40, 22 32 C22 28, 24 24, 28 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M32 52 C38 48, 42 40, 42 32 C42 28, 40 24, 36 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            {/* Fingers */}
            <path d="M28 22 C28 18, 26 14, 24 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M30 20 C30 16, 30 12, 30 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M34 20 C34 16, 34 12, 34 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M36 22 C36 18, 38 14, 40 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            {/* Thumb */}
            <path d="M22 32 C18 30, 16 28, 14 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            {/* Wrist detail */}
            <path d="M28 52 L36 52" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    </span>
);

/**
 * Bow & Arrow — Ram Leela icon
 * Small inline bow, arrow slides forward on hover
 */
export const BowArrowIcon = ({ size = 48 }: { size?: number }) => (
    <span className="cultural-icon bow-arrow-icon" style={{ width: size, height: size }}>
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Bow arc — curves left */}
            <path d="M20 10 Q 6 32, 20 54" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Bowstring — straight line from tip to tip */}
            <line className="bow-string-line" x1="20" y1="10" x2="20" y2="54" stroke="currentColor" strokeWidth="1.2" />
            {/* Arrow group — shaft + head + fletching move together */}
            <g className="arrow-group">
                {/* Arrow shaft */}
                <line x1="20" y1="32" x2="50" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                {/* Arrowhead */}
                <polygon points="50,32 44,27 44,37" fill="currentColor" />
                {/* Fletching feathers */}
                <line x1="22" y1="32" x2="18" y2="27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="22" y1="32" x2="18" y2="37" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </g>
        </svg>
    </span>
);

/**
 * Diya (Earthen Lamp) — Ravan Dahan icon
 * Flame flickers via CSS animation
 */
export const DiyaIcon = ({ size = 48 }: { size?: number }) => (
    <span className="cultural-icon diya-icon" style={{ width: size, height: size }}>
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Bowl */}
            <path d="M16 40 Q16 50, 32 50 Q48 50, 48 40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            {/* Base */}
            <ellipse cx="32" cy="40" rx="16" ry="4" stroke="currentColor" strokeWidth="2.5" fill="none" />
            {/* Wick */}
            <line x1="32" y1="36" x2="32" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            {/* Flame — animated */}
            <path className="diya-flame" d="M32 28 Q 28 20, 32 12 Q 36 20, 32 28Z" fill="currentColor" opacity="0.8" />
        </svg>
    </span>
);

/**
 * Lotus — Section dividers / About page
 * Petals bloom outward on hover
 */
export const LotusIcon = ({ size = 48 }: { size?: number }) => (
    <span className="cultural-icon lotus-icon" style={{ width: size, height: size }}>
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Center petal */}
            <path className="lotus-petal petal-center" d="M32 38 Q28 28, 32 14 Q36 28, 32 38Z" stroke="currentColor" strokeWidth="2" fill="none" />
            {/* Left petals */}
            <path className="lotus-petal petal-left-1" d="M30 40 Q20 32, 16 20 Q26 28, 30 40Z" stroke="currentColor" strokeWidth="2" fill="none" />
            <path className="lotus-petal petal-left-2" d="M28 42 Q14 38, 8 28 Q18 34, 28 42Z" stroke="currentColor" strokeWidth="2" fill="none" />
            {/* Right petals */}
            <path className="lotus-petal petal-right-1" d="M34 40 Q44 32, 48 20 Q38 28, 34 40Z" stroke="currentColor" strokeWidth="2" fill="none" />
            <path className="lotus-petal petal-right-2" d="M36 42 Q50 38, 56 28 Q46 34, 36 42Z" stroke="currentColor" strokeWidth="2" fill="none" />
            {/* Base */}
            <path d="M24 46 Q32 42, 40 46" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    </span>
);

/**
 * Tabla Drum — Media sections icon
 * Drumhead depresses on hover
 */
export const TablaIcon = ({ size = 48 }: { size?: number }) => (
    <span className="cultural-icon tabla-icon" style={{ width: size, height: size }}>
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Drum body */}
            <path d="M18 20 L16 48 Q16 54, 32 54 Q48 54, 48 48 L46 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Top head */}
            <ellipse className="tabla-head" cx="32" cy="20" rx="14" ry="5" stroke="currentColor" strokeWidth="2.5" fill="none" />
            {/* Syahi (black center circle on tabla) */}
            <ellipse cx="32" cy="20" rx="6" ry="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
            {/* Lacing lines */}
            <line x1="20" y1="22" x2="18" y2="48" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <line x1="32" y1="25" x2="32" y2="54" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <line x1="44" y1="22" x2="46" y2="48" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        </svg>
    </span>
);

/* ═══════════════════════════════════════════════════
   NEW ICONS — Expanding the cultural icon library
   ═══════════════════════════════════════════════════ */

/**
 * Trishul (Trident) — Shiva's weapon, divine power
 * Prongs glow on hover
 */
export const TrishulIcon = ({ size = 48 }: { size?: number }) => (
    <span className="cultural-icon trishul-icon" style={{ width: size, height: size }}>
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Central shaft */}
            <line x1="32" y1="58" x2="32" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            {/* Center prong */}
            <path className="trishul-prong" d="M32 12 L32 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path className="trishul-prong" d="M30 6 L32 2 L34 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {/* Left prong — curved outward */}
            <path className="trishul-prong" d="M32 14 Q24 10, 20 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path className="trishul-prong" d="M18 6 L20 2 L22 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {/* Right prong — curved outward */}
            <path className="trishul-prong" d="M32 14 Q40 10, 44 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path className="trishul-prong" d="M42 6 L44 2 L46 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {/* Cross guard */}
            <ellipse cx="32" cy="16" rx="4" ry="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
    </span>
);

/**
 * Ravana — 10-headed demon king
 * Simplified iconic head with crown, heads fan out on hover
 */
export const RavanaIcon = ({ size = 48 }: { size?: number }) => (
    <span className="cultural-icon ravana-icon" style={{ width: size, height: size }}>
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Central large head */}
            <circle cx="32" cy="32" r="8" stroke="currentColor" strokeWidth="2" />
            {/* Crown on center head */}
            <path d="M26 26 L29 20 L32 24 L35 20 L38 26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Eyes */}
            <circle cx="29" cy="32" r="1.2" fill="currentColor" />
            <circle cx="35" cy="32" r="1.2" fill="currentColor" />
            {/* Surrounding smaller heads — arranged in arc */}
            <circle className="ravana-head" cx="14" cy="28" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <circle className="ravana-head" cx="18" cy="16" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <circle className="ravana-head" cx="28" cy="10" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <circle className="ravana-head" cx="36" cy="10" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <circle className="ravana-head" cx="46" cy="16" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <circle className="ravana-head" cx="50" cy="28" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            {/* Shoulders */}
            <path d="M22 40 Q32 44, 42 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            {/* Body hint */}
            <path d="M24 40 L22 54" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M40 40 L42 54" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    </span>
);

/**
 * Fire/Flame — Ravan Dahan burning
 * Animated flickering flame
 */
export const FlameIcon = ({ size = 48 }: { size?: number }) => (
    <span className="cultural-icon flame-icon" style={{ width: size, height: size }}>
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer flame */}
            <path className="flame-outer" d="M32 6 Q22 20, 18 32 Q14 44, 22 52 Q28 58, 32 58 Q36 58, 42 52 Q50 44, 46 32 Q42 20, 32 6Z" stroke="currentColor" strokeWidth="2.5" fill="none" />
            {/* Inner flame */}
            <path className="flame-inner" d="M32 18 Q26 28, 24 36 Q22 44, 28 50 Q30 52, 32 52 Q34 52, 36 50 Q42 44, 40 36 Q38 28, 32 18Z" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
            {/* Core */}
            <path className="flame-core" d="M32 30 Q28 38, 30 46 Q31 48, 32 48 Q33 48, 34 46 Q36 38, 32 30Z" fill="currentColor" opacity="0.3" />
            {/* Sparks */}
            <circle className="flame-spark" cx="24" cy="20" r="1.5" fill="currentColor" opacity="0.5" />
            <circle className="flame-spark" cx="40" cy="16" r="1" fill="currentColor" opacity="0.4" />
            <circle className="flame-spark" cx="36" cy="10" r="1.2" fill="currentColor" opacity="0.3" />
        </svg>
    </span>
);

/**
 * Mandala — Sacred geometry, cosmic order
 * Slow rotation on hover
 */
export const MandalaIcon = ({ size = 48 }: { size?: number }) => (
    <span className="cultural-icon mandala-icon" style={{ width: size, height: size }}>
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer circle */}
            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1.5" />
            {/* Inner circles */}
            <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="32" cy="32" r="12" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="32" cy="32" r="4" fill="currentColor" opacity="0.3" />
            {/* 8-point petals */}
            <path d="M32 4 Q36 16, 32 20 Q28 16, 32 4Z" stroke="currentColor" strokeWidth="1" />
            <path d="M32 60 Q28 48, 32 44 Q36 48, 32 60Z" stroke="currentColor" strokeWidth="1" />
            <path d="M4 32 Q16 28, 20 32 Q16 36, 4 32Z" stroke="currentColor" strokeWidth="1" />
            <path d="M60 32 Q48 36, 44 32 Q48 28, 60 32Z" stroke="currentColor" strokeWidth="1" />
            {/* Diagonal petals */}
            <path d="M11.2 11.2 Q21 17, 22 22 Q17 21, 11.2 11.2Z" stroke="currentColor" strokeWidth="1" />
            <path d="M52.8 11.2 Q43 17, 42 22 Q47 21, 52.8 11.2Z" stroke="currentColor" strokeWidth="1" />
            <path d="M11.2 52.8 Q17 43, 22 42 Q21 47, 11.2 52.8Z" stroke="currentColor" strokeWidth="1" />
            <path d="M52.8 52.8 Q47 43, 42 42 Q43 47, 52.8 52.8Z" stroke="currentColor" strokeWidth="1" />
        </svg>
    </span>
);

/**
 * Peacock Feather — Krishna, beauty, pride of India
 * Gentle sway on hover
 */
export const PeacockFeatherIcon = ({ size = 48 }: { size?: number }) => (
    <span className="cultural-icon peacock-feather-icon" style={{ width: size, height: size }}>
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Shaft */}
            <path d="M32 60 Q30 40, 32 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            {/* Outer eye shape */}
            <path d="M32 12 Q20 20, 18 30 Q16 40, 32 42 Q48 40, 46 30 Q44 20, 32 12Z" stroke="currentColor" strokeWidth="2" fill="none" />
            {/* Inner eye */}
            <path d="M32 18 Q24 24, 22 30 Q20 36, 32 38 Q44 36, 42 30 Q40 24, 32 18Z" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
            {/* Eye center */}
            <ellipse cx="32" cy="28" rx="5" ry="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <ellipse cx="32" cy="28" rx="2" ry="3.5" fill="currentColor" opacity="0.3" />
            {/* Barbs */}
            <path d="M26 16 Q22 14, 18 16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
            <path d="M38 16 Q42 14, 46 16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
        </svg>
    </span>
);

/**
 * Marigold Flower — Sacred offering, garlands
 * Petals pulse subtly
 */
export const MarigoldIcon = ({ size = 48 }: { size?: number }) => (
    <span className="cultural-icon marigold-icon" style={{ width: size, height: size }}>
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Center */}
            <circle cx="32" cy="32" r="6" fill="currentColor" opacity="0.3" />
            <circle cx="32" cy="32" r="6" stroke="currentColor" strokeWidth="1.5" />
            {/* Petals — 12 around */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
                <ellipse
                    key={angle}
                    cx="32"
                    cy="18"
                    rx="4"
                    ry="8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    transform={`rotate(${angle} 32 32)`}
                    className="marigold-petal"
                />
            ))}
        </svg>
    </span>
);

/**
 * Om Symbol — Sacred syllable, spiritual essence
 * Gentle glow on hover
 */
export const OmIcon = ({ size = 48 }: { size?: number }) => (
    <span className="cultural-icon om-icon" style={{ width: size, height: size }}>
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Main Om body */}
            <path d="M18 38 Q12 38, 12 32 Q12 24, 20 22 Q28 20, 30 28 Q32 34, 26 38 Q22 44, 18 44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M26 38 Q30 44, 36 44 Q44 44, 46 36 Q48 28, 42 22 Q38 18, 34 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Upper arc */}
            <path d="M46 28 Q50 18, 44 12 Q40 8, 34 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Chandrabindu (crescent + dot) */}
            <path d="M38 8 Q42 4, 46 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="42" cy="3" r="1.5" fill="currentColor" />
        </svg>
    </span>
);

/**
 * Conch Shell (Shankha) — Victory proclamation, auspicious beginning
 * Vibrates subtly on hover
 */
export const ConchIcon = ({ size = 48 }: { size?: number }) => (
    <span className="cultural-icon conch-icon" style={{ width: size, height: size }}>
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Shell body */}
            <path d="M20 48 Q12 40, 12 30 Q12 16, 24 10 Q32 6, 40 10 Q48 16, 48 28 Q48 36, 44 42 Q40 48, 34 50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Opening */}
            <path d="M20 48 Q24 52, 34 50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Spiral lines */}
            <path d="M22 36 Q20 28, 28 22 Q34 18, 40 22 Q44 26, 42 34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
            <path d="M26 32 Q26 26, 32 24 Q36 22, 38 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
            {/* Mouthpiece detail */}
            <path d="M20 48 L16 54" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    </span>
);

/**
 * Rangoli — Floor art, geometric welcome pattern
 * Rotates slowly continuously
 */
export const RangoliIcon = ({ size = 48 }: { size?: number }) => (
    <span className="cultural-icon rangoli-icon" style={{ width: size, height: size }}>
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Center dot */}
            <circle cx="32" cy="32" r="3" fill="currentColor" opacity="0.4" />
            {/* Diamond pattern */}
            <path d="M32 12 L52 32 L32 52 L12 32Z" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M32 18 L46 32 L32 46 L18 32Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
            {/* Cross lines */}
            <line x1="32" y1="6" x2="32" y2="58" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <line x1="6" y1="32" x2="58" y2="32" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            {/* Corner dots */}
            <circle cx="32" cy="8" r="2" fill="currentColor" opacity="0.5" />
            <circle cx="56" cy="32" r="2" fill="currentColor" opacity="0.5" />
            <circle cx="32" cy="56" r="2" fill="currentColor" opacity="0.5" />
            <circle cx="8" cy="32" r="2" fill="currentColor" opacity="0.5" />
            {/* Petal arcs */}
            <path d="M32 12 Q40 22, 52 32" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
            <path d="M52 32 Q40 42, 32 52" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
            <path d="M32 52 Q22 42, 12 32" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
            <path d="M12 32 Q22 22, 32 12" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
        </svg>
    </span>
);

/**
 * Checkmark — Replaces ✅ emoji
 * Draws in on appearance
 */
export const CheckmarkIcon = ({ size = 48 }: { size?: number }) => (
    <span className="cultural-icon checkmark-icon" style={{ width: size, height: size }}>
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="2.5" opacity="0.2" />
            <path className="checkmark-path" d="M18 32 L28 42 L46 22" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </span>
);

/**
 * Location Pin — Replaces 📍 emoji, Indian temple dome style
 */
export const LocationPinIcon = ({ size = 48 }: { size?: number }) => (
    <span className="cultural-icon location-pin-icon" style={{ width: size, height: size }}>
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Pin body */}
            <path d="M32 58 Q20 40, 14 30 Q8 20, 16 12 Q22 6, 32 6 Q42 6, 48 12 Q56 20, 50 30 Q44 40, 32 58Z" stroke="currentColor" strokeWidth="2.5" fill="none" />
            {/* Temple dome inside */}
            <path d="M26 28 Q26 18, 32 14 Q38 18, 38 28" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <line x1="26" y1="28" x2="38" y2="28" stroke="currentColor" strokeWidth="1.5" />
            {/* Kalash (finial) */}
            <circle cx="32" cy="12" r="1.5" fill="currentColor" opacity="0.5" />
        </svg>
    </span>
);

/**
 * Mail/Letter — Replaces 📧 emoji, styled with decorative seal
 */
export const MailIcon = ({ size = 48 }: { size?: number }) => (
    <span className="cultural-icon mail-icon" style={{ width: size, height: size }}>
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="16" width="48" height="32" rx="4" stroke="currentColor" strokeWidth="2.5" />
            <path d="M8 18 L32 36 L56 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            {/* Decorative seal */}
            <circle cx="48" cy="40" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
        </svg>
    </span>
);

/**
 * Phone — Replaces 📞 emoji
 */
export const PhoneIcon = ({ size = 48 }: { size?: number }) => (
    <span className="cultural-icon phone-icon" style={{ width: size, height: size }}>
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 10 Q12 10, 10 14 L8 22 Q6 28, 12 34 L14 36 Q22 46, 30 52 L32 54 Q38 58, 44 56 L52 54 Q56 52, 56 48 L56 42 Q56 38, 50 38 L44 38 Q40 38, 40 42 Q40 44, 38 44 Q30 40, 24 34 Q18 28, 16 20 Q16 18, 18 18 Q22 18, 22 14 L22 10 Q22 6, 18 6 Z" stroke="currentColor" strokeWidth="2.5" fill="none" />
        </svg>
    </span>
);

/**
 * Fax — Replaces 📠 emoji
 */
export const FaxIcon = ({ size = 48 }: { size?: number }) => (
    <span className="cultural-icon fax-icon" style={{ width: size, height: size }}>
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Machine body */}
            <rect x="10" y="24" width="44" height="28" rx="4" stroke="currentColor" strokeWidth="2.5" />
            {/* Paper coming out */}
            <path d="M18 24 L18 10 L46 10 L46 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            {/* Paper lines */}
            <line x1="24" y1="16" x2="40" y2="16" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
            <line x1="24" y1="20" x2="36" y2="20" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
            {/* Display */}
            <rect x="18" y="30" width="16" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            {/* Buttons */}
            <circle cx="42" cy="32" r="2" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            <circle cx="42" cy="40" r="2" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        </svg>
    </span>
);

/**
 * Zelle/Payment — Replaces 💸 emoji
 */
export const PaymentIcon = ({ size = 48 }: { size?: number }) => (
    <span className="cultural-icon payment-icon" style={{ width: size, height: size }}>
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Coin/circle */}
            <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="2.5" />
            {/* Dollar symbol */}
            <path d="M32 14 L32 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M24 22 Q24 18, 32 18 Q40 18, 40 24 Q40 30, 32 30 Q24 30, 24 36 Q24 42, 32 42 Q40 42, 40 38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
    </span>
);

/**
 * Clock — Replaces 🕒 emoji
 */
export const ClockIcon = ({ size = 48 }: { size?: number }) => (
    <span className="cultural-icon clock-icon" style={{ width: size, height: size }}>
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="2.5" />
            {/* Hour hand */}
            <line x1="32" y1="32" x2="32" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            {/* Minute hand */}
            <line x1="32" y1="32" x2="42" y2="26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            {/* Center dot */}
            <circle cx="32" cy="32" r="2" fill="currentColor" />
            {/* Hour markers */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
                <line
                    key={angle}
                    x1="32"
                    y1="8"
                    x2="32"
                    y2="11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    transform={`rotate(${angle} 32 32)`}
                    opacity="0.4"
                />
            ))}
        </svg>
    </span>
);

/**
 * Shield/Checkmark — Replaces ✅ in booking confirmation context
 */
export const ShieldCheckIcon = ({ size = 48 }: { size?: number }) => (
    <span className="cultural-icon shield-check-icon" style={{ width: size, height: size }}>
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Shield */}
            <path d="M32 6 L10 16 L10 32 Q10 50, 32 58 Q54 50, 54 32 L54 16Z" stroke="currentColor" strokeWidth="2.5" fill="none" />
            {/* Check */}
            <path d="M22 32 L28 40 L42 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </span>
);

/**
 * Warning/Alert — Replaces ⚠️ emoji, styled as a flame warning
 */
export const AlertIcon = ({ size = 48 }: { size?: number }) => (
    <span className="cultural-icon alert-icon" style={{ width: size, height: size }}>
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 6 L4 56 L60 56Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
            <line x1="32" y1="24" x2="32" y2="40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <circle cx="32" cy="48" r="2.5" fill="currentColor" />
        </svg>
    </span>
);

/**
 * Building/Organization — Replaces 🏢 emoji, styled as temple
 */
export const TempleIcon = ({ size = 48 }: { size?: number }) => (
    <span className="cultural-icon temple-icon" style={{ width: size, height: size }}>
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Base */}
            <rect x="12" y="48" width="40" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
            {/* Pillars */}
            <line x1="18" y1="48" x2="18" y2="30" stroke="currentColor" strokeWidth="2.5" />
            <line x1="46" y1="48" x2="46" y2="30" stroke="currentColor" strokeWidth="2.5" />
            <line x1="32" y1="48" x2="32" y2="30" stroke="currentColor" strokeWidth="2" opacity="0.4" />
            {/* Beam */}
            <rect x="14" y="28" width="36" height="4" rx="1" stroke="currentColor" strokeWidth="2" />
            {/* Dome/Shikhara */}
            <path d="M20 28 Q20 18, 32 8 Q44 18, 44 28" stroke="currentColor" strokeWidth="2" fill="none" />
            {/* Kalash */}
            <circle cx="32" cy="6" r="2" fill="currentColor" opacity="0.5" />
            {/* Flag */}
            <line x1="32" y1="6" x2="32" y2="2" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    </span>
);

/**
 * Shopping Bag — Replaces 🛍️ for Meena Bazaar
 */
export const BazaarIcon = ({ size = 48 }: { size?: number }) => (
    <span className="cultural-icon bazaar-icon" style={{ width: size, height: size }}>
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Bag body */}
            <path d="M12 24 L16 56 L48 56 L52 24Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
            {/* Handle */}
            <path d="M22 24 Q22 12, 32 12 Q42 12, 42 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Decorative pattern — small diamond */}
            <path d="M32 34 L38 40 L32 46 L26 40Z" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
            <circle cx="32" cy="40" r="2" fill="currentColor" opacity="0.3" />
        </svg>
    </span>
);
