import test from 'node:test';
import assert from 'node:assert/strict';
import { makeAccount, verifyLogin, validateDetails, validatePassword, trailMatch, ACCOUNT_KEY, SESSION_KEY, readSession, publicProfile } from '../src/onboarding-model.js';
const form={name:'Alex Demo',email:' Alex@Example.com ',birthday:'1998-06-12',phone:'+63 900 000 0000',password:'DemoTrailOnly42',confirmation:'DemoTrailOnly42',experience:'some',comfort:'half',preference:'people'};
const storage = initial => { const data=new Map(Object.entries(initial||{}));return {getItem:key=>data.get(key)||null,setItem:(key,value)=>data.set(key,value)}; };

test('registration rejects impossible birthdays, missing country codes, and mismatched passwords',()=>{
  assert.equal(validateDetails(form,'2026-10-25'),'');
  for(const birthday of ['2025-02-30','2027-01-01','2026-10-25','']) assert.notEqual(validateDetails({...form,birthday},'2026-10-25'),'');
  assert.notEqual(validateDetails({...form,phone:'09000000000'},'2026-10-25'),'');
  assert.notEqual(validatePassword('short','short'),'');
  assert.notEqual(validatePassword('DemoTrailOnly42','DifferentDemo42'),'');
});
test('demo account verifies the password without retaining plaintext, birthday, or phone',async()=>{
  const a=await makeAccount(form);
  assert.equal(a.email,'alex@example.com');
  for(const field of ['password','confirmation','birthday','phone']) assert.equal(field in a,false);
  assert.equal(await verifyLogin(a,' ALEX@example.com ',form.password),true);
  assert.equal(await verifyLogin(a,'alex@example.com','WrongPassword42'),false);
  assert.equal(await verifyLogin(a,'another@example.com',form.password),false);
  assert.equal('verifier' in publicProfile(a),false);
  assert.equal('salt' in publicProfile(a),false);
});
test('a demo session requires the matching stored account and clears when signed out',async()=>{
  const a=await makeAccount(form);const local=storage({[ACCOUNT_KEY]:JSON.stringify(a)});const session=storage();
  assert.equal(readSession(local,session),null);
  session.setItem(SESSION_KEY,a.id);assert.equal(readSession(local,session).name,'Alex Demo');
  session.setItem(SESSION_KEY,'other');assert.equal(readSession(local,session),null);
  local.setItem(ACCOUNT_KEY,'malformed');assert.equal(readSession(local,session),null);
});
test('first-time hikers and short-day preferences stay on the gentler suggestion',()=>{
  assert.equal(trailMatch({...form,experience:'first',comfort:'full',preference:'challenge'}).id,'mt-talamitam');
  assert.equal(trailMatch({...form,experience:'regular',comfort:'short',preference:'challenge'}).id,'mt-talamitam');
});
test('recommendations use only onboarding answers and ignore obsolete imported-history flags',()=>{
  const experienced={...form,experience:'regular',comfort:'full',preference:'challenge'};
  assert.equal(trailMatch(experienced).id,'mt-ulap');
  assert.deepEqual(trailMatch({...experienced,sampleHistory:true}),trailMatch(experienced));
  assert.equal(trailMatch(form).id,'mt-pinatubo');
  assert.equal('sampleHistory' in publicProfile({...form,id:'legacy',sampleHistory:true}),false);
});

import { DEMO_ACCOUNT } from '../src/demo-account.js';
test('shared demo sessions work on fresh browsers without replacing a personal account', async()=>{
  const personal=await makeAccount(form); const local=storage({[ACCOUNT_KEY]:JSON.stringify(personal)});
  const session=storage({[SESSION_KEY]:DEMO_ACCOUNT.id});
  assert.equal(readSession(storage(),session).email,'hackathon@gmail.com');
  assert.equal(readSession(local,session).id,DEMO_ACCOUNT.id);
  assert.equal(JSON.parse(local.getItem(ACCOUNT_KEY)).id,personal.id);
  assert.equal(await verifyLogin(DEMO_ACCOUNT,'hackathon@gmail.com','wrong demo password'),false);
});
