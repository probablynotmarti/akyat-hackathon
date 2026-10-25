# Akyat: final 70 minutes before recording

Freeze feature scope. Focus on problem/value (30%), user experience (30%), evidence of Codex work (25%), and the shared-price idea (15%). The clock below starts when the team adopts this checklist.

| Time | Marti / engineering | Carlos / pitch and video |
| --- | --- | --- |
| 0–15 min | Confirm the design handoff and reserve time to apply it. Keep the five-step onboarding and one dependable booking journey. | Confirm official video duration, submission format, and judge-access requirements. Source the three mountain photos using HIKE-PHOTO-BRIEF.md. |
| 15–35 min | Apply the bounded design changes; check mobile and recording viewport for clipped text, missing buttons, and motion delays. | Finish the six-slide outline and shot-matched narration. Have a fresh viewer try joining and explain the two QR codes; record actual observations. |
| 35–50 min | Rehearse the whole flow on the actual recording browser. Fix only failures and confusing prices or actions. | Time the narration against the screens. Frontload the price drop; keep signup to a brief opening shot. |
| 50–60 min | Verify the deployed version, links, pass lookup, and check-in. Use the reliable reference lookup if camera permission is unreliable. | Prepare titles, voice recording, slide exports, and the final submission checklist. |
| 60–70 min | Freeze the build, reset demo bookings, prepare a fresh profile only if filming registration, and capture backup screenshots. | Do one final timed rehearsal and check audio. Record against the frozen build. |

## Current gaps to close

- This checkout currently has no actual trail photos in public/images/hikes/. Required subjects: Mt. Talamitam, Mt. Batulao, and Mt. Ulap. Follow the photo brief for exact filenames and source evidence.
- This checkout currently has no completed pitch, narration, or storyboard in collaboration/carlos/. Carlos may have these in his separate workspace; confirm and bring over the approved files.
- GitHub is public, but the hosted app is owner-private. Confirm whether judges require an interactive link and arrange the appropriate access before submission.
- The design workflow still needs integration and a final regression pass; a design image alone is not an implemented screen.
- Camera and upload UI still need a check on the recording device if they are to appear in the video. The tested fallback is organizer lookup with Load my demo booking.

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
