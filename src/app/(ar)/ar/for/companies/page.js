import Persona from '@/screens/Persona';
import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata('companies', 'ar');
export default function Page() { return <Persona lang="ar" persona="companies" />; }
