export const STORAGE_KEY = 'akyat-original-hackathon-v1';
export const money = (centavos) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: centavos % 100 ? 2 : 0 }).format(centavos / 100);
export const activeMembers = (trip) => trip.members.filter(m => ['reserved', 'paid'].includes(m.status));
export const myBooking = (trip) => activeMembers(trip).find(m => m.isYou);
export const lastBooking = (trip) => [...trip.members].reverse().find(m => m.isYou);
export const initials = name => name.split(' ').filter(Boolean).map(p => p[0]).slice(0, 2).join('').toUpperCase();
export const splitFee = (fee, count) => count > 0 ? Array.from({ length: count }, (_, i) => Math.floor(fee / count) + (i < fee % count ? 1 : 0)) : [];
export const estimatedShare = (trip) => splitFee(trip.guideFee, activeMembers(trip).length)[0] || trip.guideFee;
export const requirementsComplete = (member) => Boolean(member?.name?.trim() && member?.emergencyName?.trim() && /^\+?[\d\s()-]{7,20}$/.test(member?.emergencyPhone || '') && member?.waiver && member?.gear);
export const passStatus = (trip, member) => {
  if (!member) return 'not-found';
  if (trip.phase === 'cancelled' || ['cancelled', 'refunded', 'expired'].includes(member.status)) return 'cancelled';
  if (member.checkedIn) return 'checked-in';
  if (member.status !== 'paid' || !requirementsComplete(member)) return 'incomplete';
  return 'ready';
};
export const newId = () => globalThis.crypto.randomUUID();
const member = (name, place, color, id) => ({ id, name, place, color, status: 'reserved', isYou: false });

export function createInitialState() {
  return {
    version: 1,
    trips: [
      {
        id: 'amihan-ridge', name: 'Amihan Ridge', location: 'Rizal · Sample trail', tagline: 'A little climb. A whole new perspective.',
        difficulty: 'Beginner-friendly', level: 1, distance: 4.8, ascent: 320, duration: '3–4 hours', terrain: 'Open ridgeline · gentle dirt paths',
        description: 'Ease into the outdoors with a slow-paced ridge walk, plenty of water breaks, and a summit worth sharing. Come for the morning light. Leave with a few new friends.',
        image: '/images/ridge.jpg', guideFee: 180000, personalFees: 15000, capacity: 6, minimum: 3,
        departureAt: '2026-11-08T05:30:00+08:00', closesAt: '2026-11-05T18:00:00+08:00', paymentDueAt: '2026-11-06T18:00:00+08:00',
        guide: 'Mika Santos', guideInitials: 'MS', organizer: 'Slow Sunday Outdoors', meetup: 'Amihan welcome center · sample location', phase: 'open',
        members: [member('Bea Cruz', 'First hike', 'peach', 'a1'), member('Liam Walker', 'Visiting PH', 'blue', 'a2'), member('Jules Reyes', 'Weekend hiker', 'sage', 'a3')],
        highlights: ['Sunrise viewpoints', 'Friendly first climb', 'Small group, easy pace'],
      },
      {
        id: 'luntian-loop', name: 'Luntian Forest Loop', location: 'Laguna · Sample trail', tagline: 'Take the scenic route. All of it.',
        difficulty: 'Easy-going', level: 1, distance: 3.2, ascent: 140, duration: '2–3 hours', terrain: 'Shaded forest · uneven roots',
        description: 'Trade the city noise for birdsong on a shaded forest loop. An unhurried walk for curious beginners, with time to pause and take it all in.',
        image: '/images/forest.jpg', guideFee: 120000, personalFees: 10000, capacity: 6, minimum: 3,
        departureAt: '2026-11-14T07:00:00+08:00', closesAt: '2026-11-11T18:00:00+08:00', paymentDueAt: '2026-11-12T18:00:00+08:00',
        guide: 'Nico Flores', guideInitials: 'NF', organizer: 'Slow Sunday Outdoors', meetup: 'Luntian visitor center · sample location', phase: 'open',
        members: [member('Sofia Lim', 'Nature lover', 'peach', 'b1'), member('Alex Tan', 'First hike', 'sage', 'b2')],
        highlights: ['Shaded trails', 'Gentle elevation', 'Room to slow down'],
      },
      {
        id: 'hiraya-summit', name: 'Hiraya Summit', location: 'Benguet · Sample trail', tagline: 'For the view you will keep talking about.',
        difficulty: 'A little challenge', level: 2, distance: 8.6, ascent: 740, duration: '5–6 hours', terrain: 'Steep sections · exposed ridges',
        description: 'A longer day with steady uphill stretches and big, open views. Best for hikers comfortable with several hours on uneven terrain.',
        image: '/images/valley.jpg', guideFee: 240000, personalFees: 20000, capacity: 8, minimum: 4,
        departureAt: '2026-11-15T05:00:00+08:00', closesAt: '2026-11-12T18:00:00+08:00', paymentDueAt: '2026-11-13T18:00:00+08:00',
        guide: 'Dani Rivera', guideInitials: 'DR', organizer: 'Slow Sunday Outdoors', meetup: 'Hiraya ranger station · sample location', phase: 'open',
        members: [member('Sam Garcia', 'Trail regular', 'blue', 'c1'), member('Pat Santos', 'Weekend hiker', 'sage', 'c2'), member('Kai Ramos', 'Trail regular', 'peach', 'c3'), member('Ivy Chen', 'Visiting PH', 'lilac', 'c4')],
        highlights: ['Panoramic ridges', 'A rewarding climb', 'Steady hiking pace'],
      },
    ],
  };
}

export function joinParty(trip, options = {}) {
  if (trip.phase !== 'open') throw new Error('Registration has closed for this departure.');
  if (activeMembers(trip).length >= trip.capacity) throw new Error('This party is full. Try another departure.');
  if (options.isYou && myBooking(trip)) throw new Error('You already have a place in this party.');
  const id = options.id || newId();
  return { ...trip, members: [...trip.members, {
    id, passId: options.passId || newId(), name: options.name || 'You', place: options.isYou ? 'Your next adventure' : 'Invited friend',
    color: options.isYou ? 'green' : 'lilac', status: 'reserved', isYou: Boolean(options.isYou), waiver: false, gear: false,
  }] };
}

export function closeRegistration(trip) {
  if (trip.phase !== 'open') throw new Error('This departure is already closed.');
  const members = activeMembers(trip);
  if (members.length < trip.minimum) return cancelDeparture(trip, 'Minimum group size was not reached. No payments were collected.');
  const shares = splitFee(trip.guideFee, members.length);
  const locked = new Map(members.map((m, i) => [m.id, shares[i]]));
  return { ...trip, phase: 'payment', lockedCount: members.length, members: trip.members.map(m => locked.has(m.id) ? { ...m, lockedShare: locked.get(m.id) } : m) };
}

export function updateRequirements(trip, memberId, fields) {
  const m = trip.members.find(x => x.id === memberId);
  if (!m || !['reserved', 'paid'].includes(m.status) || trip.phase === 'cancelled') throw new Error('This booking is no longer active.');
  const allowed = ['name', 'emergencyName', 'emergencyPhone', 'waiver', 'gear'];
  const safe = Object.fromEntries(Object.entries(fields).filter(([key]) => allowed.includes(key)));
  return { ...trip, members: trip.members.map(m => m.id === memberId ? { ...m, ...safe } : m) };
}

export function payBooking(trip, memberId) {
  const m = trip.members.find(x => x.id === memberId);
  if (trip.phase !== 'payment' || !m || m.status !== 'reserved' || !Number.isInteger(m.lockedShare)) throw new Error('Payment is not available for this booking.');
  if (!requirementsComplete(m)) throw new Error('Complete your registration checklist first.');
  return { ...trip, members: trip.members.map(m => m.id === memberId ? { ...m, status: 'paid', paidAmount: m.lockedShare + trip.personalFees } : m) };
}

export function expireUnpaid(trip) {
  if (trip.phase !== 'payment') throw new Error('Close registration before ending the payment window.');
  const members = trip.members.map(m => m.status === 'reserved' ? { ...m, status: 'expired' } : m);
  const paidShares = members.filter(m => m.status === 'paid').reduce((sum, m) => sum + m.lockedShare, 0);
  return { ...trip, phase: 'ready', organizerShortfall: trip.guideFee - paidShares, members };
}

export function cancelDeparture(trip, reason = 'The organizer cancelled this departure. Paid bookings receive a full simulated refund.') {
  return { ...trip, phase: 'cancelled', cancellationReason: reason, members: trip.members.map(m => m.status === 'paid' ? { ...m, status: 'refunded', refundAmount: m.paidAmount, checkedIn: false } : m.status === 'reserved' ? { ...m, status: 'cancelled' } : m) };
}

export function cancelBooking(trip, memberId, now = Date.now()) {
  const m = trip.members.find(x => x.id === memberId);
  if (!m || !['reserved', 'paid'].includes(m.status)) throw new Error('This booking is no longer active.');
  if (m.checkedIn) throw new Error('You have already checked in. Speak with your organizer.');
  const late = new Date(trip.departureAt).getTime() - now < 24 * 60 * 60 * 1000;
  return { ...trip, members: trip.members.map(m => m.id !== memberId ? m : m.status === 'paid' ? (late ? { ...m, refundRequested: true } : { ...m, status: 'refunded', refundAmount: m.paidAmount }) : { ...m, status: 'cancelled' }) };
}

export function checkIn(trip, memberId) {
  const member = trip.members.find(m => m.id === memberId);
  if (passStatus(trip, member) !== 'ready') throw new Error(passStatus(trip, member) === 'checked-in' ? 'This pass has already been used to check in.' : 'This pass is not ready for check-in.');
  return { ...trip, members: trip.members.map(m => m.id === memberId ? { ...m, checkedIn: true, checkedInAt: new Date().toISOString() } : m) };
}

export function recommendation(answers) {
  if (answers.experience === 'first' || answers.comfort === 'gentle' || answers.preference === 'forest') return 'luntian-loop';
  if (answers.experience === 'regular' && answers.comfort === 'long' && answers.preference === 'challenge') return 'hiraya-summit';
  return 'amihan-ridge';
}

export function validateSavedState(value) {
  return value?.version === 1 && Array.isArray(value.trips) && value.trips.length === 3 && value.trips.every(t =>
    typeof t.id === 'string' && Number.isInteger(t.guideFee) && Number.isInteger(t.personalFees) && Array.isArray(t.members) &&
    ['open', 'payment', 'ready', 'cancelled'].includes(t.phase) && t.members.every(m => typeof m.id === 'string' && typeof m.name === 'string' && ['reserved', 'paid', 'expired', 'cancelled', 'refunded'].includes(m.status)));
}
