/*
 * DRAFT legal copy for K Pearl Agency.
 *
 * This is a project draft prepared from a Kenya-appropriate template so the
 * pages, structure and consent wording exist and are testable. It is NOT the
 * final policy. Before launch it must be reviewed and approved by a lawyer
 * qualified in Kenyan law (decision register 16.a / 22.b; Kenya Data
 * Protection Act 2019). The blanks the owner and lawyer must resolve, and the
 * DPA 2019 compliance checklist, are tracked in `docs/legal-review.md`.
 *
 * Edit here — there is no CMS (docs/decisions.md).
 */

/** Shown at the top of every legal page until a lawyer has signed the copy off. */
export const LEGAL_REVIEW_BANNER =
  'Draft for review. This wording has not yet been checked by a lawyer and is not the final policy.';

/**
 * Effective date. Stays as the draft marker until legal review is complete and
 * the owner sets a real date (see docs/legal-review.md).
 */
export const LEGAL_EFFECTIVE = 'Draft — not yet in force';

/**
 * Canonical consent wording for the public lead forms (decision register I-3).
 * `ConsentField.tsx` renders these fragments with a link to the Privacy Policy
 * between `before` and `after`, so the reviewable wording lives in one place.
 */
export const CONSENT_STATEMENT = {
  before: 'I have read the',
  linkText: 'Privacy Policy',
  after: 'and agree to K Pearl Agency contacting me about my enquiry.',
} as const;

interface LegalSection {
  heading: string;
  /** One or more paragraphs of plain text (no inline markup). */
  body: string[];
  /** Optional bullet list rendered after the paragraphs. */
  bullets?: string[];
}

interface LegalDocument {
  title: string;
  intro: string;
  sections: LegalSection[];
}

export const PRIVACY: LegalDocument = {
  title: 'Privacy Policy',
  intro:
    'This Privacy Policy is the privacy notice of K Pearl Agency ("K Pearl", "we", "us"). It explains what personal information we collect through this website, why we collect it, the legal basis we rely on, who we share it with, how long we keep it, and the rights you have under the Kenya Data Protection Act 2019. It will be finalised with legal review before launch.',
  sections: [
    {
      heading: 'Who we are',
      body: [
        'K Pearl Agency is a real estate agency operating in Kenya. For the purposes of the Data Protection Act 2019, K Pearl Agency is the data controller for personal information collected through this website.',
        'You can reach us using the contact details on the Contact page of this website. Questions about this policy or about your personal information can be sent to the same contacts, marked for the attention of the person responsible for data protection.',
      ],
    },
    {
      heading: 'Information we collect',
      body: [
        'We only collect information you choose to give us and a small amount of technical information needed to run the site.',
      ],
      bullets: [
        'Contact and enquiry details: your name, phone number, email address and the message or request you send when you make an enquiry, request a viewing, or submit a property for us to represent.',
        'Property submission details: information about a property you ask us to market, which may include the address and details of the owner or contact person.',
        'Technical and usage information: aggregate, non-identifying analytics about page visits, collected without cookies. We do not use analytics that profile or track you across other websites.',
      ],
    },
    {
      heading: 'How we collect it',
      body: [
        'We collect this information directly from you when you complete a form on this website or contact us using the phone, WhatsApp or email details we publish. The analytics information is collected automatically by our hosting provider when your browser loads a page.',
      ],
    },
    {
      heading: 'Why we use it and our legal basis',
      body: [
        'Under section 30 of the Data Protection Act 2019 we must have a lawful basis for using your personal information. We use your information for the following purposes:',
      ],
      bullets: [
        'To respond to your enquiry and provide the agency service you asked about — on the basis of your consent, and to take steps at your request before entering into a contract.',
        'To arrange and follow up property viewings you request — to take steps at your request before entering into a contract.',
        'To assess and, if agreed, market a property you submit to us — to take steps at your request before entering into a contract, and our legitimate interest in operating an agency.',
        'To keep proper business and financial records — to comply with legal obligations that apply to us.',
        'To understand, in aggregate, how the website is used so we can improve it — our legitimate interest, using information that does not identify you.',
      ],
    },
    {
      heading: 'Who we share it with',
      body: [
        'We do not sell your personal information and we do not share it for anyone else’s marketing.',
        'We share it only with:',
      ],
      bullets: [
        'K Pearl Agency staff who are handling your enquiry, viewing or submission.',
        'Service providers who process data on our behalf under contract — our website hosting and database provider, and our email provider — and only so they can provide those services to us.',
        'A property owner or landlord, or their representative, where that is necessary to progress a viewing or transaction you have asked us to arrange.',
        'Authorities, advisers or other parties where we are required or permitted to do so by law, or to establish, exercise or defend legal claims.',
      ],
    },
    {
      heading: 'Storage and international transfers',
      body: [
        'Your information is stored in our providers’ cloud infrastructure, which may be located outside Kenya. Where personal information is transferred outside Kenya, we rely on the safeguards permitted by sections 48 and 49 of the Data Protection Act 2019, which may include your consent, the necessity of the transfer to perform the service you requested, or contractual protections with the provider.',
      ],
    },
    {
      heading: 'How long we keep it',
      body: [
        'We keep enquiry and viewing information for as long as needed to deal with your request and for a reasonable period afterwards to handle any follow-up, and we keep records we are legally required to retain for the period the law requires. Property submission information is kept for as long as we are engaged in relation to that property, and for a reasonable period afterwards. When information is no longer needed we delete it or anonymise it.',
      ],
    },
    {
      heading: 'How we protect it',
      body: [
        'We use technical and organisational measures appropriate to the sensitivity of the information, including encrypted connections, access controls that limit staff access to what each role needs, database-level security rules, and vetting of the service providers we use.',
      ],
    },
    {
      heading: 'Your rights',
      body: ['Under the Data Protection Act 2019 you have the right to:'],
      bullets: [
        'Be informed of how your personal information is being used — which is the purpose of this notice.',
        'Ask for a copy of the personal information we hold about you.',
        'Ask us to correct information that is inaccurate or incomplete.',
        'Ask us to delete your personal information where there is no good reason for us to keep it.',
        'Object to, or ask us to restrict, our use of your information in certain circumstances.',
        'Withdraw your consent at any time, where we rely on consent — this does not affect anything done before you withdrew it.',
      ],
    },
    {
      heading: 'How to exercise your rights or complain',
      body: [
        'To exercise any of these rights, contact us using the details on the Contact page. We will respond within the timeframe required by law. There is normally no charge, and we may need to confirm your identity before we act on a request.',
        'If you are not satisfied with how we have handled your information, you can lodge a complaint with the Office of the Data Protection Commissioner (ODPC) in Kenya via odpc.go.ke.',
      ],
    },
    {
      heading: 'Cookies and analytics',
      body: [
        'This website does not use cookies to identify you or to advertise to you. We use privacy-friendly, cookieless website analytics that give us aggregate visit counts only. Because no tracking cookies are set, there is no cookie consent banner.',
      ],
    },
    {
      heading: 'Children',
      body: [
        'This website and our services are intended for adults. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, contact us and we will delete it.',
      ],
    },
    {
      heading: 'Changes to this policy',
      body: [
        'We may update this policy from time to time. The effective date shown on this page will change when we do, and significant changes will be highlighted on the website.',
      ],
    },
  ],
};

export const TERMS: LegalDocument = {
  title: 'Terms of Use',
  intro:
    'These Terms of Use govern your access to and use of the K Pearl Agency website. By using this website you accept these terms. They will be finalised with legal review before launch.',
  sections: [
    {
      heading: 'About this website',
      body: [
        'This website is operated by K Pearl Agency. It provides information about properties we represent and about our services. It is an information and enquiry website only — it is not a platform for booking, payment, or completing a property transaction online.',
      ],
    },
    {
      heading: 'Property information',
      body: [
        'Property details, images, prices, measurements and availability are provided in good faith and are believed to be correct at the time of publication, but they may change and may contain errors or omissions. They are indicative only, do not form part of any offer or contract, and should not be relied on as statements of fact. You should verify any detail that matters to you directly with us before acting on it.',
      ],
    },
    {
      heading: 'Enquiries and submissions',
      body: [
        'Sending an enquiry, requesting a viewing, or submitting a property through this website does not create an agency agreement, a tenancy, or any other contract, and does not oblige either you or K Pearl Agency to proceed. Any engagement is agreed separately and in writing with K Pearl Agency. You are responsible for ensuring that information you submit is accurate and that you are entitled to provide it, including where it relates to a property or another person.',
      ],
    },
    {
      heading: 'Acceptable use',
      body: ['You agree not to use this website:'],
      bullets: [
        'to post or transmit unlawful, misleading, defamatory or infringing content;',
        'to misrepresent your identity or your connection to a property;',
        'to submit automated or bulk enquiries, or to attempt to gain unauthorised access to any part of the site or its systems;',
        'in any way that damages, disables or impairs the website or interferes with anyone else’s use of it.',
      ],
    },
    {
      heading: 'Intellectual property',
      body: [
        'The content of this website, including text, layout, graphics, the K Pearl Agency name and logo, and property photography commissioned by K Pearl Agency, is owned by K Pearl Agency or its licensors and is protected by law. You may view and print pages for your own personal, non-commercial use. You may not otherwise copy, republish or exploit the content without our written permission.',
      ],
    },
    {
      heading: 'Third-party links',
      body: [
        'This website may link to third-party websites and services, such as a map or messaging provider. We do not control those services and are not responsible for their content or their handling of your information. Their own terms and privacy notices apply.',
      ],
    },
    {
      heading: 'Availability and liability',
      body: [
        'We aim to keep the website accurate and available, but we provide it "as is" and do not warrant that it will be uninterrupted, error-free or free of harmful components. To the fullest extent permitted by law, K Pearl Agency is not liable for any loss or damage arising from your use of, or inability to use, this website, or from reliance on any content on it. Nothing in these terms excludes any liability that cannot lawfully be excluded.',
      ],
    },
    {
      heading: 'Privacy',
      body: [
        'Our use of personal information you provide through this website is described in the Privacy Policy, which forms part of these terms.',
      ],
    },
    {
      heading: 'Governing law',
      body: [
        'These terms are governed by the laws of Kenya, and the courts of Kenya have exclusive jurisdiction over any dispute arising out of or in connection with them or your use of this website.',
      ],
    },
    {
      heading: 'Changes and contact',
      body: [
        'We may update these terms from time to time; the version published on this website applies to your use of it. Questions about these terms can be sent using the details on the Contact page.',
      ],
    },
  ],
};
