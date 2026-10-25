// Local UX-demo identity only. Production authentication belongs on a server.
export const ACCOUNT_KEY = 'akyat-demo-profile-v1';
export const SESSION_KEY = 'akyat-demo-session-v1';
export const SAMPLE_HISTORY = Object.freeze({ hikes: 4, typicalDistance: 4.2, typicalAscent: 220, days: 60 });
export const EXPERIENCE = { first: 'First-time hiker', some: 'Hiked a few times', regular: 'Experienced hiker' };
export const normalizeEmail = email => email.trim().toLowerCase();
export const localToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const hex = bytes => Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
const bytes = value => Uint8Array.from(value.match(/.{2}/g), h => parseInt(h, 16));

export function validateDetails(form, today = localToday()) {
  if (!form.name?.trim() || form.name.trim().length > 80) return 'Tell us your name (up to 80 characters).';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email?.trim() || '')) return 'Enter a valid email address.';
  const date = new Date(`${form.birthday}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(form.birthday || '') || !Number.isFinite(date.getTime()) || date.toISOString().slice(0,10) !== form.birthday || form.birthday >= today || form.birthday < '1900-01-01') return 'Choose a valid birthday in the past.';
  if (!/^\+[\d ()-]{7,20}$/.test(form.phone?.trim() || '')) return 'Include your country code, for example +63 900 000 0000.';
  return '';
}
export function validatePassword(password, confirmation) {
  if (password.length < 10) return 'Use at least 10 characters for your demo password.';
  if (password !== confirmation) return 'Those passwords don’t match yet.';
  return '';
}
async function derive(password, salt) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  return hex(new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: bytes(salt), iterations: 120000, hash: 'SHA-256' }, key, 256)));
}
export function validAccount(a) {
  return a?.version === 1 && typeof a.id === 'string' && typeof a.name === 'string' && typeof a.email === 'string' && Object.hasOwn(EXPERIENCE, a.experience) && ['short','half','full'].includes(a.comfort) && ['scenery','people','challenge'].includes(a.preference) && /^[a-f0-9]{32}$/.test(a.salt) && /^[a-f0-9]{64}$/.test(a.verifier);
}
export function readAccount(storage) { try { const a = JSON.parse(storage.getItem(ACCOUNT_KEY)); return validAccount(a) ? a : null; } catch { return null; } }
export function publicProfile(account) {
  return { id: account.id, name: account.name, email: account.email, experience: account.experience, comfort: account.comfort, preference: account.preference, sampleHistory: account.sampleHistory === true };
}
export async function makeAccount(form) {
  const error = validateDetails(form) || validatePassword(form.password, form.confirmation);
  if (error) throw new Error(error);
  if (!(Object.hasOwn(EXPERIENCE, form.experience)) || !['short','half','full'].includes(form.comfort) || !['scenery','people','challenge'].includes(form.preference)) throw new Error('Choose your hiking experience, pace, and what you enjoy.');
  const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
  // Explicit allowlist: birthday, phone, and plaintext passwords never persist.
  return { version: 1, id: crypto.randomUUID(), name: form.name.trim(), email: normalizeEmail(form.email), experience: form.experience, comfort: form.comfort, preference: form.preference, sampleHistory: form.sampleHistory === true, salt, verifier: await derive(form.password, salt) };
}
export async function verifyLogin(account, email, password) {
  if (!validAccount(account) || normalizeEmail(email) !== account.email) return false;
  return await derive(password, account.salt) === account.verifier;
}
export function readSession(local, session) {
  try { const a = readAccount(local); return a && session.getItem(SESSION_KEY) === a.id ? publicProfile(a) : null; } catch { return null; }
}
export function trailMatch(profile) {
  if (profile.experience === 'first') return { id: 'mt-talamitam', reason: 'You’re starting fresh. This sample departure has our gentlest pace and a small group to find your feet with.' };
  if (profile.comfort === 'short') return { id: 'mt-talamitam', reason: 'You asked for a shorter day. This is the shortest sample itinerary in our three-mountain collection.' };
  if (profile.sampleHistory) return { id: 'mt-talamitam', reason: 'The sample history shows mostly 4.2 km outings. This shorter sample itinerary is a closer starting match. No real activity account was connected.' };
  if (profile.experience === 'regular' && profile.comfort === 'full' && profile.preference === 'challenge') return { id: 'mt-ulap', reason: 'You hike regularly and want a full day with a rewarding climb. This is our longer sample itinerary.' };
  return { id: 'mt-batulao', reason: 'You have a few hikes behind you and time for a longer outing. This sample ridge departure is a place to explore next.' };
}
