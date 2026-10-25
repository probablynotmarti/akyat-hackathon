# Akyat

**Find your people. Find your peak.**

An original UX hackathon prototype: find a small hiking party, share the guide cost, complete registration, and arrive with one personal Jump-off Pass.

## Carlos: start here

**Photo sourcing:** [Complete hike list and image brief](docs/HIKE-PHOTO-BRIEF.md) — Mt. Talamitam, Mt. Batulao, Mt. Ulap.

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

## Mobile-first visual update
The prototype is a responsive web app: phone navigation for hikers, full desktop layout for judging. The original GSAP implementation adds headline and image reveals, scroll entrances, a drawn elevation study, and animated guide-share amounts; reduced-motion preferences are respected. The live price example is separate from actual reservations.

The real catalog is **Mt. Talamitam**, **Mt. Batulao**, and **Mt. Ulap**. Carlos's [photo brief](docs/HIKE-PHOTO-BRIEF.md) lists exact filenames and sourcing guidance. Until those photos are supplied, labeled original contour illustrations occupy the slots. Dates, route metrics, difficulty labels, fees, and profiles are demo scenarios.
