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
