import Persona from '@/screens/Persona';
import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata('organisers', 'en');
export default function Page() { return <Persona lang="en" persona="organisers" />; }
