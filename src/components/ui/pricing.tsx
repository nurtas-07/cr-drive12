"use client";
import { useState,useRef } from 'react';
import { motion,useReducedMotion } from 'framer-motion';
import NumberFlow from '@number-flow/react';
import confetti from 'canvas-confetti';
import { ArrowUpRight,Check,Plus,Minus,Radio,Watch,Users } from 'lucide-react';
import { buttonVariants } from './button';
import { Label } from './label';
import { Switch } from './switch';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import { telegram,type Language,type SiteCopy } from '@/content';
export interface PricingPlan {name:string;price:string|null;yearlyPrice:string|null;period:string;features:string[];description:string;buttonText:string;href:string;isPopular:boolean}
interface PricingProps {plans:PricingPlan[];title?:string;description?:string;c:SiteCopy;lang:Language}
export function Pricing({plans,title,description,c,lang}:PricingProps){
 const [isMonthly,setIsMonthly]=useState(true),[drivers,setDrivers]=useState(10);const desktop=useMediaQuery('(min-width: 900px)');const reduced=useReducedMotion();const switchRef=useRef<HTMLButtonElement>(null);
 const locale=lang==='en'?'en-US':lang==='kz'?'kk-KZ':'ru-RU';const number=(n:number)=>new Intl.NumberFormat(locale).format(n);const icons=[Watch,Radio,Users];
 function toggle(checked:boolean){setIsMonthly(!checked);if(checked&&switchRef.current&&!reduced){const rect=switchRef.current.getBoundingClientRect();confetti({particleCount:30,spread:60,origin:{x:(rect.x+rect.width/2)/innerWidth,y:(rect.y+rect.height/2)/innerHeight},colors:['#94dce7','#ffffff','#b9c5cc'],ticks:100,gravity:1.2,decay:.94,startVelocity:16,shapes:['circle'],disableForReducedMotion:true});}}
 return <div className="pricing-inner"><div className="section-heading pricing-heading"><div><p className="eyebrow">{c.pricingTag}</p><h2>{title}</h2></div><p>{description}</p></div>
 <div className="billing-row"><span className={isMonthly?'selected':''}>{c.monthly}</span><Switch id="billing" ref={switchRef} checked={!isMonthly} onCheckedChange={toggle} aria-label={c.annual}/><Label htmlFor="billing" className={!isMonthly?'selected':''}>{c.yearly}</Label><span className="billing-currency">KZT / ₸</span></div>
 <div className="pricing-grid">{plans.map((plan,index)=>{const Icon=icons[index]??Radio;return <motion.article key={plan.name} className={cn('price-card',plan.isPopular&&'price-card-featured')} initial={false} whileInView={reduced?{}:{y:desktop&&plan.isPopular?-12:0}} viewport={{once:true,amount:.2}} transition={{type:'spring',stiffness:100,damping:30,delay:index*.1}}>
 <div className="price-card-top"><Icon size={24}/><span>{plan.isPopular?c.popular:`0${index+1}`}</span></div><h3>{plan.name}</h3><p className="plan-desc">{plan.description}</p>
 <div className="price-value">{plan.price!==null?<NumberFlow value={Number(isMonthly?plan.price:plan.yearlyPrice)} locales={locale} format={{style:'currency',currency:'KZT',currencyDisplay:'narrowSymbol',maximumFractionDigits:0}} animated={!reduced} transformTiming={{duration:500,easing:'ease-out'}}/>:<span className="price-custom">{c.customPrice}</span>}</div><p className="price-period">{index===0?c.once:index===1?`${isMonthly?c.perMonth:c.perYear} · ${c.perDriver}`:' '}</p>
 <ul>{plan.features.map(feature=><li key={feature}><Check size={16}/>{feature}</li>)}</ul><a href={plan.href} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({variant:plan.isPopular?'default':'outline'}),'price-button')}>{plan.buttonText}<ArrowUpRight size={17}/></a>
 </motion.article>})}</div><p className="pricing-note">{c.pricingNote}</p>
 <div className="fleet-calculator"><div className="calc-control"><h3>{c.calc}</h3><div className="counter"><button onClick={()=>setDrivers(n=>Math.max(1,n-1))} aria-label={`${c.drivers} −1`} disabled={drivers<=1}><Minus size={17}/></button><Label htmlFor="driver-count" className="sr-only">{c.drivers}</Label><input id="driver-count" type="number" inputMode="numeric" min="1" max="500" value={drivers} onChange={e=>setDrivers(Math.min(500,Math.max(1,Math.floor(Number(e.target.value)||1))))}/><button onClick={()=>setDrivers(n=>Math.min(500,n+1))} aria-label={`${c.drivers} +1`} disabled={drivers>=500}><Plus size={17}/></button><span>{c.drivers}</span></div><input aria-label={c.drivers} type="range" min="1" max="100" value={Math.min(drivers,100)} onChange={e=>setDrivers(Number(e.target.value))}/></div><div className="calc-totals" aria-live="polite"><div><span>{c.equipment}</span><b>{number(drivers*45000)} ₸</b></div><div><span>{c.subscription}</span><b>{number(drivers*3000)} ₸</b></div><div className="calc-total"><span>{c.firstMonth}</span><b>{number(drivers*48000)} ₸</b></div></div><p className="calc-note">{c.calcNote}</p></div>
 </div>;
}
export function makePlans(c:SiteCopy):PricingPlan[]{return c.plans.map((p,i)=>({name:p.name,description:p.desc,features:p.features,buttonText:p.button,price:i===0?'45000':i===1?'3000':null,yearlyPrice:i===0?'45000':i===1?'36000':null,period:i===0?c.once:c.perMonth,href:telegram,isPopular:i===1}));}
