# Submission readiness review — 25 October 2026

**Recommendation: freeze features and record.** The approved browser-local prototype has its core journey. Use one browser for payment and organizer validation. Physical iPhone 14 Safari camera capture remains an open device check; use QR upload, reference lookup or **Load my demo booking** for dependable recording.

## Standards

The installed Matt Pocock `code-review` skill ran an independent Standards review across the full prototype, from initial commit `a6126c980891a04715504f05445b2639bed3c0b2` through `f3a81e8`. Standards sources: AGENTS.md, docs/ROLES.md and approved product boundaries.

- **No hard standards violations found.** Opaque QR references, simulated payments, local role preview and local data boundaries are disclosed.
- **Two optional architecture findings:** main.jsx combines several responsibilities; onboarding and readiness recommendations use separate rule functions. Broad refactoring is deferred. The scanner is now extracted to address the current lifecycle work.
- **One documentation finding:** old three-photo wording is stale. Current catalog/photo docs and the team role description identify seven; AGENTS.md retains a historical three-hike reference.
- The review also independently identified the paid-booking organizer callback defect listed under Spec.

Standards summary: zero hard violations; two architecture observations and one documentation observation. Worst remaining concern is maintainability, not a recording blocker.

## Spec

Independent Spec review used docs/PRODUCT.md, docs/FINAL-DEMO-FEATURES.md and docs/ONBOARDING.md.

1. **Fixed:** reopening a paid booking at `#booking/<trail>` did not forward the organizer callback to its pass screen. Both pass routes now open organizer mode. Browser regression verified.
2. **Fixed:** Pulag's 6–8-hour example duration yielded a seven-hour expected return. The simulation now uses the upper duration bound plus one hour. The regression failed at 7 hours before the fix and passes at 9 hours afterward.
3. **Updated:** the recording checklist still described missing photos, private hosting and pending design integration. It now reflects the public Vercel release and actual remaining device/media checks.

The moving price, two 5/6 express parties, itemized payment, personal pass, invitation-before-login, sample trust/buddy pairing and safe-return simulation are present. No harmful scope creep found. Cross-device bookings, real verification, real payments and real alerts are explicitly outside the approved scope.

Spec summary: two functional defects fixed and one documentation inconsistency corrected. No remaining blocker found for the tested browser-local recording path; physical phone camera capture is unverified.

## Camera diagnosis and changes

User reported iPhone 14 Safari opening the camera briefly and closing. An ephemeral harness executed the original scanner's start/poll path with a decoded QR and reproduced open → close → organizer callback. This proves that reading a QR can cause the visible behavior; it does **not** establish the cause on the user's physical phone.

Ranked possibilities were a decoded result appearing below the viewport, an unreported playback rejection, or camera acquisition failure. The new implementation:

- Keeps a mounted muted inline video element, awaits playback and surfaces failures.
- Shows opening/cancel controls and persistent diagnostic text.
- Invalidates pending camera requests when cancelled or unmounted and releases late streams.
- Stops after a decoded QR, explicitly says why, and brings the organizer result into view.
- Keeps upload/reference fallback and explains the same-browser booking requirement.

Technical references: [WebKit inline video and playback policy](https://webkit.org/blog/6784/new-video-policies-for-ios/) and [MDN getUserMedia permission and error behavior](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia). These explain API handling, not a confirmed device-specific cause.

## Completed verification

- `npm test`: **32/32 pass**, including five camera lifecycle tests and the upper-duration regression.
- `npm run build`: passes; existing bundle-size advisory remains non-blocking.
- `git diff --check`: passes.
- Local browser rehearsal: fresh demo login, Pinatubo 5→6, requirements, itemized ₱300 payment, personal pass, reopened paid booking → organizer, mobile 390×844 result focus, admission, duplicate prevention, overdue preview marked NOT SENT, safe return and reload persistence.
- Actual QR image upload decoded and looked up the completed booking. Opening/cancelling a pending camera request has visible feedback.
- Browser console: no errors observed during rehearsal.
- Physical Safari permission, live camera frames and optical capture are **not verified**. An automated QR-download event timed out in the test browser; QR generation and a separately generated equivalent reference-image upload were verified. Do not treat this as a phone Save QR test.

## Final hour ownership

- **Marti:** refresh the live release, do one physical iPhone retry, then capture the working price-drop → payment → pass → organizer sequence. Spend at most a few minutes on camera; use the verified fallback if needed.
- **Carlos:** record problem/value and the pitch now, assemble the screens, confirm official video length and submission format, and submit with a buffer. Pitch/video files and event requirements have not been inspected in this review.
- **Both:** present Codex's actual iterations/tests as AI mastery. Trail recommendations are rules-based; simulated badges and alert previews are not real verification or emergency services.

### Follow-up camera retry

The first update did not resolve Marti's physical iPhone symptom. Two further startup guards now pass regression tests (visible video before play; valid width and height before decoding), with 34 tests passing overall. **Take QR photo** adds a camera-picker alternative using the same image decoder as upload. Keep the same-browser booking rule. Neither physical iPhone path is certified by desktop automation; recording should still use the verified reference/load-booking route if needed. Error text is now repeated inside the preview so it is not hidden below the phone viewport. No additional device retry is required to continue recording.
