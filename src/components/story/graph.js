// The web: every thread between two people is one instance of a unit arc (x 0..1, lifted by LIFT at the middle), aimed and
// stretched between its two ends each frame. Per-instance `aDraw` (how much of the arc is drawn, 0..1) and `aGlow` (the
// assistant's warm pulse, 0..1) are read in the shader, so the whole web is one draw call however people move.
// Pulses are small sun-coloured beads travelling along an arc.
import {
  CatmullRomCurve3, TubeGeometry, SphereGeometry, MeshStandardMaterial, MeshBasicMaterial, InstancedMesh, InstancedBufferAttribute,
  Vector3, Matrix4, Color, DynamicDrawUsage,
} from 'three';

export const LIFT = 0.45;
const UP = new Vector3(0, 1, 0);

function unitArc(radius) {
  const pts = []; for (let i = 0; i <= 16; i++) { const x = i / 16; pts.push(new Vector3(x, Math.sin(Math.PI * x) * LIFT, 0)); }
  return new TubeGeometry(new CatmullRomCurve3(pts), 48, radius, 6);
}

/** capacity: max threads; colour: thread hex; sun: pulse hex. */
export function makeEdges({ capacity, color, sun, radius = 0.02, emissive = 0.55 }) {
  const geo = unitArc(radius);
  const draw = new InstancedBufferAttribute(new Float32Array(capacity), 1); draw.setUsage(DynamicDrawUsage);
  const glow = new InstancedBufferAttribute(new Float32Array(capacity), 1); glow.setUsage(DynamicDrawUsage);
  geo.setAttribute('aDraw', draw); geo.setAttribute('aGlow', glow);
  const mat = new MeshStandardMaterial({ color: new Color(color), emissive: new Color(color), emissiveIntensity: emissive, roughness: 0.4 });
  const uSun = { value: new Color(sun) };
  mat.onBeforeCompile = (s) => {
    s.uniforms.uSun = uSun;
    s.vertexShader = s.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aDraw; attribute float aGlow; varying float vT; varying float vDraw; varying float vGlow;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvT = position.x; vDraw = aDraw; vGlow = aGlow;');
    s.fragmentShader = s.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform vec3 uSun; varying float vT; varying float vDraw; varying float vGlow;')
      .replace('#include <clipping_planes_fragment>', 'if (vDraw < 0.001 || vT > vDraw) discard;\n#include <clipping_planes_fragment>')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance = mix(totalEmissiveRadiance, uSun * 1.4, vGlow);');
  };
  const mesh = new InstancedMesh(geo, mat, capacity);
  mesh.instanceMatrix.setUsage(DynamicDrawUsage); mesh.frustumCulled = false; mesh.count = capacity;

  const m = new Matrix4(), x = new Vector3(), y = new Vector3(), z = new Vector3();
  return {
    mesh,
    /** Aim thread i from a to b (Vector3s), drawn `d` (0..1), glowing `g` (0..1). A zero draw hides it. */
    set(i, a, b, d = 1, g = 0) {
      x.subVectors(b, a); const len = x.length() || 1e-4;
      y.copy(UP).addScaledVector(x, -UP.dot(x) / (len * len)).normalize();
      z.crossVectors(x, y).normalize();
      m.makeBasis(x, y, z); m.setPosition(a);
      mesh.setMatrixAt(i, m); draw.array[i] = d; glow.array[i] = g;
    },
    commit() { mesh.instanceMatrix.needsUpdate = true; draw.needsUpdate = true; glow.needsUpdate = true; },
    recolor(hex, sunHex) { mat.color.set(hex); mat.emissive.set(hex); if (sunHex) uSun.value.set(sunHex); },
  };
}

/** The point at t (0..1) along the arc from a to b, written into out. */
export function arcPoint(out, a, b, t) {
  return out.copy(a).lerp(b, t).addScaledVector(UP, Math.sin(Math.PI * t) * LIFT);
}

/** Sun beads that travel along threads (the assistant at work). */
export function makePulses({ capacity, sun }) {
  const mesh = new InstancedMesh(new SphereGeometry(0.075, 16, 12), new MeshBasicMaterial({ color: new Color(sun) }), capacity);
  mesh.instanceMatrix.setUsage(DynamicDrawUsage); mesh.frustumCulled = false;
  const m = new Matrix4(), p = new Vector3();
  return {
    mesh,
    /** Pulse i at t along a→b, size s (0 hides it). */
    set(i, a, b, t, s = 1) { arcPoint(p, a, b, t); m.makeScale(s, s, s).setPosition(p); mesh.setMatrixAt(i, m); },
    commit() { mesh.instanceMatrix.needsUpdate = true; },
    recolor(hex) { mesh.material.color.set(hex); },
  };
}
