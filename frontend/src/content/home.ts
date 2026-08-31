/* DRAFT copy — pending K Pearl Agency approval. No invented facts. */

export const HERO = {
  heading: 'Properties within Nairobi and its environs.',
  subheading:
    'K Pearl Agency helps you find a home or commercial space to rent or buy across Nairobi and its environs — and helps owners market their property with care.',
  primaryCta: { label: 'Browse properties', to: '/properties' },
  secondaryCta: { label: 'Talk to us', to: '/contact' },
} as const;

export const WHY_KPEARL = {
  heading: 'Why work with K Pearl',
  points: [
    {
      title: 'Local knowledge',
      body: 'We focus on Nairobi and the surrounding towns, so the guidance you get on price, location and timing is grounded in the areas we actually work in.',
    },
    {
      title: 'A clear process',
      body: 'From first enquiry to viewing to close, you deal with a named contact and know what happens next. No run-around.',
    },
    {
      title: 'Listings you can trust',
      body: 'Every property is prepared by our team with accurate details and a reference code. Verified listings carry a badge.',
    },
    {
      title: 'Responsive',
      body: 'Reach us by call, WhatsApp or the enquiry form and expect a prompt, straight answer.',
    },
  ],
} as const;

export const SECTIONS = {
  featured: {
    heading: 'Featured properties',
    subheading: 'A selection from our current listings.',
    cta: { label: 'View all properties', to: '/properties' },
  },
  latest: {
    heading: 'Latest listings',
    subheading: 'Recently added to the K Pearl catalogue.',
  },
  services: {
    heading: 'How we can help',
    subheading: 'Buying, renting, selling or letting — plus support for owners and relocations.',
    cta: { label: 'Explore our services', to: '/services' },
  },
  ownerCta: {
    heading: 'Have a property to let or sell?',
    body: 'Tell us about it and our team will follow up to prepare and market the listing.',
    cta: { label: 'List your property', to: '/list-your-property' },
  },
} as const;
