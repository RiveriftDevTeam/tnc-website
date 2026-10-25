import Credits from '@/screens/Credits';
import { creditsMetadata } from '@/screens/creditsMetadata';
export const metadata = creditsMetadata('en');
export default function Page() { return <Credits lang="en" />; }
