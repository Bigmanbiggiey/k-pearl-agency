/* DRAFT copy — pending K Pearl Agency approval. No invented facts. */

export interface ServiceEntry {
  id: string;
  title: string;
  blurb: string;
  includes: string[];
  cta: { label: string; to: string };
}

export const SERVICES_INTRO =
  'K Pearl Agency is a marketing-led real estate agency. We represent property to rent and to buy, and we work on behalf of buyers, tenants and owners across Nairobi and its environs.';

export const SERVICES: ServiceEntry[] = [
  {
    id: 'sales-marketing',
    title: 'Property sales & marketing',
    blurb:
      'We market properties for sale — presenting them well, reaching the right buyers, and guiding the process through to close.',
    includes: [
      'Listing preparation: accurate details, photography and a reference code',
      'Exposure through our channels and enquiry handling',
      'Viewings coordinated by a named agent',
      'Support through offer and close',
    ],
    cta: { label: 'List a property for sale', to: '/list-your-property' },
  },
  {
    id: 'letting',
    title: 'Letting & tenant sourcing',
    blurb:
      'For landlords: we prepare the listing, find and screen tenants, and hand over an organised, ready-to-let property.',
    includes: [
      'Rental valuation guidance for the area',
      'Marketing and enquiry management',
      'Tenant viewings and basic screening',
      'Handover coordination',
    ],
    cta: { label: 'List a property to let', to: '/list-your-property' },
  },
  {
    id: 'property-search',
    title: 'Property search for buyers & tenants',
    blurb:
      'Tell us what you are looking for and your budget. We shortlist suitable options and arrange viewings so you spend time only on properties worth seeing.',
    includes: [
      'A brief-based shortlist from our catalogue and network',
      'Viewings arranged around your schedule',
      'Straightforward advice on price and location',
    ],
    cta: { label: 'Start a property search', to: '/contact' },
  },
  {
    id: 'relocation',
    title: 'Relocation support',
    blurb:
      'For individuals and companies moving to Nairobi: help finding the right home or office and settling in.',
    includes: [
      'Area orientation based on commute, budget and needs',
      'A shortlist of homes or commercial space',
      'Viewings and move-in coordination',
    ],
    cta: { label: 'Enquire about relocation', to: '/contact' },
  },
];
