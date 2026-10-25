import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Mountain, ArrowLeft, ArrowRight, ArrowUpRight, Check, Footprints, Compass, Sun, Users, LockKeyhole, Eye, EyeOff, Route } from 'lucide-react';
import { ACCOUNT_KEY, SESSION_KEY, EXPERIENCE, readAccount, readSession, makeAccount, publicProfile, verifyLogin, validateDetails, validatePassword, trailMatch, localToday } from './onboarding-model';
import './onboarding.css';

function Logo({ onClick }) { return <button className="entry-logo" onClick={onClick} aria-label="Back to Akyat welcome"><Mountain size={28}/>AKYAT<span>.</span></button>; }
function Choice({ name, value, current, title, detail, icon: Icon, onChange }) { return <label className={`entry-choice ${current === value ? 'chosen' : ''}`}><input type="radio" name={name} value={value} checked={current === value} onChange={() => onChange(value)}/><span className="entry-choice-icon"><Icon size={23}/></span><span><strong>{title}</strong><small>{detail}</small></span><span className="choice-mark">{current===value && <Check size={13}/>}</span></label>; }

function Arrival({ profile, onDone, returning }) {
  const root = useRef(null); const complete = useRef(onDone);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia(); let timer;
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        const path = root.current.querySelector('path'); const length = path.getTotalLength();
        gsap.timeline({ onComplete: () => complete.current(profile) })
          .fromTo(path, { strokeDasharray:length, strokeDashoffset:length }, { strokeDashoffset:0, duration:1.15, ease:'power2.inOut' })
          .from('.arrival-copy', { y:16, autoAlpha:0, duration:.5 }, '-=.35')
          .to(root.current, { autoAlpha:0, y:-12, duration:.4, delay:.35 });
      },root);
      return () => ctx.revert();
    });
    mm.add('(prefers-reduced-motion: reduce)', () => { timer = setTimeout(() => complete.current(profile), 150); return () => clearTimeout(timer); });
    return () => { mm.revert(); clearTimeout(timer); };
  }, [profile]);
  return <div className="arrival" ref={root} role="status" aria-live="polite"><svg viewBox="0 0 300 160" aria-hidden="true"><path d="M15 145 86 58 118 95 180 14 285 145" fill="none" stroke="currentColor" strokeWidth="3"/></svg><div className="arrival-copy"><span className="eyebrow">YOUR NEXT CHAPTER</span><h1>{returning ? 'Welcome back,' : 'You belong out here,'}<br/>{profile.name.split(' ')[0]}.</h1><p>Let’s find your trail people.</p></div></div>;
}

export function AccountExperience({ children }) {
  const [profile,setProfile] = useState(() => { try { return readSession(localStorage,sessionStorage); } catch { return null; } });
  const signOut = () => { try { sessionStorage.removeItem(SESSION_KEY); } catch {} window.location.hash='explore'; setProfile(null); window.scrollTo(0,0); };
  return profile ? children(profile,signOut) : <Onboarding onComplete={p => { setProfile(p); window.scrollTo(0,0); }}/>;
}

function Onboarding({ onComplete }) {
  const [screen,setScreen] = useState('welcome'); const [step,setStep] = useState(0);
  const [existing] = useState(() => { try { return readAccount(localStorage); } catch { return null; } });
  const [form,setForm] = useState({ name:'',email:'',birthday:'',phone:'',password:'',confirmation:'',experience:'',comfort:'',preference:'' });
  const [login,setLogin] = useState({email:'',password:''}); const [visible,setVisible] = useState(false);
  const [error,setError] = useState(''); const [busy,setBusy] = useState(false); const [arrival,setArrival] = useState(null);
  const root = useRef(null); const title = useRef(null); const previous = useRef(null);
  const update = (key,value) => {setForm(f=>({...f,[key]:value}));setError('');};
  const navigate = next => {setError('');setVisible(false);setScreen(next);window.scrollTo(0,0);};
  useLayoutEffect(() => {
    const key = `${screen}-${step}`;
    if (previous.current !== null) title.current?.focus(); previous.current=key;
    const mm=gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)',()=> {
      gsap.from(root.current.querySelectorAll('.entry-reveal'),{y:20,autoAlpha:0,duration:.55,stagger:.07,ease:'power3.out'});
      const line=root.current.querySelector('.entry-route-line');
      if(line){const length=line.getTotalLength();gsap.fromTo(line,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,duration:1.4,ease:'power2.out'});}
    },root);
    return()=>mm.revert();
  },[screen,step]);
  useEffect(()=>{document.title=screen==='welcome'?'Your next chapter starts here — Akyat':screen==='login'?'Welcome back — Akyat':'Find your trail identity — Akyat';},[screen]);
  const showRegister=()=>{setStep(0);navigate('register');};
  const back=()=>{if(screen==='register'&&step>0){setStep(s=>s-1);setError('');setVisible(false);window.scrollTo(0,0);}else navigate('welcome');};
  const continueStep = e => {
    e.preventDefault();
    const issue=step===0?validateDetails(form):step===1?validatePassword(form.password,form.confirmation):step===2&&!form.experience?'Choose where you are in your hiking story.':step===3&&(!form.comfort||!form.preference)?'Choose a pace and something you look forward to.':'';
    if(issue){setError(issue);return;} setError('');setVisible(false);setStep(s=>s+1);window.scrollTo(0,0);
  };
  const finish = async () => {
    setBusy(true);setError('');
    try {
      if(readAccount(localStorage)) throw new Error('This browser already has a demo account. Log in to continue.');
      const a=await makeAccount(form);
      localStorage.setItem(ACCOUNT_KEY,JSON.stringify(a));
      // Session state is separate; failing to save it leaves a valid account to log into.
      sessionStorage.setItem(SESSION_KEY,a.id);
      setForm(f=>({...f,password:'',confirmation:'',birthday:'',phone:''}));
      setArrival(publicProfile(a));
    } catch(e){setError(e.name==='QuotaExceededError'||e.name==='SecurityError'?'Browser storage is unavailable. Allow site storage to create this demo account.':e.message);} finally{setBusy(false);}
  };
  const signIn = async e => {
    e.preventDefault();setBusy(true);setError('');
    try {
      const a=readAccount(localStorage);
      if(!a) throw new Error('No demo account on this browser yet. Choose “First time here” to create one.');
      if(!await verifyLogin(a,login.email,login.password)) throw new Error('That email and password don’t match this browser’s demo account.');
      sessionStorage.setItem(SESSION_KEY,a.id);setLogin({email:'',password:''});setArrival(publicProfile(a));
    } catch(e){setError(e.name==='SecurityError'?'Allow browser storage to log in to this demo.':e.message);}finally{setBusy(false);}
  };
  const first=form.name.trim().split(' ')[0]||'hiker'; const match=trailMatch(form); const matchName={'mt-talamitam':'Mt. Talamitam','mt-batulao':'Mt. Batulao','mt-ulap':'Mt. Ulap'}[match.id];
  const steps=['Your details','Your password','Your experience','Your kind of day','Ready to go'];
  if(arrival) return <Arrival profile={arrival} returning={screen==='login'} onDone={onComplete}/>;
  return <div className={`entry-shell ${screen==='welcome'?'entry-welcome':''}`} ref={root}>
    <header className="entry-header"><Logo onClick={()=>navigate('welcome')}/><span>PHILIPPINES <span className="entry-header-cross">✳</span> OUTSIDE, TOGETHER</span><span className="entry-demo-badge">INTERACTIVE DEMO</span></header>
    <div className="entry-layout">
      <aside className="entry-art" aria-label="Illustrated mountain trail"><div className="entry-art-top"><span>FIELD GUIDE / 001</span><Compass size={29} strokeWidth={1}/></div><div className="entry-art-copy"><span className="eyebrow">EVERY HIKER STARTS SOMEWHERE.</span><h2>A LITTLE<br/>COURAGE.<br/><span>A WHOLE<br/>NEW VIEW.</span></h2></div><svg className="entry-mountain" viewBox="0 0 600 430" aria-hidden="true"><circle cx="440" cy="105" r="58" fill="#c7ad7c" opacity=".5"/>{[0,1,2,3,4,5,6,7,8].map(n=><path key={n} d={`M-50 ${430+n*13} L105 ${225+n*13} L183 ${282+n*13} L330 ${90+n*13} L650 ${430+n*13}`} fill="none" stroke="#b0ad8b" strokeWidth="1" opacity={.2+n*.06}/>)}<path className="entry-route-line" d="M20 420 C115 400 95 345 178 334 S210 246 290 249 S275 170 330 148" fill="none" stroke="#dfc39b" strokeWidth="2"/><circle cx="330" cy="148" r="5" fill="#dfc39b"/></svg><div className="entry-art-bottom"><span>01 / FIND YOUR PEOPLE<br/>02 / SHARE THE CLIMB<br/>03 / MAKE IT A MEMORY</span><span>AKYAT FIELD NOTES<br/>THE BEGINNING ↗</span></div></aside>
      <main className="entry-panel">
        {screen!=='welcome'&&<button className="entry-back" onClick={back} disabled={busy}><ArrowLeft size={16}/>{screen==='register'&&step>0?'Previous step':'Back to the beginning'}</button>}
        {screen==='welcome' ? <section className="entry-welcome-content"><span className="eyebrow entry-reveal">THE MOUNTAIN CAN WAIT. YOUR STORY CAN’T.</span><h1 ref={title} tabIndex={-1} className="entry-reveal">GOOD TRAILS.<br/>BETTER<br/><span>COMPANY.</span></h1><p className="entry-lead entry-reveal">Your next adventure starts with a hello.<br/>Find your people. Share the climb.</p><div className="entry-welcome-actions entry-reveal"><button className="button primary" onClick={showRegister}>First time here <ArrowUpRight size={20}/></button><button className="button secondary" onClick={()=>navigate('login')}>Log in <ArrowRight size={18}/></button></div><div className="entry-welcome-note entry-reveal"><span className="entry-mini-avatars"><span>YOU</span><span>+</span><span>US</span></span><p>No trail experience required.<br/>Just a little curiosity.</p></div><p className="entry-disclaimer entry-reveal">A hackathon account demo, saved only in this browser.<br/>Use made-up details and a password you don’t use elsewhere.</p></section> : screen==='login' ? <section className="entry-form-content"><span className="eyebrow entry-reveal">PICK UP WHERE YOU LEFT OFF</span><h1 ref={title} tabIndex={-1} className="entry-reveal">The trail<br/>missed you.</h1><p className="entry-lead entry-reveal">Your people, your plans, your next peak.<br/>Let’s get you back out there.</p><form onSubmit={signIn} className="entry-form entry-reveal"><label>Email address<input type="email" autoComplete="off" required maxLength={254} value={login.email} onChange={e=>setLogin({...login,email:e.target.value})} placeholder="you@example.com"/></label><label>Password<div className="entry-password"><input type={visible?'text':'password'} autoComplete="off" required value={login.password} onChange={e=>setLogin({...login,password:e.target.value})} placeholder="Your demo password"/><button type="button" aria-label={visible?'Hide password':'Show password'} onClick={()=>setVisible(v=>!v)}>{visible?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>{error&&<p role="alert" className="entry-error">{error}</p>}<button className="button primary full" disabled={busy}>{busy?'Opening your trail book…':'Log in'}<ArrowRight size={18}/></button></form><button className="entry-text-link" onClick={showRegister}>First time here? Start your story <ArrowUpRight size={14}/></button><p className="entry-disclaimer entry-reveal">Local demo login only. Use the account created on this browser. Email verification and password recovery aren’t available yet.</p></section> : <section className="entry-form-content">
          <div className="entry-progress" aria-label={`Step ${step+1} of 5: ${steps[step]}`}><div>{steps.map((label,i)=><span key={label} className={i<=step?'reached':''}/>)}</div><span>0{step+1} / 05 <b>{steps[step]}</b></span></div>
          {existing ? <><h1 ref={title} tabIndex={-1}>You’ve already<br/>said hello.</h1><p className="entry-lead">There’s a demo account on this browser. Log in to keep your profile and trail plans together.</p><button className="button primary" onClick={()=>navigate('login')}>Go to log in <ArrowRight size={18}/></button></> : <>
          {step===0&&<><span className="eyebrow entry-reveal">LET’S START WITH A HELLO</span><h1 ref={title} tabIndex={-1} className="entry-reveal">Who’s joining<br/>the adventure?</h1><p className="entry-lead entry-reveal">A few details for your trail profile.<br/>Made-up details are perfect for this demo.</p><form className="entry-form entry-reveal" onSubmit={continueStep}><label>Your name<input required maxLength={80} autoComplete="off" placeholder="e.g. Alex Rivera" value={form.name} onChange={e=>update('name',e.target.value)}/></label><label>Email address<input required type="email" maxLength={254} autoComplete="off" placeholder="alex@example.com" value={form.email} onChange={e=>update('email',e.target.value)}/></label><div className="entry-form-row"><label>Birthday<input required type="date" min="1900-01-01" max={localToday()} value={form.birthday} onChange={e=>update('birthday',e.target.value)}/></label><label>Contact number<input required type="tel" autoComplete="off" placeholder="+63 900 000 0000" value={form.phone} onChange={e=>update('phone',e.target.value)}/></label></div>{error&&<p role="alert" className="entry-error">{error}</p>}<button className="button primary full">Nice to meet you <ArrowRight size={18}/></button><button type="button" className="entry-text-link" onClick={()=>setForm(f=>({...f,name:'Alex Rivera',email:'alex@example.com',birthday:'1998-06-12',phone:'+63 900 000 0000'}))}>Fill with sample details</button></form><p className="entry-disclaimer entry-reveal">Birthday and contact number demonstrate the form; they aren’t saved. Your email stays on this device. No messages are sent.</p></>}
          {step===1&&<><span className="eyebrow entry-reveal">A LITTLE SPACE THAT’S YOURS</span><h1 ref={title} tabIndex={-1} className="entry-reveal">Make yourself<br/>at home, {first}.</h1><p className="entry-lead entry-reveal">Set a demo password to return to your profile.<br/>Use something you don’t use anywhere else.</p><form className="entry-form entry-reveal" onSubmit={continueStep}><label>Create password<div className="entry-password"><input type={visible?'text':'password'} required minLength={10} maxLength={128} autoComplete="off" placeholder="At least 10 characters" value={form.password} onChange={e=>update('password',e.target.value)}/><button type="button" aria-label={visible?'Hide password':'Show password'} onClick={()=>setVisible(v=>!v)}>{visible?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label><label>Confirm password<input type={visible?'text':'password'} required minLength={10} maxLength={128} autoComplete="off" value={form.confirmation} onChange={e=>update('confirmation',e.target.value)} placeholder="One more time"/></label><div className="entry-password-rule"><Check size={14}/>{form.password.length>=10?'Length looks good.':'10 characters or more.'}</div>{error&&<p role="alert" className="entry-error">{error}</p>}<button className="button primary full">Let’s talk trails <ArrowRight size={18}/></button></form><p className="entry-disclaimer entry-reveal"><LockKeyhole size={12}/> Your password isn’t stored as plain text. This remains a local prototype, not a production account.</p></>}
          {step===2&&<><span className="eyebrow entry-reveal">NO WRONG STARTING POINT</span><h1 ref={title} tabIndex={-1} className="entry-reveal">Where does your<br/>trail story begin?</h1><p className="entry-lead entry-reveal">First steps or familiar paths, you belong here.<br/>We’ll start with a pace that feels like you.</p><form onSubmit={continueStep} className="entry-reveal"><fieldset className="entry-choices"><legend className="entry-sr-only">Hiking experience</legend><Choice name="experience" value="first" current={form.experience} title="First-time hiker" detail="New shoes. New views. Let’s start gently." icon={Footprints} onChange={v=>update('experience',v)}/><Choice name="experience" value="some" current={form.experience} title="I’ve hiked a few times" detail="A few trails behind me. More to discover." icon={Route} onChange={v=>update('experience',v)}/><Choice name="experience" value="regular" current={form.experience} title="Experienced hiker" detail="The trail feels like a second home." icon={Mountain} onChange={v=>update('experience',v)}/></fieldset>{error&&<p role="alert" className="entry-error">{error}</p>}<button className="button primary full">That’s me <ArrowRight size={18}/></button></form></>}
          {step===3&&<><span className="eyebrow entry-reveal">YOUR PACE. YOUR KIND OF DAY.</span><h1 ref={title} tabIndex={-1} className="entry-reveal">What sounds<br/>like a good day?</h1><p className="entry-lead entry-reveal">Choose what you want today.<br/>Experience doesn’t mean you have to go harder.</p><form onSubmit={continueStep} className="entry-reveal"><fieldset className="entry-pill-group"><legend>How long would you like to be out?</legend>{[['short','A shorter outing','Around 3–4 hours'],['half','A little longer','Around 4–5 hours'],['full','Make a day of it','Around 5–6 hours']].map(([v,t,d])=><label key={v} className={form.comfort===v?'selected':''}><input type="radio" name="comfort" checked={form.comfort===v} onChange={()=>update('comfort',v)}/><strong>{t}</strong><small>{d}</small></label>)}</fieldset><fieldset className="entry-pill-group"><legend>What are you looking forward to?</legend>{[['scenery','The scenery',Sun],['people','The people',Users],['challenge','The climb',Mountain]].map(([v,t,Icon])=><label key={v} className={form.preference===v?'selected':''}><input type="radio" name="preference" checked={form.preference===v} onChange={()=>update('preference',v)}/><Icon size={20}/><strong>{t}</strong></label>)}</fieldset>{error&&<p role="alert" className="entry-error">{error}</p>}<button className="button primary full">Find my direction <ArrowRight size={18}/></button></form></>}
          {step===4&&<><span className="eyebrow entry-reveal">A STARTING POINT, JUST FOR YOU</span><h1 ref={title} tabIndex={-1} className="entry-reveal">You bring you.<br/>We’ll find the view.</h1><p className="entry-lead entry-reveal">Here’s where your answers are pointing, {first}.</p><div className="entry-match entry-reveal"><span className="eyebrow">YOUR FIRST SUGGESTION</span><Mountain size={40} strokeWidth={1}/><h2>{matchName}</h2><p>{match.reason}</p><div><span>{EXPERIENCE[form.experience]}</span><span>Based on your answers</span></div></div><p className="entry-match-note entry-reveal">A starting suggestion, not fitness clearance. Route details are demo estimates; check real conditions with the organizer.</p>{error&&<p role="alert" className="entry-error">{error}</p>}<button className="button primary full entry-reveal" onClick={finish} disabled={busy}>{busy?'Getting your trail book ready…':'Create demo account & explore'}<ArrowUpRight size={19}/></button><p className="entry-disclaimer entry-reveal">Your profile and demo login are saved on this browser only.</p></>}
          </>}
        </section>}
        <footer className="entry-panel-footer"><span>A LITTLE LESS PLANNING.</span><span>A LOT MORE MOUNTAIN. ↗</span></footer>
      </main>
    </div>
  </div>;
}
