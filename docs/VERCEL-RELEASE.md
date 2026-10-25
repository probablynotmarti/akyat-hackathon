# Vercel release

**Final recording update:** [Fast payment, invitation, trust and safe-return walkthrough](FINAL-DEMO-FEATURES.md). Pinatubo and Ulap start at 5/6 on a fresh/reset demo and lock automatically when you join.

Live app: https://akyat-hackathon-marti-2026.vercel.app

Vercel project: akyat-hackathon-marti-2026, in the existing signed-in account. This is separate from the older Akyat website and the Sites preview. Use this Vercel link for partner testing.

The claimable-upload helper failed to return a URL; deployment succeeded using the installed, authenticated Vercel CLI. The project is already in Marti's account, so no claim link is needed.

## Partner testing
1. Open the live URL and choose Log in.
2. Use the shared hackathon credentials Marti supplied in chat.
3. Follow DEMO.md for the Talamitam price-drop and pass journey.
4. Use Demo controls → Reset demo to restore the sample bookings on that browser.

The account works on fresh browsers. Booking/organizer state is still local to each browser, with no cross-device synchronization. Use the same browser for booking and pass validation. Camera/upload support is device-dependent; Load my demo booking is the tested fallback. The old Sites URL was not updated in this Vercel-only release.

## Deploy another tested build
From the application root, run npm test and npm run build. Copy dist into the existing ignored work/akyat-hackathon-marti-2026 staging folder, which contains its Vercel project binding, then run vercel deploy --yes --prod from that folder. Do not deploy the entire work folder or use the older Akyat project.

## Organizer readiness update — 2026-10-25

Published camera-session feedback/cleanup, visible QR results, paid-booking organizer callback and upper-bound expected return fixes to the same public alias. Deployment: https://akyat-hackathon-marti-2026-9i1pbnlij.vercel.app. Production alias: https://akyat-hackathon-marti-2026.vercel.app. The live organizer screen shows the new same-browser guidance and rejects invitation/unknown references. Physical iPhone camera capture remains pending a user retry.

Camera follow-up deployed to https://akyat-hackathon-marti-2026-l1l837djf.vercel.app and the same public alias. Build index-B_Y3fw8Z.js / index-D4c_ocIq.css. The new Take QR photo picker was exercised on the live site with a generated QR image; decoding succeeded and the reference was correctly rejected as belonging to the separate local rehearsal browser. This verifies the picker-to-decoder flow, not physical iPhone camera capture. Mobile layout checked at 390×844.
