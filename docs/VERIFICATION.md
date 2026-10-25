# Verification record

Recorded October 25, 2026 (Asia/Manila).

## Automated
- Original 12 domain tests passed: exact centavo allocation, price drop, capacity/duplicate reservation, registration closing, minimum group, payment/pass gating, price lock after nonpayment, cancellation/refund timing, duplicate check-in, protected state fields, readiness, malformed storage rejection.
- Final automated run: **14/14 tests passed**, including two generator/scanner round-trip tests in `tests/qr.test.js`.
- The actual personal QR PNG generated during browser QA was decoded with jsQR. It contained `AKYAT:` plus a 36-character opaque reference, not the sample name or contact details.
- Final production build passed after readability and readiness-result refinements. `git diff --check` also passed.

## Browser observations
- Desktop homepage and personal pass visually inspected.
- Joined Amihan Ridge: four hikers, ₱450 guide share plus ₱150 individual fees.
- Added two friends through visible demo controls: six hikers, ₱300 guide share, ₱450 total.
- Saved fictional registration details and both acknowledgements. Payment remained disabled before registration closing.
- Closed registration; the price locked. Completed simulated checkout and received a rendered personal QR.
- After an app restart, browser-local booking data persisted.
- Organizer lookup showed ready; explicit confirmation changed it to already checked in and removed the admission action.
- Mobile at 390 × 844: no horizontal document overflow on home. Readiness questions and the explanation/result modal were exercised and visually inspected.

## Limits
- Browser file chooser automation stalled and was interrupted by the user restarting the app; end-to-end upload interaction remains unverified. The saved PNG itself decoded successfully, and generated QR matrices round-trip through the same libraries.
- Camera hardware/permissions were not exercised. Reference lookup is the documented fallback.
- This is a browser-local prototype, not a multi-user service or authenticated organizer system.

## Mobile-first redesign follow-up
- Catalog now uses Mt. Talamitam, Mt. Batulao, and Mt. Ulap. Operational values remain samples. Correct photo paths and source requirements are documented for Carlos.
- **15/15 tests passed**, including migration of legacy IDs without losing a paid pass or duplicate check-in protection.
- Production build passed; Vite reports a non-blocking bundle-size advisory (about 197 kB gzip for the JavaScript bundle).
- Desktop layout, contour fallback illustrations, directory, and the interactive price example were visually inspected.
- Homepage price example changed 4 → 5 → 6 hikers and ₱450 → ₱360 → ₱300.
- At 390 × 844, home and personal pass had no horizontal overflow. Mobile bottom navigation was exercised.
- Repeated the actual mobile flow: reserve Talamitam, save fictional requirements, add two friends, lock ₱300 guide share + ₱150 individual fees, simulate payment, render the QR, load it through organizer lookup, and explicitly check in. Result changed to Already checked in and removed the admission action.
- Reduced-motion handling is implemented with GSAP matchMedia and CSS; an operating-system reduced-motion preference was not toggled during this check.
- Browser console showed no error or warning entries during the final flow. Camera/upload limits above remain unchanged.

## First-visit onboarding follow-up
Historical verification of the earlier six-step design; the connection-removal update below supersedes its provider-related behavior.
- **20/20 tests passed**. New tests cover invalid registration data, credential verification/rejection, exclusion of plaintext password/birthday/phone from saved accounts, session/account matching, beginner preference protection, and explained synthetic-history recommendations.
- Production build passed (non-blocking Vite bundle-size advisory: about 205 kB gzip JavaScript).
- Desktop welcome and 390 × 844 mobile welcome, details, experience, and suggestion screens visually inspected. A mobile headline wrap issue was corrected.
- Completed the six-step mobile signup with fictional details; opened the Strava concept, added explicitly fictional history, received the beginner suggestion, and reached the main app through animated arrival.
- Profile showed the submitted name, email, hiking level, and sample-history label. Sign-out returned to the introduction. Wrong-password login showed an error; correct login returned to the app. Reload retained the local session.
- New party reservation carried the profile name into the booking requirements form, avoiding duplicate entry.
- No live provider connection or activity import was made. Camera/upload verification limits remain unchanged. Reduced-motion behavior is implemented, but the OS preference was not toggled in this run.

## Connection removal before recording
- Removed provider cards, preview dialogs, synthetic activity history, related styles, and the connection step. Registration now has five steps.
- Recommendations and profile labels use onboarding answers only. Legacy imported-history flags do not affect results or appear in the public profile.
- All 20 automated tests passed and the production build passed. The bundle-size advisory remains non-blocking.
- Earlier browser checks above describe the previous version; this removal was verified through source review, tests, and build, without repeating the full browser recording journey.

## Minimal photography release / Vercel
- Implemented the supplied minimal design direction with seven user-supplied destination photos, responsive generic hero, neutral controls, total-first prices, and a shorter arrival animation.
- Shared demo login was verified in a fresh browser with the exact supplied credentials. The app did not require local registration first.
- Repeated the full Talamitam browser journey: joined, added two friends, locked ₱300 guide share + ₱150 personal fees, saved requirements, simulated payment, rendered the personal QR, looked it up in organizer view, and confirmed check-in. The next state blocked duplicate admission.
- Visually checked desktop homepage, 390 × 844 homepage/catalog, and 320 px login. DOM width matched the viewport at 390 and 320 px. All seven destination photos loaded after scrolling through the catalog.
- Camera permission and upload-picker integration were not exercised. QR round-trip library tests remain part of the suite. Reduced-motion handling is implemented but OS preference was not toggled in this release.
- Production build passed with the existing non-blocking bundle-size advisory (approximately 204 KB gzip JavaScript).
- Final automated suite: **22/22 passed**, including fresh-browser shared-demo sessions and three-to-seven catalog migration with retired booked destinations preserved.
- Public Vercel alias returned HTTP 200 without authentication. Exact supplied demo credentials successfully opened the seven-mountain homepage on Vercel; browser console contained no warnings or errors during that check.
