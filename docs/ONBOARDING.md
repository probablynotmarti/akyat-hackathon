# First-time and returning hikers

Current recording scope: five onboarding steps, with no external activity connections or imported-history options.

1. Name, email, birthday, contact number.
2. Demo password and confirmation.
3. First-time hiker / hiked a few times / experienced hiker.
4. Preferred outing length and motivation: scenery, people, climb.
5. Explained trail suggestion, then create demo account and animated arrival.

Recommendations use the hiker's answers only. Beginners and short-outing preferences start with Talamitam; experienced hikers seeking a full-day climb can get Ulap; the remaining combination suggests Batulao. Existing profile history flags no longer influence results. Suggestions are preference guidance, not fitness clearance. Route metrics remain illustrative.

## Demo identity
One browser-local demo account. Name, email, preferences, and a salted password verifier persist. Plaintext passwords, birthday, and phone are not saved. Login uses the same browser; sessions survive refresh in that tab. Existing bookings are preserved. New reservations carry the profile name into the requirements form. No server authentication, email verification, password recovery, or cross-device account is provided.

Use fictional details and a demo-only password. The profile menu offers sign-out. To record a new registration after an account already exists, use a fresh browser profile and keep the entire booking/pass/check-in journey in that same profile. Booking reset does not remove the account.

## Carlos's opening line
“Before suggesting a mountain, Akyat asks about your experience and the kind of day you want. It explains the starting suggestion, then helps you find a group, share the guide fee, and arrive with one pass.”

## Future backend
Server authentication with verification/recovery, per-user booking access, organizer roles, shared group state, and a real payment provider are future work. Keep these outside the recording build.
