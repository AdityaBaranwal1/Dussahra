export interface PricingTier {
    id: number;
    type: string;
    size: string;
    price: string;
    includes: string;
    note: string;
}

export interface AddOn {
    id: number;
    item: string;
    price: string;
}

export interface BoothOption {
    label: string;
    value: string;
    price: number;
    isSelfBooth: boolean;
}

export const PRICING_GENERAL: PricingTier[] = [
    { id: 1, type: 'Dedicated Booth', size: '20x20', price: '$1500', includes: '4 Tables – 4 Chairs', note: 'Permit Included' },
    { id: 2, type: 'Dedicated Booth', size: '20x10', price: '$1100', includes: '2 Tables – 2 Chairs', note: 'Permit Included' },
    { id: 3, type: 'Dedicated Booth', size: '10x10', price: '$900', includes: '1 Table – 2 Chairs', note: 'Permit Included' },
    { id: 4, type: 'Self Booth', size: '10x10', price: '$1000', includes: '1 Table – 2 Chairs', note: 'Permit Fee $25 extra — Tent/Canopy provided by vendor' },
    { id: 5, type: 'Split Booth', size: '20x10/2', price: '$650', includes: '1 Table – 2 Chairs', note: 'Permit Included' },
    { id: 6, type: 'Split Booth', size: '20x20/4', price: '$500', includes: '1 Table – 2 Chairs', note: 'Permit Included' },
    { id: 7, type: 'Table in Open Area', size: 'Table', price: '$300', includes: '1 Table – 1 Chair', note: '' },
];

export const PRICING_FOOD: PricingTier[] = [
    { id: 101, type: 'Dedicated Booth', size: '20x20', price: '$3500', includes: '4 Tables – 4 Chairs', note: 'Permit Not Included — must be obtained by vendor. Vegetarian food only.' },
];

export const ADD_ONS: AddOn[] = [
    { id: 201, item: 'Extra Table', price: '$25' },
    { id: 202, item: 'Extra Chair', price: '$10' },
    { id: 203, item: 'Ads Displayed on Screen', price: 'Contact Us' },
    { id: 204, item: 'Physical Banner Space', price: 'Contact Us' },
];

const priceToNumber = (s: string) => parseInt(s.replace(/[^0-9]/g, ''));

export const ALL_BOOTHS: BoothOption[] = [
    ...PRICING_GENERAL.map(t => ({
        label: `${t.type} - ${t.size} (${t.price})`,
        value: `${t.type} - ${t.size}`,
        price: priceToNumber(t.price),
        isSelfBooth: t.type === 'Self Booth',
    })),
    ...PRICING_FOOD.map(t => ({
        label: `Food: ${t.type} - ${t.size} (${t.price})`,
        value: 'Food/Snacks Booth',
        price: priceToNumber(t.price),
        isSelfBooth: false,
    })),
];

export const ADD_ON_CHAIR_PRICE = 10;
export const ADD_ON_TABLE_PRICE = 25;
export const SELF_BOOTH_PERMIT_FEE = 25;
