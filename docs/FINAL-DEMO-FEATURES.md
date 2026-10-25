# Final feature audit and recording paths

## Fast payment and QR test
On a fresh or reset demo, **Mt. Pinatubo** and **Mt. Ulap** both start with five of six hikers. The sixth joiner automatically closes these explicitly labeled demo departures and locks the quote. Other departures keep the original close-at-deadline/demo-control behavior.

1. Open the homepage and choose Try Pinatubo or Try Ulap.
2. Join this party. It becomes 6/6; the price locks immediately.
3. Complete my registration: fill fictional emergency details, acknowledge the two sample requirements, and save.
4. Continue to demo payment. Review all fee items and acknowledge the simulation.
5. Simulate payment; the personal QR and itemized receipt appear.
6. Preview organizer check-in → Load my demo booking → Confirm check-in.
7. Try Simulate overdue return → Preview emergency-contact alert, then Confirm safe return.
8. Reload and load the pass again: Safely returned persists; no second admission is allowed.

| Departure | Guide share at 6 | Environmental demo fee | Registration demo fee | Total |
| --- | --- | --- | --- | --- |
| Mt. Pinatubo | ₱200 | ₱60 | ₱40 | ₱300 |
| Mt. Ulap | ₱400 | ₱120 | ₱80 | ₱600 |

These are sample prices, not real operating tariffs. Individual fees are split into illustrative environmental/registration line items; the existing total is unchanged.

If you already have an active booking, it is preserved. To guarantee the exact starting state above, use Demo controls → Reset demo. Reset affects only bookings in the current browser; it keeps the demo login.

## Invitation QR on another phone
The public invitation URL opens **Joining {mountain name}?** before the account screen.
- Yes: login/register choices retain the invited destination, and successful authentication opens that trail. An existing logged-in session proceeds directly to the trail.
- No: the invitation is cleared and the ordinary welcome/login/register screen appears (or home for an already authenticated user).
- Joining is still an explicit action on the trail page; opening an invitation does not reserve a place.

A second phone opens its own seeded party. The prototype does not synchronize reservations, payment or QR validation between devices. Keep the payment/pass/organizer demonstration in one browser.

## Feature coverage

| Planned feature | Current prototype behavior |
| --- | --- |
| Shared price falls as the party fills | Working local pricing with animated changes and exact centavo allocation. Use Talamitam for 4 → 6 hikers / ₱450 → ₱300 guide share. |
| Registration and payment | Working checklist, locked totals, itemized simulated checkout, receipt, cancellation/refund rules. No real money. |
| One Jump-off Pass | Real QR encoding an opaque reference. Admission checks payment/requirements and rejects duplicates. |
| Social invitation | Copy/share link and public invitation QR; mountain-specific entry prompt before authentication. |
| Trust layer | Clearly labeled sample identity/guide badges and “hiked with” endorsement content. Hiker profiles and optional buddy pairing are interactive; pairing persists locally. No identity checks, accreditation checks, or messages actually occur. |
| Readiness | Three-question suggestion flow, explained onboarding recommendation, trail metrics and an approximate building-floor comparison. This is not fitness clearance. |
| Safe return | Jump-off check-in, expected-return time, on-trail/overdue/returned states, explicit return checkout, and a simulated emergency-contact alert preview. Return status persists. No real SMS/email, background monitoring, or emergency dispatch. |
| First-time / returning users | Five-step registration, local personal login and shared hackathon login. No production authentication. |
| Seven mountains | Supplied images, searchable/filterable departures and local booking states. All operational data remains sample. |

Buddy pairing is the implemented optional trust mechanism. A separately restricted women-only lobby, live chat, real identity/accreditation integrations, shared backend and real emergency messaging remain outside this build. Do not describe those as completed.
