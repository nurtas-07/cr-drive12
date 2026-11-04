import { useEffect,useRef,useState } from 'react';
import { motion,useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { BrandMark } from './Brand';
import ShimmerText from './ui/shimmer-text';
import { news,type SiteCopy } from '@/content';
export default function Intro({c,onClose,forceMotion=false}:{c:SiteCopy;onClose:()=>void;forceMotion?:boolean}){
 const prefersReduced=useReducedMotion();const reduce=prefersReduced&&!forceMotion;const [phase,setPhase]=useState(0);const skip=useRef<HTMLButtonElement>(null);
 useEffect(()=>{const previous=document.activeElement as HTMLElement|null;const savedOverflow=document.body.style.overflow;document.body.style.overflow='hidden';skip.current?.focus({preventScroll:true});
  const timers=reduce?[setTimeout(()=>setPhase(2),0),setTimeout(onClose,1500)]:[setTimeout(()=>setPhase(1),3600),setTimeout(()=>setPhase(2),5100),setTimeout(onClose,7700)];
  const key=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose();if(e.key==='Tab'){e.preventDefault();skip.current?.focus();}};window.addEventListener('keydown',key);
  return()=>{timers.forEach(clearTimeout);document.body.style.overflow=savedOverflow;window.removeEventListener('keydown',key);previous?.focus({preventScroll:true});};
 },[onClose,reduce]);
 return <motion.div className={`intro-overlay intro-phase-${phase} ${forceMotion?'motion-enabled':''}`} role="dialog" aria-modal="true" aria-label={c.introLabel} initial={{opacity:1}} exit={{opacity:0}} transition={{duration:reduce?0:.65}}>
  <div className="intro-header"><span>CR DRIVE <span> / </span> PROLOGUE</span><span className="intro-country">KAZAKHSTAN · 2026</span></div>
  {!reduce&&<div className="news-space" aria-hidden="true"><div className="news-wall">{[...news,...news,...news].map((n,i)=><article key={i} className={`news-clipping clipping-${i}`}><div className="clipping-head"><b>{n.source}</b><span>{n.date}</span></div>{n.image&&<div className="clipping-photo"><img src="./assets/news-aktobe.jpg" alt=""/></div>}<div className="clipping-region">КАЗАХСТАН / {n.region}</div><h2>{n.title}</h2><div className="clipping-lines"><i/><i/><i/><i/></div></article>)}</div></div>}
  <div className="intro-statement" aria-hidden={phase!==1}><p>{c.introLine}</p></div>
  <div className="intro-lockup" aria-hidden={phase!==2}><BrandMark/><ShimmerText className="intro-wordmark" duration={2.4} delay={.15}>CR DRIVE</ShimmerText><p>{c.introEnd}</p></div>
  <div className="intro-footer"><span>{phase===0?c.introLabel:phase===1?'01 — HUMAN FIRST':'02 — CR DRIVE'}</span><button ref={skip} onClick={onClose} className="intro-skip">{c.introSkip}<ArrowRight size={16}/></button></div>
  <div className="intro-progress"><i/></div>
 </motion.div>
}
