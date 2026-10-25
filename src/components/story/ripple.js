// The tap ripple: a thin coral ring that faces the camera, grows and fades. `at` 0..1 is one ring's life.
import { RingGeometry, MeshBasicMaterial, Mesh, Color, DoubleSide } from 'three';

export function makeRipple({ color, radius = 1 }) {
  const mat = new MeshBasicMaterial({ color: new Color(color), transparent: true, opacity: 0, side: DoubleSide, depthWrite: false });
  const mesh = new Mesh(new RingGeometry(0.965, 1, 96), mat);
  mesh.renderOrder = 5;
  return {
    mesh,
    set(at, camera, strength = 1) {
      mesh.quaternion.copy(camera.quaternion);
      const live = at > 0 && at < 1;
      mesh.visible = live;
      if (!live) return;
      const e = 1 - Math.pow(1 - at, 3);
      mesh.scale.setScalar(radius * (0.25 + e * 1.6));
      mat.opacity = (1 - at) * 0.9 * strength;
    },
    recolor(hex) { mat.color.set(hex); },
  };
}
