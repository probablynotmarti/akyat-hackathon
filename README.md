# Akyat

**Find your people. Find your peak.**

[Open the live Vercel app](https://akyat-hackathon-marti-2026.vercel.app) · [Partner testing and release notes](docs/VERCEL-RELEASE.md)

An original UX hackathon prototype: find a small hiking party, share the guide cost, complete registration, and arrive with one personal Jump-off Pass.

## Carlos: start here

**Supplied photos:** [Seven-mountain selection](docs/PHOTO-SELECTION.md) — Mt. Talamitam, Mt. Pinatubo, Mt. Ulap, Mt. Pulag, Mt. Daraitan, Mt. Makiling, Mt. Pamitinan.

Read [your ready-to-paste Codex handoff](docs/CARLOS-START-HERE.md). [Team roles](docs/ROLES.md) define ownership and the three-hour schedule. Carlos owns pitch/video/UX artifacts in `collaboration/carlos/`; Marti owns engineering.

## Run locally

Requires Node.js 20.19+ or 22.12+ and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. For verification:

```sh
npm test
npm run build
npm run preview
```

## The demo

1. Open **Mt. Talamitam**, then **Join this party**. Your guide share is **₱450**; individual fees add **₱150**.
2. Open **Demo controls** and select **A friend joins** twice. Your guide share falls to **₱300**; your estimated total is **₱450**.
3. Open **Invite friends** to show the public party link and invitation QR.
4. Complete registration using fictional information and save the checklist.
5. **Demo controls → Close registration** locks the quote.
6. Complete the explicitly simulated payment to unlock your personal pass.
7. **Preview organizer check-in → Load my demo booking → Confirm check-in**.
8. A second lookup shows **Already checked in**. No second admission action is offered.

[Full demo walkthrough and fallback paths](docs/DEMO.md) · [Approved product decisions](docs/PRODUCT.md) · [Verification](docs/VERIFICATION.md) · [Codex process evidence](docs/AI-PROCESS.md)

## What is real, and what is simulated

Working local interactions include fee allocation, joining/leaving, registration validation, locked quotes, cancellation/refund state, QR generation, reference lookup, QR decoding, and check-in state. Browser-local data survives reloads. Reset it through **Demo controls → Reset demo**.

Departures, profiles, accreditation, payment, waiver, and refunds are demonstrations. Bookings do not synchronize across devices. The organizer screen is a role preview, not production authentication. No money is collected, messages are sent, or emergency monitoring provided. Use fictional personal data. Camera access depends on browser permissions; reference lookup is the reliable presentation fallback.

This app was authored from scratch. The pre-existing Akyat application was not cloned or reused. Open-source libraries and illustrative stock photography are credited in [assets and dependencies](docs/ASSETS.md).

## Minimal photography update
Off-white surfaces, charcoal actions, Archivo typography, a compact generated mountain hero, and seven supplied mountain photos. Cards show the estimated total when joining, with guide share and personal fees underneath. Mobile booking controls precede long trail details. GSAP motion is brief and respects reduced-motion preferences. The illustrative price experiment sits below the directory and is separate from reservations.

[Photo selection and provenance](docs/PHOTO-SELECTION.md) covers all seven mountains. Pinatubo replaces Batulao for new departures. Existing booked legacy destinations are retained rather than relabeled. Dates, route metrics, difficulty labels, fees, and profiles remain demo scenarios.

## First-time and returning hikers
The opening screen offers **First time here** and **Log in**. Complete the conversational onboarding to receive an explained starting trail suggestion, then enter the app through a GSAP welcome animation. Use fictional details and a unique demo-only password. The profile button offers sign-out; return with the same email/password on this browser. This is local UX-demo identity, not server authentication.

External activity options have been removed. See [the five-step onboarding flow](docs/ONBOARDING.md). New reservations reuse the profile name in the booking checklist.

## Shared hackathon login
Use **Log in** with the demo credentials Marti provided in the team chat. The shared profile works on fresh browsers and does not overwrite a personal local account. Its client-side verifier is for demonstration only; it is not production authentication. Bookings remain independent per browser. No email is sent.
