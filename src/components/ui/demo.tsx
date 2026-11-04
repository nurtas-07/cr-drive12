import ShimmerText from './shimmer-text';
import { Pricing,makePlans } from './pricing';
import { copy } from '@/content';
export function ShimmerTextDemo(){return <div className="flex min-h-96 items-center justify-center p-8"><ShimmerText className="text-5xl font-bold tracking-tight">CR DRIVE</ShimmerText></div>;}
export function PricingDemo(){return <Pricing c={copy.ru} lang="ru" title={copy.ru.pricingTitle} description={copy.ru.pricingCopy} plans={makePlans(copy.ru)}/>;}
export default ShimmerTextDemo;
