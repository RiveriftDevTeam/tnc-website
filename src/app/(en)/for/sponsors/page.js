import Persona from '@/screens/Persona';
import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata('sponsors', 'en');
export default function Page() { return <Persona lang="en" persona="sponsors" />; }
