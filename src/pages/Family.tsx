import { RangoliIntro } from '../components/RangoliIntro';
import { GarlandDivider } from '../components/GarlandDivider';
import { PageHeader } from '../components/PageHeader';
import { FAMILY_DATA, FamilyMember } from '../data/family-members';
import './Family.css';

const PersonPlaceholderIcon = () => (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
                    width={56}
                    height={56}
                    loading="lazy"
                    decoding="async"
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
            <PageHeader title="Our Family" subtitle="The People Behind the Festival" templeArch shimmer />

            <RangoliIntro />

            <div className="family-intro glass-panel lotus-watermark reveal mt-spacing-8">
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
