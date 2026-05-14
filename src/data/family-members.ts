export interface FamilyMember {
    name: string;
    role?: string;
    photo?: string;
}

export interface FamilySection {
    title: string;
    members: FamilyMember[];
}

export const FAMILY_DATA: FamilySection[] = [
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
