import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState, splitFee, joinParty, estimatedShare, closeRegistration, updateRequirements, payBooking, expireUnpaid, cancelDeparture, cancelBooking, passStatus, checkIn, recommendation, validateSavedState, refreshCatalog, safeReturnStatus, checkOut, simulateOverdue, setBuddy } from '../src/domain.js';

const base = () => createInitialState().trips[0];
const join = (t = base()) => joinParty(t, { isYou: true, name: 'Demo Hiker', id: 'you', passId: 'opaque-test-pass' });
const complete = t => updateRequirements(t, 'you', { name: 'Demo Hiker', emergencyName: 'Demo Contact', emergencyPhone: '+63 900 000 0000', waiver: true, gear: true });
const paid = () => payBooking(complete(closeRegistration(join())), 'you');
const you = t => t.members.find(m => m.id === 'you');

test('guide shares total the exact group fee, including centavo remainders', () => {
  for (let count = 1; count <= 17; count++) assert.equal(splitFee(180001, count).reduce((a,b) => a+b,0), 180001);
  assert.deepEqual(splitFee(100, 3), [34, 33, 33]);
});
test('hero journey drops from 450 to 300 when two friends join', () => {
  let t = join(); assert.equal(estimatedShare(t), 45000);
  t = joinParty(joinParty(t, { id: 'friend1' }), { id: 'friend2' });
  assert.equal(estimatedShare(t), 30000); assert.throws(() => joinParty(t), /full/);
});
test('duplicate reservation and joining after close are rejected', () => {
  assert.throws(() => joinParty(join(), { isYou: true }), /already/);
  assert.throws(() => joinParty(closeRegistration(join())), /closed/);
});
test('below minimum cancels without collecting payment', () => {
  const t = closeRegistration(createInitialState().trips[3]);
  assert.equal(t.phase, 'cancelled'); assert.equal(t.members.some(m => m.status === 'paid'), false);
});
test('unpaid and incomplete bookings cannot produce a valid admission', () => {
  let t = closeRegistration(join()); assert.equal(passStatus(t, you(t)), 'incomplete');
  assert.throws(() => payBooking(t, 'you'), /checklist/);
  t = complete(t); assert.equal(passStatus(t, you(t)), 'incomplete');
  t = payBooking(t, 'you'); assert.equal(passStatus(t, you(t)), 'ready');
  assert.equal(you(t).paidAmount, 60000);
});
test('expiring unpaid reservations never reprices the paid quote', () => {
  const t = expireUnpaid(paid());
  assert.equal(you(t).lockedShare, 45000); assert.equal(you(t).paidAmount, 60000);
  assert.equal(t.organizerShortfall, 135000); assert.equal(t.members.filter(m => m.status === 'expired').length, 3);
});
test('organizer cancellation invalidates passes and refunds full paid totals', () => {
  const t = cancelDeparture(paid()); assert.equal(passStatus(t, you(t)), 'cancelled');
  assert.equal(you(t).refundAmount, 60000); assert.equal(you(t).status, 'refunded');
});
test('hiker cancellation: 24h boundary refunds; later requests need review', () => {
  const t = paid(); const at = new Date(t.departureAt).getTime();
  assert.equal(you(cancelBooking(t, 'you', at - 86400000)).status, 'refunded');
  const late = cancelBooking(t, 'you', at - 86399999);
  assert.equal(you(late).refundRequested, true); assert.equal(you(late).status, 'paid');
});
test('check-in is explicit and duplicate scanning cannot admit twice', () => {
  let t = paid(); assert.equal(you(t).checkedIn, undefined);
  t = checkIn(t, 'you'); assert.equal(passStatus(t, you(t)), 'checked-in');
  assert.throws(() => checkIn(t, 'you'), /already/);
  assert.throws(() => cancelBooking(t, 'you'), /already checked/);
});
test('requirements updates cannot overwrite payment or admission state', () => {
  const t = updateRequirements(join(), 'you', { name: 'Demo', status: 'paid', checkedIn: true });
  assert.equal(you(t).status, 'reserved'); assert.equal(you(t).checkedIn, undefined);
});
test('readiness gives a gentler trail to first-time hikers', () => {
  assert.equal(recommendation({ experience: 'first', comfort: 'long', preference: 'challenge' }), 'mt-talamitam');
});
test('saved-state validation rejects malformed data', () => {
  assert.equal(validateSavedState(createInitialState()), true); assert.equal(validateSavedState({ version: 1, trips: [{}] }), false);
});

// A visual catalog update must not erase an already-issued pass.
test('legacy catalog migration preserves paid bookings and duplicate check-in protection', () => {
  const old = createInitialState();
  old.trips[0] = { ...checkIn(paid(), 'you'), id: 'amihan-ridge', name: 'Amihan Ridge' };
  old.trips[1].id = 'luntian-loop'; old.trips[2].id = 'hiraya-summit';
  const fresh = refreshCatalog(old);
  assert.deepEqual(fresh.trips.map(t => t.id), ['mt-talamitam', 'mt-pinatubo', 'mt-ulap', 'mt-pulag', 'mt-daraitan', 'mt-makiling', 'mt-pamitinan']);
  assert.equal(fresh.trips[0].name, 'Mt. Talamitam');
  assert.equal(you(fresh.trips[0]).paidAmount, 60000);
  assert.equal(you(fresh.trips[0]).passId, 'opaque-test-pass');
  assert.equal(passStatus(fresh.trips[0], you(fresh.trips[0])), 'checked-in');
  assert.throws(() => checkIn(fresh.trips[0], 'you'), /already/);
});

test('seven-mountain refresh keeps existing bookings and retains a retired booked destination', () => {
  const old=createInitialState(); old.trips=old.trips.slice(0,3);
  old.trips[1]={...joinParty(old.trips[1],{isYou:true,id:'legacy-you',passId:'legacy-pass'}),id:'mt-batulao',name:'Mt. Batulao'};
  const fresh=refreshCatalog(old);
  assert.equal(validateSavedState(fresh),true);
  assert.equal(fresh.trips.filter(t=>t.id==='mt-pinatubo').length,1);
  assert.equal(fresh.trips.find(t=>t.id==='mt-batulao').members.find(m=>m.isYou).passId,'legacy-pass');
  assert.equal(fresh.trips.find(t=>t.id==='mt-batulao').name,'Mt. Batulao');
  assert.equal(createInitialState().trips.length,7);
});


test('two express departures start at five of six and the last join unlocks payment',()=>{
  for(const id of ['mt-pinatubo','mt-ulap']) {
    let t=createInitialState().trips.find(t=>t.id===id);
    assert.equal(t.members.length,5); assert.equal(t.capacity,6);
    const before=estimatedShare(t);
    t=joinParty(t,{isYou:true,id:'you',passId:'express-pass'});
    assert.equal(t.phase,'payment'); assert.equal(t.members.length,6);
    assert.ok(you(t).lockedShare<before);
    assert.throws(()=>payBooking(t,'you'),/checklist/);
    t=payBooking(complete(t),'you');assert.equal(passStatus(t,you(t)),'ready');
    assert.equal(you(t).paidAmount,id==='mt-pinatubo'?30000:60000);
    assert.throws(()=>joinParty(t),/closed/);
  }
});
test('express seeds refresh untouched old lobbies without replacing an active booking',()=>{
  const old=createInitialState(); const t=old.trips[1]; delete t.demoSeedRevision;t.members=t.members.slice(0,2);
  assert.equal(refreshCatalog(old).trips[1].members.length,5);
  old.trips[1]=joinParty(t,{isYou:true,id:'you',passId:'keep-me'});
  const preserved=refreshCatalog(old).trips[1];assert.equal(preserved.members.length,3);assert.equal(you(preserved).passId,'keep-me');
});
test('safe return requires check-in, marks overdue, and resolves permanently at checkout',()=>{
  let t=paid();assert.equal(safeReturnStatus(t,you(t)),'not-started');
  assert.throws(()=>checkOut(t,'you'),/checked-in/);assert.throws(()=>simulateOverdue(t,'you'),/Check in/);
  t=checkIn(t,'you');assert.equal(safeReturnStatus(t,you(t)),'on-trail');
  assert.ok(you(t).expectedReturnAt);
  t=simulateOverdue(t,'you');assert.equal(safeReturnStatus(t,you(t)),'overdue');
  t=checkOut(t,'you');assert.equal(safeReturnStatus(t,you(t)),'returned');
  assert.throws(()=>checkOut(t,'you'),/checked-in/);assert.throws(()=>simulateOverdue(t,'you'),/returned/);
  assert.throws(()=>checkIn(t,'you'),/already/);
  assert.equal(safeReturnStatus(cancelDeparture(t),you(cancelDeparture(t))),'inactive');
  assert.equal(safeReturnStatus(refreshCatalog({...createInitialState(),trips:[t,...createInitialState().trips.slice(1)]}).trips[0],you(t)),'returned');
});
test('buddy pairing is optional, persists, and cannot be set on inactive bookings',()=>{
  let t=join();t=setBuddy(t,'you',true);assert.equal(you(t).buddyId,t.members[0].id);
  t=setBuddy(t,'you',false);assert.equal(you(t).buddyId,null);
  assert.throws(()=>setBuddy(cancelDeparture(t),'you',true),/active/);
});

test('expected return uses the upper trail-duration estimate plus one hour', () => {
  const t = checkIn({ ...paid(), duration: '6–8 hours', demoNow: 1800000000000 }, 'you');
  assert.equal(new Date(you(t).expectedReturnAt) - new Date(you(t).checkedInAt), 9 * 3600000);
});
