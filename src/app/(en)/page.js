import Home from '@/screens/Home';
import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata('home', 'en');
export default function Page() { return <Home lang="en" />; }
