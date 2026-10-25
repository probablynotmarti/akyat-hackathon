# Approved Akyat prototype

## Audience and journey
New hikers, foreign visitors, and current hikers. The demo follows a first-time hiker who lacks companions and is unfamiliar with registration. Clear English, PHP pricing, Philippine local dates/times, and international phone formatting.

First-visit welcome → local demo registration/login → hiking preferences → explained suggestion → discover a suitable departure → optional readiness check → join a scheduled party → invite friends through a public link/QR → see the estimated guide share fall → registration closes and price locks → complete requirements and simulated payment → receive a personal Jump-off Pass → organizer validates and checks in.

## Pricing and booking rules
- Organizer sets the departure, capacity, minimum group, group guide fee, individual fees, and requirements.
- Group guide fee divided by reserved hikers produces the current estimate; per-person fees are additional. Estimates may rise when hikers leave before closing.
- Below minimum at closing: cancel before collecting money. Otherwise lock quotes and open payment.
- Unpaid reservations expire at the payment deadline. Locked quotes never increase. Organizer may cover the shortfall and proceed or cancel and simulate full refunds.
- Free cancellation before payment. Paid hiker cancellation at least 24 hours before departure: full simulated refund. Later requests: organizer review. Organizer cancellation: full simulated refund.
- Use integer centavos and allocate remainders consistently so the group shares sum exactly to the fee.

## QR and requirements
Public invitation QR opens a party page. Personal pass QR contains an opaque booking reference. Pass requires payment and all registration requirements. Organizer view shows ready, incomplete, cancelled, or already checked in; confirmation is explicit. Emergency-contact details are deliberately opened rather than displayed in the default scanner view.

## Trust and readiness
Fictional organizer/guide/participant profiles with demo badges clearly labeled. Three optional readiness questions guide recommendations using trail distance, ascent, terrain, and duration. This is preference guidance, not fitness clearance. Mt. Talamitam, Mt. Pinatubo, Mt. Ulap, Mt. Pulag, Mt. Daraitan, Mt. Makiling, and Mt. Pamitinan are real mountain identities. Departures, itinerary metrics, difficulty labels, prices, and operational details are sample scenarios. See HIKE-PHOTO-BRIEF.md for location sources and photo requirements. Temporary contour illustrations do not depict verified terrain.

## Technical scope and limits
Original mobile-first responsive web application, with a full desktop layout for judging. No native installation is required. Seeded departures and browser persistence. Public links identify a seeded party, but bookings are not synchronized across devices. Organizer view is a local role simulation, not production authentication. Simulated payments, waiver and refunds. No real money, verification, accreditation, emergency alerts, medical assessment, or official trail acceptance. Use fictional personal data. No reuse of the pre-existing Akyat app.

## Deferred
Chat, feeds, real identity verification, endorsements, women-only lobbies, buddy matching, automatic overdue alerts, translation, and currency conversion. AI product features are optional; prioritize evidence of thoughtful Codex use.

## Visual direction
Minimal photography direction from Marti's approved design handoff: off-white canvas, charcoal actions, Archivo, a compact generic mountain atmosphere, and supplied destination photos. Seven departures appear before the illustrative shared-price story. Cards and booking panels lead with total cost, with guide share explicitly separated. Mobile shows booking controls before detailed trail content. Short GSAP transitions respect reduced motion. See PHOTO-SELECTION.md for provenance.

## First-visit onboarding
Registration, returning demo login, animated arrival, and preference-based recommendations now precede discovery. Read [ONBOARDING.md](ONBOARDING.md) for the exact data boundary and five-step flow. Suggestions use only onboarding answers.
