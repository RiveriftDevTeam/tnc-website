// The kept thread in 3D: a coral tube along a soft arc, drawn on with progress (draw range runs along the tube's length).
import { CatmullRomCurve3, TubeGeometry, MeshStandardMaterial, Mesh, Vector3, Color } from 'three';

const SEGMENTS = 96, RADIAL = 8;

export function makeThread({ color }) {
  const mat = new MeshStandardMaterial({ color: new Color(color), emissive: new Color(color), emissiveIntensity: 0.55, roughness: 0.4 });
  const mesh = new Mesh(new TubeGeometry(new CatmullRomCurve3([new Vector3(), new Vector3(0, 0.1, 0)]), 2, 0.02, RADIAL), mat);
  mesh.visible = false; mesh.frustumCulled = false;
  return {
    mesh,
    /** Rebuild between two points with a lift in the middle (the line sags up like a held string). */
    span(a, b, lift = 0.55) {
      const mid = a.clone().lerp(b, 0.5); mid.y += lift;
      mesh.geometry.dispose();
      mesh.geometry = new TubeGeometry(new CatmullRomCurve3([a, a.clone().lerp(mid, 0.5).setY(a.y + lift * 0.7), mid, b.clone().lerp(mid, 0.5).setY(b.y + lift * 0.7), b]), SEGMENTS, 0.022, RADIAL);
    },
    /** draw 0..1 along the length; glow 0..1 lifts the emissive (the pulse). */
    set(draw, glow = 0) {
      const total = mesh.geometry.index.count, n = Math.floor((total / 6) * draw) * 6;
      mesh.geometry.setDrawRange(0, n); mesh.visible = n > 0; mat.emissiveIntensity = 0.55 + glow * 0.9;
    },
    recolor(hex) { mat.color.set(hex); mat.emissive.set(hex); },
  };
}
