/*
 * DRAFT scaffolds only. The real Privacy Policy and Terms of Use must be
 * prepared and reviewed by a lawyer before launch (decision 16.a; Kenya Data
 * Protection Act 2019). This is a placeholder structure, not legal text.
 */

export const LEGAL_REVIEW_BANNER =
  'Draft for review. This wording has not yet been checked by a lawyer and is not the final policy.';

interface LegalSection {
  heading: string;
  body: string;
}

export const PRIVACY: { title: string; intro: string; sections: LegalSection[] } = {
  title: 'Privacy Policy',
  intro:
    'This page explains what personal information K Pearl Agency collects through this website, why, and what choices you have. It will be finalised with legal review before launch.',
  sections: [
    {
      heading: 'Information we collect',
      body: 'When you send an enquiry, request a viewing, submit a property, or contact us, we collect the details you provide — typically your name, phone number, email address and message.',
    },
    {
      heading: 'How we use it',
      body: 'We use your information only to respond to you and to provide the agency services you asked about.',
    },
    {
      heading: 'Sharing',
      body: 'We do not sell your information. We share it only with K Pearl staff handling your request, and where required by law.',
    },
    {
      heading: 'Retention',
      body: 'We keep enquiry information for as long as needed to assist you and to keep proper business records.',
    },
    {
      heading: 'Your rights',
      body: 'Under the Kenya Data Protection Act 2019 you may ask us for a copy of the information we hold about you, ask us to correct it, or ask us to delete it. Contact details are on the Contact page.',
    },
    {
      heading: 'Analytics',
      body: 'We use privacy-friendly website analytics that do not use cookies to identify you.',
    },
  ],
};

export const TERMS: { title: string; intro: string; sections: LegalSection[] } = {
  title: 'Terms of Use',
  intro:
    'These terms govern your use of the K Pearl Agency website. They will be finalised with legal review before launch.',
  sections: [
    {
      heading: 'About this site',
      body: 'This website provides information about properties K Pearl Agency represents and about our services. Property details are provided in good faith but may change; they do not form part of any contract.',
    },
    {
      heading: 'Enquiries and submissions',
      body: 'Sending an enquiry or submitting a property does not create an agency agreement. Any engagement is confirmed separately with K Pearl Agency.',
    },
    {
      heading: 'Acceptable use',
      body: 'Do not use this site to post unlawful content, to misrepresent yourself, or to interfere with its operation.',
    },
    {
      heading: 'Liability',
      body: 'We aim to keep information accurate and the site available, but we do not warrant that it is error-free or uninterrupted.',
    },
    {
      heading: 'Contact',
      body: 'Questions about these terms can be sent using the details on the Contact page.',
    },
  ],
};
