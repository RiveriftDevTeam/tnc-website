import Order from '@/screens/Order';
import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata('order', 'en');
export default function Page() { return <Order lang="en" />; }
