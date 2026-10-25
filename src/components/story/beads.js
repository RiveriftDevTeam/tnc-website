// Clay people: a capsule body and a round head, faceless, matte, softly rim-lit. Instanced, so the crowd is two draw calls
// (+1 for the contact shadows). Index 0 is "you" (coral), index 1 is Omar (mint); the rest is the hall.
import {
  CapsuleGeometry, SphereGeometry, PlaneGeometry, MeshStandardMaterial, MeshBasicMaterial, InstancedMesh, Object3D, Color,
  CanvasTexture, DynamicDrawUsage,
} from 'three';

export const BODY_Y = 0.34, HEAD_Y = 0.82;

function rim(material) {
  material.onBeforeCompile = (s) => {
    s.fragmentShader = s.fragmentShader.replace('#include <dithering_fragment>',
      'float rimF = pow(1.0 - max(dot(normalize(vNormal), normalize(vViewPosition)), 0.0), 2.4);\n gl_FragColor.rgb += rimF * 0.28;\n#include <dithering_fragment>');
  };
  return material;
}
function shadowTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
  const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(0,0,0,.55)'); r.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = r; g.fillRect(0, 0, 64, 64); return new CanvasTexture(c);
}
const seeded = (n) => { let s = 9871 + n; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; };

/** count: crowd size including you and Omar. palette: clay hexes; you/omar: hexes. rimLight: off on phones. */
export function makeBeads({ count, palette, you, omar, rimLight = true }) {
  const bodyMat = new MeshStandardMaterial({ roughness: 0.85, metalness: 0 });
  const headMat = new MeshStandardMaterial({ roughness: 0.85, metalness: 0 });
  if (rimLight) { rim(bodyMat); rim(headMat); }
  const bodies = new InstancedMesh(new CapsuleGeometry(0.2, 0.28, 4, 14), bodyMat, count);
  const heads = new InstancedMesh(new SphereGeometry(0.15, 18, 12), headMat, count);
  const shadows = new InstancedMesh(new PlaneGeometry(0.9, 0.9), new MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false }), count);
  for (const m of [bodies, heads, shadows]) { m.instanceMatrix.setUsage(DynamicDrawUsage); m.frustumCulled = false; }

  // the hall: a loose crowd in front of and around the pair, never on top of them
  const rnd = seeded(count), home = [], phase = [], color = [];
  home.push([-1.6, 1.2], [2.1, 0.7]);
  while (home.length < count) {
    const x = (rnd() - 0.5) * 10, z = -5 + rnd() * 6.2;
    if (Math.abs(x) < 2.6 && z > -0.2) continue;
    if (home.some(([hx, hz]) => (hx - x) ** 2 + (hz - z) ** 2 < 0.36)) continue;
    home.push([x, z]);
  }
  for (let i = 0; i < count; i++) { phase.push(rnd() * Math.PI * 2); color.push(new Color(i === 0 ? you : i === 1 ? omar : palette[Math.floor(rnd() * palette.length)])); }
  const paint = (faded = 0, fadeColor = '#A39C93') => {
    const f = new Color(fadeColor), c = new Color();
    for (let i = 0; i < count; i++) { c.copy(color[i]); if (i > 1) c.lerp(f, faded); bodies.setColorAt(i, c); heads.setColorAt(i, c); }
    bodies.instanceColor.needsUpdate = true; heads.instanceColor.needsUpdate = true;
  };
  paint();

  const o = new Object3D();
  /** Place bead i at (x, z) with a rise (0 = below ground, 1 = standing), uniform scale, and a squash (y). */
  function place(i, x, z, { rise = 1, scale = 1, squash = 1, lean = 0 } = {}) {
    const y = (1 - rise) * -1.6, s = Math.max(0.0001, scale * Math.min(1, rise * 1.4));
    o.position.set(x, BODY_Y * squash * s + y, z); o.scale.set(s, s * squash, s); o.rotation.set(0, 0, lean); o.updateMatrix(); bodies.setMatrixAt(i, o.matrix);
    o.position.set(x + Math.sin(-lean) * HEAD_Y * s * 0.6, HEAD_Y * squash * s + y, z); o.scale.setScalar(s); o.updateMatrix(); heads.setMatrixAt(i, o.matrix);
    o.position.set(x, 0.005, z); o.rotation.set(-Math.PI / 2, 0, 0); o.scale.setScalar(s * Math.min(1, rise)); o.updateMatrix(); shadows.setMatrixAt(i, o.matrix);
  }
  function commit() { bodies.instanceMatrix.needsUpdate = true; heads.instanceMatrix.needsUpdate = true; shadows.instanceMatrix.needsUpdate = true; }

  return {
    meshes: [shadows, bodies, heads], home, phase, place, commit,
    recolor(next) { if (next.palette) for (let i = 2; i < count; i++) color[i].set(next.palette[i % next.palette.length]); if (next.you) color[0].set(next.you); if (next.omar) color[1].set(next.omar); paint(); },
    fade: paint,
    /** Repaint every person: fn(i, base Color, out Color) writes the colour to show. Cheap enough per frame. */
    paintWith(fn) {
      const c = new Color();
      for (let i = 0; i < count; i++) { fn(i, color[i], c.copy(color[i])); bodies.setColorAt(i, c); heads.setColorAt(i, c); }
      bodies.instanceColor.needsUpdate = true; heads.instanceColor.needsUpdate = true;
    },
  };
}
