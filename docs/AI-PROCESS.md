# Codex process evidence

## Completed before implementation
- Used Matt Pocock's grilling skill to settle audience, organizer responsibility, estimates versus locked prices, nonpayment, cancellation, distinct invite/admission QR codes, readiness, trust, and international-user needs.
- User approved a three-hour original build and a split between Marti's engineering and Carlos's pitch/video/UX work.
- Original source is being authored in this repository; the older Akyat repository was not cloned or used.
- Used the Sites workflow for web delivery and writing-for-agents guidance for the Carlos handoff.

## Implementation and observed refinements
- Authored the responsive React/Vite application, pure booking/pricing module, and meaningful state-transition tests from scratch.
- Verified the main journey through the browser: join, two friends join, estimate falls, registration completes, price locks, simulated payment succeeds, pass appears, organizer confirms check-in, duplicate admission is blocked.
- Improved small text after visual inspection so operational details, policies, prices, and form labels remain readable.
- Added an explicit readiness-result explanation, connecting the suggestion to distance, ascent, duration, and the hiker's preferences.
- Corrected cancellation-dialog wording so a late cancellation does not incorrectly promise an automatic refund.
- The app restart preserved browser-local booking state; the development server was restarted and QA resumed.
- Browser file-picker automation stalled; the actual generated QR image was independently decoded, while reference lookup completed the UI journey. Camera interaction remains unverified.

Carlos's usability findings and any resulting revisions should be added only after they occur.

## Final local verification
`npm test`: 14/14 passed. The Sites build helper ran the Vite production build successfully. `git diff --check` passed. See `docs/VERIFICATION.md` for observed browser behavior and limits.

## Design refinement after the working journey
Marti asked for a mobile-versus-desktop recommendation and a stronger visual direction based on his existing Akyat website. Codex inspected its rendered design without reusing its source, then authored an original warm cream/charcoal/rust layout and GSAP motion. An interactive guide-share example makes the main value proposition testable immediately. Mobile QA led to a more compact Jump-off Pass so the QR appears in the initial phone viewport. The real three-hike catalog and photo-sourcing handoff give Carlos a concrete non-coding contribution. Automated migration coverage protects bookings made against the earlier sample names. See VERIFICATION.md for observed results and remaining limits.

## First-visit journey
Marti proposed a conversational registration flow and activity-based personalization. Codex implemented an original welcome, six-step registration, local returning login, explained recommendations, optional connection concepts, and a GSAP arrival transition. Provider documentation research identified restrictions on the proposed Strava use and no verified general AllTrails account-history interface; this changed the design to honest optional previews with synthetic data. Automated tests cover identity-data minimization, wrong passwords, sessions, and conservative recommendations. Mobile inspection caught and corrected a headline wrap issue. The profile name now carries into booking requirements.

Before recording, Marti removed external activity connections from scope. Codex removed the connection screen, preview dialogs, synthetic history, and related matching behavior, shortening registration to five steps. Recommendations now use only onboarding answers. All 20 tests and the production build passed. The preceding paragraph records an earlier iteration, not current functionality.

## Final design and recording release
Marti supplied a separate Codex-produced design handoff and mountain-photo folders. Codex inspected the concept boards and image contact sheet, implemented the neutral photographic direction in original app source, shortened transitions, moved discovery before the cost story, and made totals explicit. Marti expanded scope from three to seven mountains, replacing Batulao with Pinatubo for new departures. Migration preserves already-booked legacy destinations without relabeling their passes. The requested shared demo profile supports fresh browsers while preserving separately registered local accounts. A real browser rehearsal verified login through organizer check-in, and responsive checks covered 390 and 320 px widths. Vercel receives the tested static build; no real payment or shared database was added.
