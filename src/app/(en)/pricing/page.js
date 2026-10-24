import Pricing from '@/screens/Pricing';
import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata('pricing', 'en');
export default function Page() { return <Pricing lang="en" />; }
