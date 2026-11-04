"use client";
import type { CSSProperties,ReactNode } from 'react';
import { motion,useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';
type Variant='default'|'secondary'|'destructive'|'red'|'blue'|'green'|'yellow'|'purple'|'pink'|'orange'|'cyan'|'indigo'|'violet'|'rose'|'amber'|'lime'|'emerald'|'sky'|'slate'|'fuchsia';
interface ShimmerTextProps {children:ReactNode;className?:string;variant?:Variant;duration?:number;delay?:number;spread?:number}
const variantMap:Record<Variant,string>={default:'',secondary:'text-secondary-foreground',destructive:'text-destructive',red:'text-red-600 dark:text-red-400',blue:'text-blue-600 dark:text-blue-400',green:'text-green-600 dark:text-green-400',yellow:'text-yellow-600 dark:text-yellow-400',purple:'text-purple-600 dark:text-purple-400',pink:'text-pink-600 dark:text-pink-400',orange:'text-orange-600 dark:text-orange-400',cyan:'text-cyan-600 dark:text-cyan-400',indigo:'text-indigo-600 dark:text-indigo-400',violet:'text-violet-600 dark:text-violet-400',rose:'text-rose-600 dark:text-rose-400',amber:'text-amber-600 dark:text-amber-400',lime:'text-lime-600 dark:text-lime-400',emerald:'text-emerald-600 dark:text-emerald-400',sky:'text-sky-600 dark:text-sky-400',slate:'text-slate-600 dark:text-slate-400',fuchsia:'text-fuchsia-600 dark:text-fuchsia-400'};
export function ShimmerText({children,className,variant='default',duration=1.5,delay=1.5,spread=50}:ShimmerTextProps){
 const reduced=useReducedMotion();
 return <span className="shimmer-wrap"><motion.span className={cn('shimmer-text',variantMap[variant],className)} style={{WebkitTextFillColor:reduced?'currentColor':'transparent',background:reduced?'none':'currentColor linear-gradient(to right, currentColor 0%, var(--shimmer-contrast, rgba(255,255,255,.7)) 40%, var(--shimmer-contrast, rgba(255,255,255,.7)) 60%, currentColor 100%)',WebkitBackgroundClip:'text',backgroundClip:'text',backgroundRepeat:'no-repeat',backgroundSize:`${spread}% 200%`} as CSSProperties} initial={{backgroundPositionX:'250%'}} animate={reduced?{}:{backgroundPositionX:['-100%','250%']}} transition={{duration,delay,repeat:Infinity,repeatDelay:1.5,ease:'linear'}}>{children}</motion.span></span>;
}
export default ShimmerText;
