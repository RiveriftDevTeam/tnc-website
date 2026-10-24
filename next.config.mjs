/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''; // '/tnc-website' on GitHub Pages, '' on a domain
const nextConfig = {
  output: 'export',
  basePath,            // pure static HTML on the CDN — nothing runs on a server
  trailingSlash: true,         // /pricing/ -> out/pricing/index.html on every static host
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: { optimizePackageImports: ['lucide-react', 'framer-motion'] },
};
export default nextConfig;
