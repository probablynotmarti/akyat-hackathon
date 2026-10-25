import test from 'node:test';
import assert from 'node:assert/strict';
import { createCameraSession } from '../src/camera-session.js';

function harness(overrides = {}) {
  const states=[], reads=[], errors=[], frames=[];
  let stopped=0;
  const media={getTracks:()=>[{stop:()=>stopped++}]};
  const video={readyState:2,videoWidth:200,play:async()=>{}};
  const session=createCameraSession({getUserMedia:async()=>media,getVideo:()=>video,requestFrame:fn=>{frames.push(fn);return frames.length;},cancelFrame:()=>{},decode:()=>null,onState:v=>states.push(v),onRead:v=>reads.push(v),onError:e=>errors.push(e),...overrides});
  return {session,video,media,states,reads,errors,frames,get stopped(){return stopped;}};
}
test('camera stays open across frames without a QR; a decoded QR stops and reports once',async()=>{
  let result=null;
  const h=harness({decode:()=>result});await h.session.start();h.frames.shift()();
  assert.equal(h.states.at(-1),'live');assert.equal(h.stopped,0);
  result='AKYAT:fixture';h.frames.shift()();
  assert.equal(h.stopped,1);assert.deepEqual(h.reads,['AKYAT:fixture']);assert.equal(h.video.srcObject,null);
});
test('playback rejection is surfaced instead of silently leaving a black preview',async()=>{
  const error=Object.assign(new Error('Playback blocked'),{name:'NotAllowedError'});
  const h=harness({getVideo:()=>({play:async()=>{throw error;}})});await h.session.start();
  assert.equal(h.stopped,1);assert.deepEqual(h.errors,[error]);assert.equal(h.states.at(-1),'idle');
});
test('a permission request resolved after leaving the scanner releases its camera',async()=>{
  let resolve;const h=harness({getUserMedia:()=>new Promise(r=>resolve=r)});
  const pending=h.session.start();h.session.stop(false);resolve(h.media);await pending;
  assert.equal(h.stopped,1);assert.equal(h.frames.length,0);assert.deepEqual(h.states,['opening']);
});
test('decoder failure releases the camera and provides a recoverable error',async()=>{
  const h=harness({decode:()=>{throw new Error('Unreadable frame');}});await h.session.start();h.frames.shift()();
  assert.equal(h.stopped,1);assert.equal(h.errors[0].message,'Unreadable frame');
});
test('permission rejection is reported without scheduling frames',async()=>{
  const h=harness({getUserMedia:async()=>{throw Object.assign(new Error('Denied'),{name:'NotAllowedError'});}});await h.session.start();
  assert.equal(h.errors[0].name,'NotAllowedError');assert.equal(h.frames.length,0);
});
