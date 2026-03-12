import { RangoliIntro } from '../components/RangoliIntro';
import { GarlandDivider } from '../components/GarlandDivider';
import './Family.css';

interface FamilyMember {
    name: string;
    role?: string;
    photo?: string;
}

interface FamilySection {
    title: string;
    members: FamilyMember[];
}

const FAMILY_DATA: FamilySection[] = [
    {
        title: 'Executive Committee',
        members: [
            { name: 'Lt. Shri Mangal Gupta', role: 'Founder', photo: '/images/family/mangal-gupta.jpg' },
            { name: 'Mrs. Chanchal Gupta', role: 'Co-Founder', photo: '/images/family/chanchal-gupta.jpg' },
            { name: 'Mr. Raj Mittal', role: 'Co-Founder', photo: '/images/family/raj-mittal.jpg' },
            { name: 'Dinesh Mittal', role: 'Past President', photo: '/images/family/dinesh-mittal.jpg' },
            { name: 'Shalini Chabra', role: 'Secretary', photo: '/images/family/shalini-chabra.jpg' },
            { name: 'Dr. Rajeev Mehta', role: 'Past Executive Vice President', photo: '/images/family/rajeev-mehta.jpg' },
            { name: 'Shiva Arya', role: 'Vice President', photo: '/images/family/shiva-arya.jpg' },
            { name: 'Kunal Mehta', role: 'Vice President', photo: '/images/family/kunal-mehta.jpg' },
            { name: 'Ritesh Maheshwari', role: 'Executive Vice President', photo: '/images/family/ritesh-maheshwari.jpg' },
            { name: 'Mr. Atul Sharma', role: 'Past President' },
            { name: 'Mr. Rajendra Prasad', role: 'Past Co-Chair' },
        ],
    },
    {
        title: 'Ram Leela / Cultural Events Council',
        members: [
            { name: 'Varsha Naik', role: 'Ram Leela Organizer — Navrang Dance Academy', photo: '/images/family/varsha-naik.jpg' },
            { name: 'Pratibha Nichakawade', role: 'Cultural Program Coordinator', photo: '/images/family/pratibha-nichakawade.jpg' },
            { name: 'Kunal Mehta', role: 'Cultural Program Coordinator & Vice President', photo: '/images/family/kunal-mehta.jpg' },
        ],
    },
    {
        title: 'IAF Members & Volunteers',
        members: [
            { name: 'Ritesh Maheshwari', photo: '/images/family/ritesh-maheshwari.jpg' },
            { name: 'Sharad Agarwal', photo: '/images/family/sharad-agarwal.jpg' },
            { name: 'Ashvin Kumar' },
            { name: 'Ravi Dhingra' },
            { name: 'Raj Agrawal', photo: '/images/family/raj-agrawal.jpg' },
            { name: 'Shweta Agrawal', photo: '/images/family/shweta-agrawal.jpg' },
            { name: 'Sitij Mittal', photo: '/images/family/sitij-mittal.jpg' },
            { name: 'Sudha Sharma', photo: '/images/family/sudha-sharma.jpg' },
            { name: 'Preeti Mittal', photo: '/images/family/preeti-mittal.jpg' },
            { name: 'Nakul Mittal', photo: '/images/family/nakul-mittal.jpg' },
            { name: 'Rajiv Mittal', photo: '/images/family/rajiv-mittal.jpg' },
            { name: 'Dolly P Mittal', photo: '/images/family/dolly-mittal.jpg' },
        ],
    },
    {
        title: 'Rawan Effigy Council',
        members: [
            { name: 'Krishan G Singhal', role: 'Chairman', photo: '/images/family/krishan-singhal.jpg' },
            { name: 'Dr. Ravindra Goyal', photo: '/images/family/ravindra-goyal.jpg' },
            { name: 'Sitij Mittal', photo: '/images/family/sitij-mittal.jpg' },
            { name: 'Raj Agrawal', photo: '/images/family/raj-agrawal.jpg' },
            { name: 'Bacchubhai Patel' },
        ],
    },
    {
        title: 'Vendor / Booth Management Council',
        members: [
            { name: 'Shiva Arya', photo: '/images/family/shiva-arya.jpg' },
            { name: 'Shalini Chabra', photo: '/images/family/shalini-chabra.jpg' },
        ],
    },
    {
        title: 'Promotion / SM / Technology Council',
        members: [
            { name: 'Dinesh Mittal', photo: '/images/family/dinesh-mittal.jpg' },
            { name: 'Dolly Mittal', photo: '/images/family/dolly-mittal.jpg' },
            { name: 'Raj Mittal', photo: '/images/family/raj-mittal.jpg' },
        ],
    },
    {
        title: 'Stage / Lights / Ground Council',
        members: [
            { name: 'Sitij Mittal', photo: '/images/family/sitij-mittal.jpg' },
            { name: 'Raj Agarwal', photo: '/images/family/raj-agrawal.jpg' },
            { name: 'Shri P Mittal', photo: '/images/family/shri-p-mittal.jpg' },
        ],
    },
    {
        title: 'Media / PR Council',
        members: [
            { name: 'Dr. Rajeev Mehta', photo: '/images/family/rajeev-mehta.jpg' },
            { name: 'Chanchal Gupta', photo: '/images/family/chanchal-gupta.jpg' },
            { name: 'Shalini Chabra', photo: '/images/family/shalini-chabra.jpg' },
            { name: 'Ritesh Maheshwari', photo: '/images/family/ritesh-maheshwari.jpg' },
            { name: 'Varsha Naik', photo: '/images/family/varsha-naik.jpg' },
            { name: 'Pratibha Nichakawade', photo: '/images/family/pratibha-nichakawade.jpg' },
        ],
    },
];

const PersonPlaceholderIcon = () => (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="20" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
        <path
            d="M8 48c0-11.046 8.954-20 20-20s20 8.954 20 20"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
        />
    </svg>
);

const isFounder = (role?: string) =>
    role === 'Founder' || role === 'Co-Founder';

const MemberCard = ({ member }: { member: FamilyMember }) => (
    <div className={`family-card reveal${isFounder(member.role) ? ' family-card--founder' : ''}`}>
        <div className="family-card-photo-wrap">
            {member.photo ? (
                <img
                    src={member.photo}
                    alt={member.name}
                    className="family-card-photo"
                    loading="lazy"
                />
            ) : (
                <div className="family-card-placeholder">
                    <PersonPlaceholderIcon />
                </div>
            )}
        </div>
        <h3 className="family-card-name">{member.name}</h3>
        {member.role && <p className="family-card-role">{member.role}</p>}
    </div>
);

const SectionDivider = () => (
    <div className="family-divider-wrap" aria-hidden="true">
        <GarlandDivider />
    </div>
);

export const Family = () => {
    return (
        <div className="family-page">
            <div className="page-header temple-arch">
                <div className="container">
                    <h1 className="page-title text-shimmer">Our Family</h1>
                    <p className="page-subtitle">The People Behind the Festival</p>
                </div>
            </div>

            <RangoliIntro />

            <div className="family-intro glass-panel lotus-watermark reveal" style={{ marginTop: 'var(--spacing-8)' }}>
                <p>
                    Indo-American Festivals is more than an organization — it is a family bound by shared love
                    for our cultural heritage. From the visionary founders who lit the first Ravan effigy in 1999
                    to the dedicated volunteers who bring the celebration to life each year, every member plays a
                    vital role in keeping the spirit of Dussehra alive in New Jersey.
                </p>
            </div>

            {FAMILY_DATA.map((section, i) => (
                <div key={section.title}>
                    {i > 0 && <SectionDivider />}
                    <section className="family-section reveal">
                        <div className="family-section-header">
                            <h2 className="family-section-title">
                                <span className="text-gradient">{section.title}</span>
                            </h2>
                            <span className="family-section-ornament" aria-hidden="true" />
                        </div>
                        <div className="family-grid">
                            {section.members.map((member, j) => (
                                <MemberCard key={`${section.title}-${j}`} member={member} />
                            ))}
                        </div>
                    </section>
                </div>
            ))}
        </div>
    );
};
