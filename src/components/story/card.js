// The TapNConnect card: a rounded, bevelled slab whose face (paper, ink, the coral thread) is drawn on a canvas from the
// tokens (no image request). Paper in both themes so it reads against the petrol story field.
import { Shape, ExtrudeGeometry, Vector2, MeshStandardMaterial, Mesh, CanvasTexture, SRGBColorSpace, Color } from 'three';

const W = 1.6, H = W / 1.586, R = 0.09, DEPTH = 0.035;

function rounded(w, h, r) {
  const s = new Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}
// Caps get 0..1 UVs across the card so the canvas maps once; the sides get none.
const UV = {
  generateTopUV(g, v, a, b, c) { return [a, b, c].map((i) => new Vector2((v[i * 3] + W / 2) / W, (v[i * 3 + 1] + H / 2) / H)); },
  generateSideWallUV() { return [new Vector2(), new Vector2(), new Vector2(), new Vector2()]; },
};

function drawFace(canvas, { colors, name, dir, fonts }) {
  const c = canvas.getContext('2d'), w = canvas.width, h = canvas.height, rtl = dir === 'rtl';
  c.fillStyle = colors.paper; c.fillRect(0, 0, w, h);
  // the thread across the card, with its knot
  c.strokeStyle = colors.thread; c.lineWidth = 7; c.lineCap = 'round';
  c.beginPath(); c.moveTo(-10, h * 0.62); c.bezierCurveTo(w * 0.3, h * 0.42, w * 0.55, h * 0.82, w + 10, h * 0.56); c.stroke();
  c.fillStyle = colors.paper; c.beginPath(); c.arc(w * 0.5, h * 0.643, 16, 0, Math.PI * 2); c.fill(); c.stroke();
  c.fillStyle = colors.thread; c.beginPath(); c.arc(w * 0.5, h * 0.643, 6, 0, Math.PI * 2); c.fill();
  // tap mark: arcs in the corner
  const mx = rtl ? 90 : w - 90, my = 92;
  c.strokeStyle = colors.ink; c.globalAlpha = 0.85; c.lineWidth = 6;
  for (const r of [18, 34, 50]) { c.beginPath(); c.arc(mx, my, r, -Math.PI * 0.3, Math.PI * 0.3); c.stroke(); }
  c.globalAlpha = 1;
  c.fillStyle = colors.ink; c.textBaseline = 'alphabetic'; c.direction = dir; c.textAlign = rtl ? 'right' : 'left';
  const x = rtl ? w - 70 : 70;
  c.font = `700 64px ${fonts.display}`; c.fillText('TapNConnect', x, 120);
  c.font = `650 60px ${fonts.display}`; c.fillText(name, x, h - 110);
  c.globalAlpha = 0.7; c.font = `500 34px ${fonts.body}`; c.fillText('tapnconnect.ae', x, h - 60); c.globalAlpha = 1;
}

export function makeCard({ colors, name, dir, fonts }) {
  const geo = new ExtrudeGeometry(rounded(W, H, R), { depth: DEPTH, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3, curveSegments: 10, UVGenerator: UV });
  geo.center();
  const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = Math.round(1024 / 1.586);
  const tex = new CanvasTexture(canvas); tex.colorSpace = SRGBColorSpace; tex.anisotropy = 4;
  const face = new MeshStandardMaterial({ map: tex, roughness: 0.42, metalness: 0.05 });
  const edge = new MeshStandardMaterial({ color: new Color(colors.thread), roughness: 0.5 });
  const mesh = new Mesh(geo, [face, edge]);
  const paint = () => { drawFace(canvas, { colors, name, dir, fonts }); tex.needsUpdate = true; };
  paint();
  return {
    mesh,
    recolor(next) { Object.assign(colors, next); edge.color.set(colors.thread); paint(); },
    repaint: paint,
  };
}
