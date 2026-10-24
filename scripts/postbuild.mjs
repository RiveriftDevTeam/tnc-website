// out/404/index.html -> out/404.html (Netlify and most static hosts serve 404.html for a miss).
import fs from 'node:fs';
fs.copyFileSync('out/404/index.html', 'out/404.html');
fs.writeFileSync('out/.nojekyll', ''); // GitHub Pages: serve the _next folder as is
console.log('out/404.html <- /404/ · .nojekyll');
