import Persona from '@/screens/Persona';
import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata('exhibitors', 'en');
export default function Page() { return <Persona lang="en" persona="exhibitors" />; }
