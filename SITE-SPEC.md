# Dushahra 2026 — Complete Site Specification

> **Purpose:** This document contains every detail about the Dushahra 2026 festival website — all pages, content, data, booth pricing, team members, design system, interactive features, and more. Use this as a comprehensive reference to build, redesign, or reimagine the site.

---

## Event Overview

| Field | Value |
|---|---|
| Event Name | Dushahra 2026 |
| Edition | 28th Annual Edition |
| Date | October 10th, 2026 |
| Rain Date | October 24th, 2026 |
| Location | Lake Papaianni Park, 100 Municipal Blvd, Edison, NJ 08817 |
| Admission | Free |
| Parking | Free |
| Expected Crowd | 10,000+ |
| Organization | Indo-American Festivals, Inc. (IAF) |
| Org Address | 40 La Valencia Road, Old Bridge, NJ 08857 USA |
| Main Email | Contact@dushahra.com |
| Zelle Email | dushahra.usa@gmail.com |
| Phone | (732)-444-8381 |
| Alt Phone | (732)-360-2059 |
| Fax | (732)-360-2545 |
| Alt Fax | 610-427-5277 |

### What is Dussehra?

Dussehra (also spelled Dushahra) is one of India's most important festivals, celebrating the triumph of good over evil. It marks the victory of Lord Rama over the demon king Ravana, as told in the epic Ramayana. The festival culminates in "Ravan Dahan" — the burning of massive effigies of Ravana, symbolizing the destruction of evil. IAF has celebrated this festival annually in New Jersey since 1999, making it one of the largest Dussehra celebrations in the United States.

---

## Tech Stack

- **Framework:** React 18.2 + TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v6.22.3
- **Animations:** GSAP (with SplitText for hero)
- **Icons:** Lucide React + 17 custom SVG cultural icons
- **Fonts:** Playfair Display (headings), Inter (body)
- **Games:** HTML5 Canvas 2D
- **Forms:** Google Apps Script backend (configurable)

---

## Site Map & Navigation

### Routes

| Route | Page | Description |
|---|---|---|
| `/` | Home | Hero, countdown, location, highlights, sponsor marquee |
| `/about` | About Us | Organization history, mission, and how it started |
| `/events` | Event Schedule | Timeline of the day's events with interactive icons |
| `/our-sponsors` | Our Sponsors | Grid of all 40 sponsor logos |
| `/photos` | Photo Gallery | 9 photos from past festivals |
| `/videos` | Video Highlights | 4 YouTube embeds |
| `/media-coverage-and-press-releases` | Press & Media | 3 downloadable press release PDFs |
| `/contact-us` | Contact Us | Contact info + contact form |
| `/booth-booking` | Vendor Booth Booking | Multi-step booking form with Zelle payment flow |
| `/volunteer` | Volunteer With Us | Volunteer signup form + PVSA info |
| `/family` | Our Family | All team members organized by council |
| `*` | 404 Not Found | Fallback for unknown routes |

### Navigation Structure

```
Home
About IAF ▼
  ├─ About IAF
  └─ Family
Schedule
Sponsors
Media
Contact Us ▼
  ├─ Contact Us
  └─ Volunteer
[Book a Booth] (CTA button)
```

---

## Design System

### Colors

| Token | Hex | Usage |
|---|---|---|
| Primary (Saffron) | `#E85D04` | Buttons, links, accents |
| Primary Hover | `#D04F00` | Button hover states |
| Secondary (Blue) | `#0170B9` | Secondary accents |
| Accent (Deep Red) | `#A71400` | Emphasis, alerts |
| Gold (Marigold) | `#FFB703` | Decorative, highlights |
| Background | `#FAFAFA` | Page background |
| Surface | `#FFFFFF` | Card backgrounds |
| Dark | `#1A1A1A` | Dark sections, hero |
| Text Main | `#222222` | Body text |
| Text Muted | `#555555` | Secondary text |
| Text Inverse | `#FFFFFF` | Text on dark backgrounds |
| Decoration Olive | `#595B2A` | Decorative vine/leaf elements |

### Gradients

- **Hero:** `linear-gradient(180deg, #1A1A1A 0%, #2A1A0A 40%, #3D1E00 70%, rgba(232, 93, 4, 0.1) 100%)`
- **Accent:** `linear-gradient(135deg, #E85D04, #FF8C00, #FFB703)`

### Typography

- **Headings:** Playfair Display (serif) — elegant, editorial feel
- **Body:** Inter (sans-serif) — clean, modern readability

### Visual Patterns

- Glassmorphism panels (blur backdrop, semi-transparent)
- Mehndi-style corner decorations on cards
- Lotus watermark backgrounds
- Text gradients (orange to gold)
- Ember/spark particle effects (canvas)
- Animated garland dividers (SVG with flowers)
- Animated rangoli patterns (SVG, multi-layer stroke drawing)

---

## Page-by-Page Content

---

### 1. HOME PAGE (`/`)

#### Hero Section
- **Edition Label:** "28th Annual Edition" (shimmer animation)
- **Title:** "Dushahra 2026" (character-by-character GSAP reveal)
- **Subtitle:** "October 10th | New Jersey"
- **Rain Date:** "Rain Date: October 24th"
- **Countdown Timer:** Live countdown to October 10, 2026 (days, hours, minutes, seconds)
- **CTA Buttons:**
  - "Book a Booth" → `/booth-booking` (primary, glowing)
  - "View Schedule" → `/events` (secondary, outlined)
- **Background:** Ember particle system (50 particles, 0.7 intensity)

#### Event Location Section
- **Title:** "Event Locations"
- **Location:** "NEW JERSEY"
- **Address:** "Lake Papaianni Park, 100 Municipal Blvd, Edison, NJ 08817"
- **Button:** "View Location" → Google Maps link
- **Visual:** Location pin icon with pulse animation, shimmer card effect

#### Highlights Section
- **Title:** "Experience the Magic of Dushahra"
- **Subtitle:** "Join thousands of families in celebrating the triumph of good over evil. The 28th Edition brings tradition, food, and festivity to New Jersey."

| Card | Image Description | Icon | Description | CTA |
|---|---|---|---|---|
| Ravan Dahan | 50-foot Ravan Effigy | Flame | "Witness the spectacular burning of the 50-foot effigies, a majestic symbol of victory and light." | "View Schedule →" |
| Ram Leela | Ram Leela performance | Bow & Arrow | "Enjoy the dramatic folk re-enactment of the life of Lord Rama, performed by talented local artists." | "Learn More →" |
| Meena Bazaar | Cultural Programs | Bazaar Bag | "Shop for traditional clothing, jewelry, and crafts, and taste incredible food from our diverse vendors." | "Become a Vendor →" |

#### Sponsor Marquee
- **Title:** "Proud Sponsors of Dushahra"
- **Subtitle:** "Supported by our generous community partners"
- **Display:** Auto-scrolling dual-row marquee (forward + reverse), pauses when off-screen
- **Sponsors:** 40 logos (see Sponsors section below for full list)

---

### 2. ABOUT US PAGE (`/about`)

#### Header
- **Title:** "About Us"
- **Subtitle:** "Preserving Cultural Heritage in New Jersey"

#### Section 1: How it Started
Indo-American Festivals (IAF) was formed by the late Mr. Mangal Gupta in 1999 to celebrate the Dushahra Festival in the United States. Unlike Holi, Diwali, and Janmashtami which were already celebrated, Dushahra — with its requirement to burn 25-30 foot Ravan effigies — needed special fire safety permits and open grounds. The first festival was held on October 9, 1999 in East Brunswick Township, NJ. The inaugural guest was New Jersey Governor Christine Wittman.

#### Section 2: Our Mission & Aim
1. **What We Do:** Celebrate 'Victory of Good over evil' annually through the grand Dussehra festival
2. **Why We Do It:** Children and adults learn respect, tolerance, sacrifice, sharing, and family values from Lord Rama's life and the Ramayana
3. **Our Aim:** Strengthen bonds between democracies; cultivate cultural heritage in the younger generation growing up abroad

#### Section 3: About the Event
Over 10,000 people attend each year. Admission and parking are free. The event is funded by Middlesex County grants, local business sponsorships, and stall vendor fees. A team of dedicated volunteers and board donations helps cover any shortfalls.

---

### 3. EVENTS / SCHEDULE PAGE (`/events`)

#### Header
- **Title:** "Event Schedule"
- **Subtitle:** "October 10th, 2026 | Rain Date: October 24th"

#### Event Timeline

| # | Event | Time | Location | Icon | Description |
|---|---|---|---|---|---|
| 1 | Meena Bazaar | 1:00 PM – 8:00 PM | Main Grounds | Ghungroo (ankle bells) | A vibrant marketplace featuring traditional Indian clothing, exquisite jewelry, handicrafts, and diverse food stalls offering authentic regional delicacies from across India. |
| 2 | Cultural Performances | 2:00 PM – 5:00 PM | Center Stage | Mudra (hand gesture) | Enjoy a spectacular lineup of classical, folk, and contemporary Indian dance performances by talented troupes from the local community and beyond. |
| 3 | Ram Leela | 5:30 PM – 7:00 PM | Center Stage | Bow & Arrow | A captivating dramatic folk re-enactment of the epic Ramayana. Watch the legendary tale of Lord Rama unfold through dramatic storytelling and elaborate costumes. |
| 4 | Ravan Dahan | 7:30 PM | Open Field | Flame (animated) | The grand finale of Dushahra. Join thousands of spectators to witness the spectacular burning of the 50-foot effigy of Ravana, symbolizing the triumph of good over evil. |

#### Easter Eggs
- **Konami-style:** Type "rama" anywhere on the page → opens fullscreen arrow game
- **Icon trick:** Click the bow & arrow icon 3 times within 2 seconds → opens fullscreen arrow game

#### Inline Mini-Game: Arrow Dash
- Appears between event cards 2 and 3
- Small canvas game (900x200px)
- Objective: Hit 5 moving Ravana-head targets in 30 seconds
- Click to fire arrows from a bow on the left side
- Best score saved to localStorage

---

### 4. SPONSORS PAGE (`/our-sponsors`)

#### Header
- **Title:** "Our Sponsors"
- **Subtitle:** "We deeply appreciate the unified support of all our community partners."

#### Sponsor List (40 total)
Named sponsors include:
1. Chowpatty
2. EBC Radio
3. Grafine
4. ITV
5. PNC Bank
6. Royal Albert
7. Sai
8. Samosa Factory
9. Sewa
10. Star Tours
11. Suhag Jewelers
12. TV Asia
13–40. Additional community sponsors

Display: Responsive grid with lazy-loaded logos and hover effects.

---

### 5. BOOTH BOOKING PAGE (`/booth-booking`)

#### Header
- **Title:** "Vendor Booth Booking"
- **Subtitle:** "Reserve your space at the 2026 Dushahra Festival"

#### Non-Food Vendor Pricing

| Booth Type | Size | Price | Includes | Notes |
|---|---|---|---|---|
| Dedicated Booth | 20×20 | $1,500 | 4 Tables, 4 Chairs | Permit Included |
| Dedicated Booth | 20×10 | $1,100 | 2 Tables, 2 Chairs | Permit Included |
| Dedicated Booth | 10×10 | $900 | 1 Table, 2 Chairs | Permit Included |
| Self Booth | 10×10 | $1,000 | 1 Table, 2 Chairs | Permit Fee $25 extra — Tent/Canopy provided by vendor |
| Split Booth | 20×10/2 | $650 | 1 Table, 2 Chairs | Permit Included |
| Split Booth | 20×20/4 | $500 | 1 Table, 2 Chairs | Permit Included |
| Table in Open Area | — | $300 | 1 Table, 1 Chair | — |

#### Food Vendor Pricing

| Booth Type | Size | Price | Includes | Notes |
|---|---|---|---|---|
| Dedicated Booth | 20×20 | $3,500 | 4 Tables, 4 Chairs | Permit NOT included — must be obtained by vendor. **Vegetarian food only.** |

#### Add-Ons

| Add-On | Price |
|---|---|
| Extra Table | $25 |
| Extra Chair | $10 |
| Ads Displayed on Screen | Contact Us |
| Physical Banner Space | Contact Us |

#### Booth Booking Contact Persons
- **Chanchal Gupta:** (732) 360-2059
- **Raj Mittal:** (732) 423-4619
- **Shalini Chabra:** (732) 915-5634

#### Cancellation Policy
- **Before July 31st:** Full refund
- **August 1 – September 10, 2026:** 50% refund based on full published booth price
- **After September 10, 2026:** No refund
- **Rain date changes:** No refund
- **Acts of God:** No refund

#### Multi-Step Booking Flow

**Step 1 — Booking Form:**
| Field | Type | Required |
|---|---|---|
| Booth Type | Dropdown (all booth options) | Yes |
| Additional Chairs | Number | No |
| Additional Tables | Number | No |
| Contact Person Name | Text | Yes |
| Title | Text | No |
| Phone Number | Tel | Yes |
| Business/Organization Name | Text | Yes |
| Postal Address | Text | Yes |
| City | Text | Yes |
| Email Address | Email | Yes |
| Tax ID | Text | No |
| Vendor/Food Permit | Text | No |
| Date | Date | No |
| Description of Items to be Sold | Textarea | Yes |

**Step 2 — Zelle Payment Instructions:**
After form submission, a success card appears with:
- Recipient: **Indo-American Festivals, Inc.**
- Zelle Email: **dushahra.usa@gmail.com**
- Amount Due: (calculated from booth type + add-ons)
- **Important:** Must include Business Name in the memo field
- Note: Booth is NOT reserved until staff verifies the transfer

**Step 3 — Payment Verification Form:**
| Field | Type | Required |
|---|---|---|
| Zelle Sender Name | Text | Yes |
| Zelle Confirmation Screenshot | File Upload | Yes |
| Confirmation / Transaction Code | Text | Yes |

**Step 4 — Final Confirmation:**
- "Thank You" message displayed
- Option to "Submit Another Application"

---

### 6. CONTACT US PAGE (`/contact-us`)

#### Header
- **Title:** "Contact Us"
- **Subtitle:** "We would love to hear from you"

#### Contact Information
| Type | Value |
|---|---|
| Location | Lake Papaianni Park, 100 Municipal Blvd, Edison, NJ 08817 |
| Email | dushahra.usa@gmail.com |
| Phone | (732)-444-8381 |
| Fax | 610-427-5277 |

#### Contact Form
| Field | Type | Required |
|---|---|---|
| Full Name | Text | Yes |
| Email Address | Email | Yes |
| Subject | Text | Yes |
| Message | Textarea | Yes |

---

### 7. VOLUNTEER PAGE (`/volunteer`)

#### Header
- **Title:** "Volunteer With Us"
- **Subtitle:** "Join our team and make a difference"

#### Introduction
Indo-American Festivals, Inc. (IAF) welcomes volunteers of all ages and backgrounds. IAF is approved for the **President's Volunteer Service Award (PVSA)** program — volunteers can earn national recognition through their service hours.

#### Downloadable Document
- **Volunteer Agreement PDF:** `/IAF-Volunteer_Agreement_and_Policy-2023.pdf`

#### Volunteer Sign-Up Form
| Field | Type | Required |
|---|---|---|
| Your Name | Text | Yes |
| Email | Email | Yes |
| Contact Number | Tel | Yes |
| Address | Textarea | Yes |
| Resume/Document Upload | File | No |
| Agree to Terms | Checkbox (links to PDF) | Yes |

---

### 8. FAMILY / TEAM PAGE (`/family`)

#### Header
- **Title:** "Our Family"
- **Subtitle:** "The People Behind the Festival"

#### Introduction
"Indo-American Festivals is more than an organization — it is a family bound by shared love for our cultural heritage. From the visionary founders who lit the first Ravan effigy in 1999 to the dedicated volunteers who bring the celebration to life each year, every member plays a vital role in keeping the spirit of Dussehra alive in New Jersey."

#### Executive Committee (11 members)

| Name | Role |
|---|---|
| Lt. Shri Mangal Gupta | Founder |
| Mrs. Chanchal Gupta | Co-Founder |
| Mr. Raj Mittal | Co-Founder |
| Dinesh Mittal | Past President |
| Shalini Chabra | Secretary |
| Dr. Rajeev Mehta | Past Executive Vice President |
| Shiva Arya | Vice President |
| Kunal Mehta | Vice President |
| Ritesh Maheshwari | Executive Vice President |
| Mr. Atul Sharma | Past President |
| Mr. Rajendra Prasad | Past Co-Chair |

#### Ram Leela / Cultural Events Council (3 members)

| Name | Role |
|---|---|
| Varsha Naik | Ram Leela Organizer — Navrang Dance Academy |
| Pratibha Nichakawade | Cultural Program Coordinator |
| Kunal Mehta | Cultural Program Coordinator & Vice President |

#### IAF Members & Volunteers (12 members)

| Name |
|---|
| Ritesh Maheshwari |
| Sharad Agarwal |
| Ashvin Kumar |
| Ravi Dhingra |
| Raj Agrawal |
| Shweta Agrawal |
| Sitij Mittal |
| Sudha Sharma |
| Preeti Mittal |
| Nakul Mittal |
| Rajiv Mittal |
| Dolly P Mittal |

#### Rawan Effigy Council (5 members)

| Name | Role |
|---|---|
| Krishan G Singhal | Chairman |
| Dr. Ravindra Goyal | — |
| Sitij Mittal | — |
| Raj Agrawal | — |
| Bacchubhai Patel | — |

#### Vendor / Booth Management Council (2 members)

| Name |
|---|
| Shiva Arya |
| Shalini Chabra |

#### Promotion / SM / Technology Council (3 members)

| Name |
|---|
| Dinesh Mittal |
| Dolly Mittal |
| Raj Mittal |

#### Stage / Lights / Ground Council (3 members)

| Name |
|---|
| Sitij Mittal |
| Raj Agarwal |
| Shri P Mittal |

#### Media / PR Council (6 members)

| Name |
|---|
| Dr. Rajeev Mehta |
| Chanchal Gupta |
| Shalini Chabra |
| Ritesh Maheshwari |
| Varsha Naik |
| Pratibha Nichakawade |

---

### 9. PHOTO GALLERY (`/photos`)

#### Header
- **Title:** "Photo Gallery"
- **Subtitle:** "A look back at our magnificent celebrations"

#### Photos (9 images)
All from past Dushahra festivals (2022 editions). Displayed in a responsive grid with lazy loading, parallax hover effect, and staggered reveal animations. Background has low-density ember particles.

| # | Caption/Description |
|---|---|
| 1 | Festival Crowd |
| 2 | Ram Leela Performance |
| 3 | Decorations |
| 4 | Food Stalls |
| 5 | Ravan Dahan Setup |
| 6 | Community Gathering |
| 7 | Festivities |
| 8 | Evening Program |
| 9 | Main Wide Shot |

---

### 10. VIDEO HIGHLIGHTS (`/videos`)

#### Header
- **Title:** "Video Highlights"
- **Subtitle:** "Watch the magic of the festival unfold"

#### Videos (4 YouTube embeds)

| # | Title |
|---|---|
| 1 | Dushahra 27th Edition Highlights |
| 2 | Ram Leela Performance 2025 |
| 3 | Ravan Dahan 2025 Full Video |
| 4 | Community Interviews |

---

### 11. PRESS & MEDIA (`/media-coverage-and-press-releases`)

#### Header
- **Title:** "Press & Media Coverage"
- **Subtitle:** "Official press releases and media resources"

#### Press Releases (3 documents)

| # | Title | Date | Size | Format |
|---|---|---|---|---|
| 1 | 28th Edition Dushahra Press Release | August 15, 2026 | 1.2 MB | PDF |
| 2 | Media Alert: Ravan Dahan Schedule | September 10, 2026 | 0.8 MB | PDF |
| 3 | Sponsorship Prospectus 2026 | April 5, 2026 | 3.4 MB | PDF |

---

### 12. 404 NOT FOUND PAGE (`*`)

Fallback for any unknown route. Redirects or displays a "page not found" message.

---

## Key Contact Persons

| Name | Phone | Role Context |
|---|---|---|
| Chanchal Gupta | (732) 360-2059 | Co-Founder, Booth booking contact |
| Raj Mittal | (732) 423-4619 | Co-Founder, Booth booking contact |
| Amit Gupta | (817) 714-6267 | General contact |
| VishvJeet | (512) 657-8678 | General contact |
| Shiva Arya | (732) 572-2675 | VP, Vendor management |
| Shalini Chabra | (732) 915-5634 | Secretary, Booth booking contact |

---

## Custom Cultural Icon Library (17 icons)

All icons are monoline SVG, inherit color from `currentColor`, and support a `size` prop.

| Icon | Represents | Animation |
|---|---|---|
| GhungrooIcon | Meena Bazaar / ankle bells | Jingle on hover |
| MudraIcon | Cultural performances / dance hand gesture | Wave on hover |
| BowArrowIcon | Ram Leela / bow and arrow | Arrow slides forward on hover |
| LotusIcon | Section dividers / purity | Petals bloom outward on hover |
| FlameIcon | Ravan Dahan / fire | Flickering flame animation |
| OmIcon | Sacred syllable | Gentle glow on hover |
| ConchIcon | Victory proclamation | Vibrates subtly on hover |
| CheckmarkIcon | Form confirmations | Draws in on appearance |
| LocationPinIcon | Event location (temple dome inside pin) | Pulse |
| MailIcon | Email contact (envelope with seal) | — |
| PhoneIcon | Phone contact | — |
| FaxIcon | Fax contact | — |
| PaymentIcon | Zelle payments (coin with dollar sign) | — |
| ClockIcon | Time display | — |
| ShieldCheckIcon | Booking confirmation (shield + checkmark) | — |
| AlertIcon | Warnings (triangle + exclamation) | — |
| BazaarIcon | Meena Bazaar (shopping bag with pattern) | — |

---

## Interactive Games

### Game 1: Rama's Arrow (Fullscreen)

**Trigger:** Type "rama" on Events page, or click bow icon 3x within 2 seconds.

- **Objective:** Hit 7 of 10 Ravana heads/body parts to win
- **Mechanic:** Slingshot-style aiming — drag away from bow to aim, release to fire
- **Physics:** Arrow flight with gravity
- **Ammo:** 10 arrows maximum
- **Targets:** 10 heads arranged in a pyramid formation
- **Effects:** Fire particles on hits, full effigy burning animation on win
- **Timer:** Starts on first arrow fire, best time saved to localStorage
- **Input:** Mouse/Touch drag-to-aim OR keyboard (arrow keys to rotate, Up to charge, Space to fire)
- **UI:** Arrows remaining (top-left), timer (top-center), best time (top-right), hit streak (center), crowd silhouettes at ground level, night sky with stars
- **States:** Ready → Aiming → Flying → Hit → Win/Lose

### Game 2: Arrow Dash (Inline Mini-Game)

**Location:** Events page, between event cards 2 and 3.

- **Canvas:** 900×200px (responsive)
- **Objective:** Hit 5 moving targets in 30 seconds
- **Mechanic:** Click anywhere to fire arrow from static bow on left side
- **Targets:** Ravana heads drift left across screen (speed: 40–100 px/s, radius: 10–16px)
- **Effects:** Spark explosions on hits
- **Best score** saved to localStorage
- **States:** Idle → Playing → Won/Lost

---

## Component Architecture

### Layout Components
| Component | Purpose |
|---|---|
| Navigation | Header nav with dropdown menus, mobile hamburger menu, keyboard accessible |
| Footer | 4-column footer with links, contact info, social links |
| Hero | Full-width hero with countdown timer, GSAP title animation, ember particles |
| EventLocation | Location display card with Google Maps link |
| Highlights | 3-card feature section showcasing main events |
| SponsorMarquee | Auto-scrolling dual-row sponsor logo marquee |
| EmberParticles | Canvas-based floating ember/spark particle system |
| GarlandDivider | Animated SVG garland with marigold flowers |
| RangoliIntro | Animated multi-layer SVG rangoli pattern |

### Page Components
| Component | Purpose |
|---|---|
| About | Organization history, mission, founding story |
| Events | Event schedule timeline with inline mini-game and easter eggs |
| Sponsors | Responsive grid of sponsor logos |
| BoothBooking | Multi-step booking form → Zelle payment → verification |
| Photos | Lazy-loaded responsive photo gallery |
| Videos | YouTube embed gallery |
| Press | Press release document download cards |
| ContactUs | Contact information + contact form |
| Volunteer | Volunteer info (PVSA program) + signup form |
| Family | Team member grid organized by council/committee |

---

## Animation & Effects Summary

| Effect | Where Used |
|---|---|
| Character-by-character GSAP SplitText reveal | Hero title |
| Canvas ember/spark particle system | Hero background, Photos background |
| SVG stroke-drawing garland with elastic flower swing-in | Section dividers (Family, About) |
| SVG multi-layer rangoli stroke animation | Family page intro |
| Scroll-triggered reveal (fade-in + translateY) | All sections on all pages |
| Shimmer text (moving gradient) | Hero edition label, page titles |
| Card hover (translateY -4px + shadow deepening) | All cards site-wide |
| Glow on hover (box-shadow pulse) | CTA buttons |
| Icon-specific micro-animations | Mudra wave, lotus bloom, arrow slide, flame flicker, conch vibrate, ghungroo jingle |
| Dual-row auto-scrolling marquee | Sponsor section |
| Parallax hover effect | Photo gallery images |
| Live countdown timer | Hero section |
| Float animation (subtle Y-axis bob) | Decorative elements |

---

## Accessibility

- Skip-to-content link (visually hidden, visible on focus)
- Semantic HTML throughout (nav, main, section, article)
- ARIA labels on all buttons and interactive elements
- Full keyboard navigation in Navigation component
- Focus trapping in mobile menu
- Contrast-compliant color scheme
- Alt text on all images
- Form labels properly associated with inputs
- Live region announcements for countdown timer
- Icons use `aria-hidden="true"` with text alternatives

---

## Performance Optimizations

- Lazy loading on all images and video iframes
- Visibility gating on expensive animations (embers, countdown, marquee pause when off-screen)
- `requestAnimationFrame` for smooth canvas rendering
- `ResizeObserver` for responsive canvas sizing
- `localStorage` caching for game best times/scores
- `React.Suspense` boundaries for lazy-loaded game components
- CSS custom properties for theming (propagate to canvas via `MutationObserver`)

---

## Form Submission Architecture

All forms use a shared `submitForm()` utility that POSTs to a Google Apps Script Web App URL. Each form submission includes a `form_type` field:

| Form | form_type Value |
|---|---|
| Contact Us | "Contact Us" |
| Booth Booking | "Booth Request" |
| Volunteer | "Volunteer Sign-Up" |
| Zelle Verification | "Zelle Verification" |

Currently configured with a simulated 1.2s delay for development (no backend URL set).

---

## SEO & Meta

- `robots.txt` and `sitemap.xml` present in `/public/`
- Hero background image at `/public/images/hero-bg.jpg`
- Page title: "Dushahra 2026"
- Meta description references 28th Annual Dussehra celebration in Edison, NJ
