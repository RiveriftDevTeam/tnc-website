import Home from '@/screens/Home';
import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata('home', 'ar');
export default function Page() { return <Home lang="ar" />; }
