import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ArrowRight, Users, Plus, Mountain, Minus, TrendingDown } from 'lucide-react';
import { money } from './domain';

gsap.registerPlugin(ScrollTrigger);

export function usePageMotion(route, root) {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const scope = root.current;
      if (!scope) return;
      const select = gsap.utils.selector(scope);
      const hero = select('.hero-editorial');
      if (hero.length) {
        const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
        intro.from(select('.hero-kicker'), { y: 16, autoAlpha: 0, duration: .5 })
          .from(select('.hero-line > span'), { yPercent: 110, rotate: 2, duration: .95, stagger: .12 }, '-=.25')
          .from(select('.hero-intro, .hero-actions, .hero-bottomline'), { y: 20, autoAlpha: 0, duration: .6, stagger: .1 }, '-=.5')
          .from(select('.hero-art'), { clipPath: 'inset(12% 0% 100% 0%)', duration: 1.1 }, 0.2);
        gsap.to(select('.hero-art > img'), { yPercent: 10, scale: 1.08, ease: 'none', scrollTrigger: { trigger: hero[0], start: 'top top', end: 'bottom top', scrub: .8 } });
      }
      select('.section-heading, .trail-card, .ready-banner, .price-story-copy, .price-experiment, .field-notes').forEach(el => {
        gsap.from(el, { y: 30, autoAlpha: 0, duration: .7, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 96%', once: true } });
      });
      select('.trip-title-row, .trip-visual, .registration-form, .registration-summary, .ticket, .pass-next, .scanner-card, .roster-card').forEach((el,i) => {
        gsap.from(el, { y: 20, autoAlpha: 0, duration: .6, delay: Math.min(i * .07,.2), ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 98%', once: true } });
      });
      const paths = select('.elevation-line');
      paths.forEach(path => {
        const length = path.getTotalLength();
        gsap.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.out', scrollTrigger: { trigger: path, start: 'top 95%', once: true } });
      });
      ScrollTrigger.refresh();
    }, root);
    return () => mm.revert();
  }, [route, root]);
}

export function AnimatedMoney({ value }) {
  const node = useRef(null); const last = useRef(value);
  useLayoutEffect(() => {
    if (!node.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { node.current.textContent = money(value); last.current = value; return; }
    const proxy = { amount: last.current };
    const tween = gsap.to(proxy, { amount: value, duration: .65, ease: 'power2.out', onUpdate: () => { if (node.current) node.current.textContent = money(Math.round(proxy.amount / 100) * 100); }, onComplete: () => { if (node.current) node.current.textContent = money(value); } });
    last.current = value;
    return () => tween.kill();
  }, [value]);
  return <span aria-label={money(value)} className="animated-money"><span aria-hidden="true" ref={node}>{money(value)}</span></span>;
}

export function TrailPhoto({ trip, className = '', loading, hero = false }) {
  const [fallback, setFallback] = useState(false);
  return <><img className={`trail-photo ${className} ${fallback ? 'is-placeholder' : ''}`} src={fallback ? trip.photoFallback : trip.image} alt={fallback ? `Original contour illustration; verified ${trip.name} photo pending` : `${trip.name}, ${trip.location}`} loading={loading} onError={() => setFallback(true)}/>{fallback && <span className={`photo-pending ${hero ? 'hero-photo-pending' : ''}`}>CONTOUR STUDY / {trip.name.toUpperCase()} PHOTO PENDING</span>}</>;
}

export function EditorialHero({ trip }) {
  return <section className="hero-editorial">
    <div className="hero-copy"><div className="hero-kicker"><span className="small-cross">✳</span><span>OUTSIDE, TOGETHER.</span><span className="hero-edition">PHILIPPINES / 001</span></div>
      <h1><span className="hero-line"><span>THE TRAIL</span></span><span className="hero-line"><span>STARTS WITH</span></span><span className="hero-line"><span className="rust-text">YOUR PEOPLE.</span></span></h1>
      <p className="hero-intro">A peak worth finding. A group worth joining.<br/>Split the guide, skip the paperwork, and get out there.</p>
      <div className="hero-actions"><a className="button primary" href={`#trip/${trip.id}`}>Find my next hike <ArrowUpRight size={20}/></a><a className="hero-secondary" href="#explore" onClick={e => { e.preventDefault(); document.getElementById('trail-directory')?.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'}); }}>Explore the departures <ArrowRight size={15}/></a></div>
      <div className="hero-bottomline"><span><span className="live-dot"/> 03 REAL MOUNTAINS. ONE SHARED ADVENTURE.</span><span>SCROLL TO FIND YOUR PEOPLE ↓</span></div>
    </div>
    <div className="hero-art"><TrailPhoto trip={trip} hero/><div className="hero-art-grain"/><div className="photo-index">01<span>/ 03</span></div><div className="hero-location"><span>THE FIRST CHAPTER</span><h2>MT. TALAMITAM</h2><p>NASUGBU, BATANGAS</p></div><div className="hero-cost-stamp"><TrendingDown size={17}/><div><strong>MORE PEOPLE.<br/>LESS PER PERSON.</strong><span>One guide. One shared fee.</span></div></div></div>
  </section>;
}

export function PriceStory() {
  const [count, setCount] = useState(4); const share = 180000 / count;
  return <section className="price-story" aria-labelledby="price-story-title"><div className="price-story-copy"><span className="eyebrow">THE GROUP CHAT FINALLY PAYS OFF.</span><h2 id="price-story-title">SAME GUIDE.<br/><span>SMALLER SHARE.</span></h2><p>The guide fee is per group. Every friend who joins before registration closes brings your share down. A good reason to send that invite.</p><div className="price-equation"><span>₱1,800 GUIDE FEE</span><span>÷</span><span>YOUR GROUP</span><span>=</span><span>YOUR SHARE</span></div><svg className="elevation-sketch" viewBox="0 0 500 95" aria-hidden="true"><path className="elevation-line" d="M0 88 65 63 89 74 163 26 182 42 248 8 281 38 317 22 383 66 421 50 500 88" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M0 88H500" fill="none" stroke="currentColor" strokeWidth=".5" strokeDasharray="3 5"/></svg></div><div className="price-experiment"><div className="experiment-heading"><span>TRY THE PRICE DROP</span><span>01 / SHARED COSTS</span></div><div className="experiment-people">{Array.from({length:6},(_,i) => <span key={i} className={i<count?'in':'out'}><Users size={25}/><small>{String(i+1).padStart(2,'0')}</small></span>)}</div><div className="experiment-price"><AnimatedMoney value={share}/><span>GUIDE SHARE<br/>PER PERSON</span></div><div className="experiment-controls"><button onClick={() => setCount(c=>Math.max(4,c-1))} disabled={count===4} aria-label="Remove one example hiker"><Minus size={18}/></button><span><strong>{count}</strong> hikers in the group</span><button onClick={() => setCount(c=>Math.min(6,c+1))} disabled={count===6} aria-label="Add one example hiker"><Plus size={18}/></button></div><p className="experiment-note">{count===6 ? 'Two more friends. ₱150 less per person.' : `Add ${6-count} more ${6-count===1?'friend':'friends'} to reach ₱300 each.`}</p><div className="experiment-footer"><span>ILLUSTRATIVE GUIDE FEE ONLY</span><span>Individual fees are extra.</span></div></div></section>;
}
