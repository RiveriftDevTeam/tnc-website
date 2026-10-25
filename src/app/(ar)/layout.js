import Shell from '@/components/Shell';
import { SITE_URL } from '@/content/site';
import { fontVars } from '@/fonts/ar';
export const metadata = { metadataBase: new URL(SITE_URL), applicationName: 'TapNConnect', icons: { icon: '/icon.svg' }, manifest: '/site.webmanifest' };
export const viewport = { themeColor: [{ media: '(prefers-color-scheme: light)', color: '#F3EADB' }, { media: '(prefers-color-scheme: dark)', color: '#0B1A1E' }], width: 'device-width', initialScale: 1 };
export default function Layout({ children }) { return <Shell lang="ar" fonts={fontVars}>{children}</Shell>; }
