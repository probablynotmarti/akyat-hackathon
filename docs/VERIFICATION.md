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
