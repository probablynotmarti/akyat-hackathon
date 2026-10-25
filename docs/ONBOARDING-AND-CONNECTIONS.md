# Onboarding and activity connections

## Working prototype
A first visit opens a dedicated welcome screen with **First time here** and **Log in**. Registration is conversational:
1. Name, email, birthday, contact number (international format).
2. Demo password and confirmation.
3. First-time hiker / hiked a few times / experienced hiker.
4. Preferred outing length and motivation (scenery, people, climb).
5. Optional activity-connection concepts; continue without them or try explicitly fictional sample history.
6. Explained first trail suggestion, then create the demo account.

Successful registration and returning login use a GSAP mountain-line welcome transition into the existing app. Reduced-motion mode skips the animated sequence. The profile button exposes sign-out; logging back in uses the email/password created in this browser. Existing booking data is preserved. Invitation/departure URLs retain their destination through onboarding.

This is one **browser-local demo account**, not server authentication. A salted PBKDF2 verifier is saved, never the plaintext password. Only name, normalized email, hiking preferences, and the sample-history flag are persisted in the profile. Birthday and phone are collected to demonstrate the form and discarded at completion. The session is tab-session storage. This does not secure organizer mode or provide email verification, recovery, multi-user isolation, or cross-device accounts. Use fictional information and a demo-only password.

## Recommendation behavior
Transparent rules, not an AI model or fitness assessment. First-time hikers and shorter-outing preferences start with Talamitam. Experienced hikers seeking a full-day climb can receive Ulap. Other returning hikers receive Batulao. Optional synthetic history (four outings, typical 4.2 km / 220 m ascent) steers toward the shorter sample itinerary with an explicit explanation. It never upgrades a beginner to a harder trip. Personal identifiers are not ranking features. Every route metric remains an illustrative itinerary value.

## Strava: technically available, use case requires review
Checked October 25, 2026. Strava documents OAuth2 authorization with registered application credentials and revocable scopes:
https://developers.strava.com/docs/authentication/

The current policy (effective June 1, 2026) restricts AI/ML use, derived data, analytics, combining Strava data with customer data, and retention. In particular sections 5.3 and 5.4 mean we cannot promise the proposed recommendation use is permitted, even if the ranking is deterministic. Section 2 requires consent, disclosure, revocation and deletion controls. The developer program is discretionary.
https://www.strava.com/legal/api_policy
https://www.strava.com/legal/api

**Decision:** no live OAuth or API ingestion in this prototype. The Strava UI is labeled a concept preview and never reports “connected.” Seek confirmation of the intended use and developer access before implementing a real connector. No API credentials were requested or stored.

## AllTrails: history import is the candidate path
I could not verify an official, generally available third-party account-history OAuth API for Akyat in the sources inspected. This is not a claim that no partnership API exists. AllTrails does document user-directed activity exports, including GPX and other formats:
https://support.alltrails.com/hc/en-us/articles/37230403315476-Downloading-files-from-AllTrails

Its documented AI-assistant integration provides trail discovery/details/weather, and does not collect or store AllTrails account data through the integration. That is not evidence that it grants Akyat access to a user's activity history:
https://support.alltrails.com/hc/en-us/articles/47343827423764-AllTrails-integrations-with-AI-assistants

**Decision:** a clearly labeled history-import concept and a synthetic sample only. No scraping, invented OAuth endpoint, live import, or false connected state.

## Backend option for a later implementation
Use a hosted auth service or server session with secure HttpOnly cookies, email verification/recovery, per-user booking authorization and explicit organizer roles. Put credential exchange and provider secrets on the server. If the provider approves the specific use, implement authorize → callback (state/PKCE where supported) → minimum permitted data retrieval → user-visible disconnect and deletion. Apply the current provider retention rules and keep imported activity data private to its owner. Add integration tests for denied consent, revoked access, token expiry, deletion, and connector outages. The onboarding answers must always work without activity services.

For file import, obtain an explicit user-selected export, validate type/size/schema, preview the data before accepting it, and extract only the permitted fields required for the feature. Do not infer activity completion from a planned route or treat an activity log as medical readiness. This section is a proposed backend plan, not deployed functionality.

## Carlos's demo story
“Before we suggest a mountain, we get to know the hiker. A first-timer gets a gentler starting point; an experienced hiker can ask for a longer day. Activity connections are an optional future path. The working prototype personalizes from the user's own answers, explains the suggestion, and then brings them into the shared-price booking journey.”

Record the welcome → experience choices → suggestion → animated arrival → main app. Label sample history and local login honestly. Do not pitch Strava or AllTrails as live integrations.
