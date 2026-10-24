import NotFound from '@/screens/NotFound';
/** Rendered at /404/ and copied to out/404.html after the build (scripts/postbuild.mjs): the one 404 of the static site,
 *  in both languages, inside the normal shell. Next cannot give two root layouts a shared not-found page itself. */
export const metadata = { title: 'Page not found · الصفحة غير موجودة — TapNConnect', robots: { index: false, follow: false } };
export default function Page() { return <NotFound />; }
