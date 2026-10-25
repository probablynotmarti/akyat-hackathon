# Akyat: final 70 minutes before recording

> Update: Marti supplied photos and expanded the current catalog to seven mountains. See [PHOTO-SELECTION.md](PHOTO-SELECTION.md); earlier three-mountain sourcing notes below are historical.

Freeze feature scope. Focus on problem/value (30%), user experience (30%), evidence of Codex work (25%), and the shared-price idea (15%). The clock below starts when the team adopts this checklist.

| Time | Marti / engineering | Carlos / pitch and video |
| --- | --- | --- |
| 0–15 min | Verify the current Vercel release and one complete booking → pass → organizer sequence. Fix blockers only. | Confirm official video duration, submission format, deadline and judge access. Record the introduction and problem/value story. |
| 15–40 min | Capture the price-drop and payment/pass sequence in one browser; use reference lookup if camera is unreliable. | Record narration and assemble the working screens. |
| 40–55 min | Freeze the build; check public links and retain a backup recording. | Check sound, spelling, duration, and the submission package. |
| Final minutes | Support submission; avoid new features. | Submit with a buffer before the official deadline. |

## Current readiness and remaining checks

- Seven mountain photos and the approved minimal design are integrated. The public interactive demo is https://akyat-hackathon-marti-2026.vercel.app.
- Carlos's final pitch/video may live in his separate workspace. Verify those deliverables and the event's actual format and deadline; they have not been inspected here.
- Camera lifecycle tests cover playback failure, permission failure, pending-request cancellation and decoded QR cleanup. Physical iPhone 14 Safari capture still requires a device retry; browser automation cannot certify that hardware path.
- The dependable recording path is **Load my demo booking**, saved QR upload, or reference lookup in the same browser where payment was simulated.
- A personal pass from a different browser cannot be looked up: this is a disclosed local prototype, with no shared backend. Displaying the same browser's saved pass on another screen is a valid way to exercise its camera.
- No new features are needed for the approved prototype. Keep payment, verification and overdue alerts visibly labeled as simulations.

## Core recording story

“Find your hiking people, share the guide cost, and arrive with one pass.”

1. Brief welcome and explained trail suggestion.
2. Join Mt. Talamitam: four hikers, guide share ₱450, personal fees ₱150, total ₱600.
3. Show the public invitation QR/link. Add two friends with the demo control: six hikers, guide share ₱300, total ₱450.
4. Complete requirements, close registration to lock the quote, and simulate payment.
5. Show the private jump-off pass, load the booking in organizer view, and confirm check-in.

Use one browser for the journey: booking state is local. An invitation opened elsewhere does not synchronize participants. Reset demo resets bookings, not the local account. Use fictional identity details and a demo-only password.

## Evidence to show the judges

- Problem/value: one concrete fragmented hiking journey and how each step becomes easier. Label assumptions; do not invent interviews.
- UX: the guided first visit, clear guide-share versus total price, public invitation versus private admission pass, and one real usability observation if collected.
- AI mastery: actual Codex decisions, source changes, tests, and iterations documented in AI-PROCESS.md and VERIFICATION.md. Trail matching is rules-based; do not call it a trained AI model.
- Originality: demonstrate the social invitation causing a visible price drop. Explain the hypothesis without claiming no competitor has done it.

Keep real payments, server authentication, cross-device synchronization, activity-provider connections, and emergency alerts outside this recording build.
