import Shell from '@/components/Shell';
import { SITE_URL } from '@/content/site';
import { fontVars } from '@/fonts/en';
export const metadata = { metadataBase: new URL(SITE_URL), applicationName: 'TapNConnect', icons: { icon: '/icon.svg' }, manifest: '/site.webmanifest' };
export const viewport = { themeColor: [{ media: '(prefers-color-scheme: light)', color: '#F6F1EA' }, { media: '(prefers-color-scheme: dark)', color: '#12100E' }], width: 'device-width', initialScale: 1 };
export default function Layout({ children }) { return <Shell lang="en" fonts={fontVars}>{children}</Shell>; }
