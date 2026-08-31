# K Pearl Agency — Legal Review & Kenya Data Protection Act 2019 Checklist

Phase 7 tranche 4. This document is the handoff to the owner and the owner's
lawyer. It records what the project has built, what remains a legal/business
decision, and a section-by-section checklist against the Data Protection Act
2019 (Kenya) ("DPA 2019") and the Data Protection (General) Regulations 2021
and the Data Protection (Registration of Data Controllers and Data Processors)
Regulations 2021.

**Status: NOT cleared for launch.** The Privacy Policy and Terms of Use
currently shipped (`frontend/src/content/legal.ts`) are a project draft from a
Kenya-appropriate template. Every legal page shows a visible "not yet checked
by a lawyer" banner (`LEGAL_REVIEW_BANNER`) and a draft effective-date marker
(`LEGAL_EFFECTIVE`). Both must be removed only after sign-off.

## 1. What the project has implemented

- **Privacy Policy** page (`/privacy`) — full draft structured as a DPA 2019
  privacy notice: controller identity, data collected, collection method,
  purposes with a stated lawful basis for each, recipients, storage /
  international transfers, retention, security, data-subject rights, how to
  exercise them and how to complain to the ODPC, cookies/analytics, children,
  and change process.
- **Terms of Use** page (`/terms`) — full draft: site scope, property-info
  disclaimer, enquiries create no agency agreement, acceptable use,
  intellectual property, third-party links, availability/liability, privacy
  cross-reference, governing law (Kenya), change/contact.
- **Consent checkbox** on all three public lead forms (enquiry, viewing
  request, property submission) — required opt-in (`z.literal(true)` in the
  Zod schemas), links to the Privacy Policy. Canonical wording is in one place
  (`CONSENT_STATEMENT` in `frontend/src/content/legal.ts`), rendered by
  `ConsentField.tsx`.
- **Cookieless analytics** — Vercel Web Analytics; no tracking cookies, so no
  consent banner is required (decision register G.4 / L-3).
- **Data minimisation in the pipeline** — public forms INSERT only; anon role
  has no SELECT back on `inquiries`, `viewing_requests`,
  `property_submissions`; public property views strip owner PII and exact
  address (`docs/security.md`, `docs/launch-audit.md` §Security).
- **Security safeguards** — RLS on every table, TLS in transit, role-scoped
  staff access, Storage MIME/size limits. See `docs/security.md`.

## 2. Blanks the owner / lawyer must resolve

These appear in the draft as references to "the Contact page" or general
phrasing; the lawyer should confirm and the owner should supply concrete text.

| # | Item | Needed |
| --- | --- | --- |
| L1 | Registered legal entity name | The exact name of the legal person that is the data controller (sole proprietorship / limited company / partnership). Draft uses the trading name "K Pearl Agency". |
| L2 | Physical / postal address | A registered office or business address for the privacy notice and terms. Owner facts currently record none. |
| L3 | Data protection contact | Name or role and a dedicated address/email for data-subject requests and complaints. Draft points to the Contact page. Confirm whether a formal Data Protection Officer is required (see §3, item 12). |
| L4 | Effective date | Real date to replace `LEGAL_EFFECTIVE = 'Draft — not yet in force'` once signed off. |
| L5 | Retention periods | Concrete periods for enquiry/viewing records, property-submission records, and any statutory financial-record retention. Draft says "a reasonable period" / "as required by law". |
| L6 | Named sub-processors | Whether to name the hosting/database provider (Supabase) and email provider explicitly, and the transfer safeguard relied on (§3, item 9). |
| L7 | Consent wording (I-3) | Confirm `CONSENT_STATEMENT` is an adequate lawful-basis opt-in, or supply replacement text. |
| L8 | Complaint route | Confirm the ODPC reference and add any internal complaint step the lawyer wants stated. |

## 3. Kenya Data Protection Act 2019 — compliance checklist

Legend: **Done** (implemented in the build) · **Owner** (business action
outside the codebase) · **Lawyer** (needs legal confirmation).

| # | Obligation | Reference | Status | Notes |
| --- | --- | --- | --- | --- |
| 1 | Determine whether registration as a **data controller** with the ODPC is mandatory | Registration Regulations 2021 (turnover / employee thresholds; certain sectors always in scope) | **Owner + Lawyer** | Real-estate handling of client contact data plus property-owner data may bring K Pearl into scope regardless of size. If required, register before launch and put the registration number in the privacy notice. |
| 2 | Publish a **privacy notice** covering the section 29–30 disclosures | DPA 2019 s.29, s.30 | **Done (draft) + Lawyer** | `/privacy`. Lawyer to verify completeness and accuracy for K Pearl's actual operations. |
| 3 | Identify a **lawful basis** for every processing purpose | DPA 2019 s.30 | **Done (draft) + Lawyer** | Draft states consent + steps prior to contract + legal obligation + legitimate interest per purpose. Confirm each is correct. |
| 4 | Obtain and record **consent** where relied on; make it as easy to withdraw as to give | DPA 2019 s.32; Gen. Regs 2021 | **Done + Lawyer** | Unticked-by-default checkbox, submission blocked without it. No withdrawal-of-consent self-service UI — handled via a data-subject request to the Contact address; confirm this is acceptable. |
| 5 | Honour **data-subject rights** — information, access, rectification, erasure, objection, restriction, portability | DPA 2019 s.26, s.34–40; Gen. Regs 2021 Part IV | **Done (notice) + Owner** | Rights are stated in the notice. Owner needs a **documented internal process**: how a request is received, identity verification, locating data across Supabase tables + Storage + email, and responding within the statutory timeline. |
| 6 | Respond to requests within the statutory period | Gen. Regs 2021 (acknowledge within 7 days; resolve without undue delay) | **Owner** | Add to the internal process / staff runbook. |
| 7 | Assess whether a **Data Protection Impact Assessment** is required | DPA 2019 s.31 | **Lawyer** | Likely low risk (no large-scale sensitive data, no profiling, cookieless analytics), but the lawyer should record the assessment/decision. |
| 8 | Apply **data minimisation & purpose limitation** | DPA 2019 s.25 | **Done** | Forms collect only name/phone/email/message (+ property details on submission). INSERT-only, no anon read-back. |
| 9 | Lawful basis for **transfers outside Kenya** | DPA 2019 s.48–49 | **Done (draft) + Lawyer** | Data stored in cloud infrastructure that may be outside Kenya. Draft cites s.48–49 safeguards generically. Lawyer to confirm the specific basis (adequacy / contractual safeguards / necessity / consent) and whether the provider region should be disclosed (L6). |
| 10 | Put **data processing agreements** in place with processors | DPA 2019 s.42 | **Owner** | Execute / retain DPAs with the hosting-database provider (Supabase), the email provider, and Vercel (hosting + analytics). |
| 11 | Implement **security safeguards** appropriate to the risk | DPA 2019 s.41 | **Done** | RLS on all 8 tables, TLS, role-scoped staff access, Storage MIME/size allowlist, service-role key server-side only. Documented in `docs/security.md` / `docs/launch-audit.md`. |
| 12 | Appoint a **Data Protection Officer** if required | DPA 2019 s.24 | **Lawyer** | Mandatory only in certain cases. If not required, still name an internal contact (L3). |
| 13 | **Personal-data breach** notification process | DPA 2019 s.43; Gen. Regs 2021 | **Owner** | Document: detect → assess → notify the ODPC without undue delay (within 72 hours where feasible) → notify affected data subjects where required. Add to the runbook. |
| 14 | **Direct marketing** rules — prior opt-in, easy opt-out | DPA 2019 s.37 | **Done (n/a at launch)** | No newsletter or marketing send at launch. Any future marketing needs its own opt-in, separate from the enquiry consent. |
| 15 | Keep a **record of processing activities** | Gen. Regs 2021 | **Owner** | Maintain a simple register: purposes, categories of data & data subjects, recipients, transfers, retention, safeguards. This document is a starting point. |
| 16 | **Children's data** | DPA 2019 s.33 | **Done (draft)** | Services are adult-oriented; notice states no knowing collection from children and a deletion route. |
| 17 | Terms of Use — enforceable, Kenya governing law, accurate disclaimers | general contract / consumer law | **Done (draft) + Lawyer** | `/terms`. Confirm liability limits are enforceable under Kenyan law and that the property-information disclaimer is adequate for an agency. |

## 4. Decision-register items this closes / advances

- **16.a** — "Who supplies reviewed Privacy Policy and Terms?" → project has
  supplied the draft from a Kenya-appropriate template; **owner's lawyer to
  review** (still LAUNCH-blocking until sign-off).
- **22.b** — "DPA 2019 obligations" → checklist in §3; the assumed-required
  items (privacy notice, lawful-basis statement, documented deletion process)
  are drafted/identified; registration and DPO questions flagged for the
  lawyer.
- **I-3** — "Consent checkbox wording" → implemented and centralised
  (`CONSENT_STATEMENT`); wording flagged for lawyer confirmation (L7).

## 5. Sign-off gate before launch

- [ ] Lawyer has reviewed `/privacy` and `/terms` and confirmed or amended them.
- [ ] L1–L8 blanks resolved and merged into `frontend/src/content/legal.ts`.
- [ ] §3 items 1, 5, 6, 10, 13, 15 (owner actions) completed and recorded.
- [ ] ODPC registration done (if item 1 says required); number added to the notice.
- [ ] `LEGAL_REVIEW_BANNER` removed from `PrivacyPage.tsx` / `TermsPage.tsx`.
- [ ] `LEGAL_EFFECTIVE` set to the real effective date.
- [ ] `docs/project-state.md` and `docs/roadmap.md` updated to mark legal complete.

## References

- Data Protection Act, No. 24 of 2019 (Kenya).
- Data Protection (General) Regulations, 2021.
- Data Protection (Registration of Data Controllers and Data Processors) Regulations, 2021.
- Data Protection (Complaints Handling Procedure and Enforcement) Regulations, 2021.
- Office of the Data Protection Commissioner — odpc.go.ke.
