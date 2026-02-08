'use client';

import { useRef, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

interface ShaderSphereProps {
  mouseRef: React.RefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
}

export default function ShaderSphere({ mouseRef, reducedMotion }: ShaderSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const noise3D = useMemo(() => createNoise3D(), []);
  const originalPositions = useRef<Float32Array | null>(null);
  const smoothMouse = useRef(new THREE.Vector2(0, 0));

  // Pre-allocate vector to avoid GC pressure
  const _vec = useMemo(() => new THREE.Vector3(), []);

  // fBm — 3 octaves of simplex noise
  const fbm = useCallback((x: number, y: number, z: number, t: number): number => {
    let sum = 0;
    let amp = 1;
    let freq = 1;
    for (let i = 0; i < 3; i++) {
      sum += amp * noise3D(x * freq + t, y * freq + t * 0.7, z * freq + t * 0.3);
      amp *= 0.45;
      freq *= 2;
    }
    return sum;
  }, [noise3D]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const geometry = mesh.geometry;
    const positions = geometry.attributes.position;

    // Lazily capture original positions on first frame
    if (!originalPositions.current) {
      originalPositions.current = new Float32Array(positions.array);
    }

    const orig = originalPositions.current;
    const arr = positions.array as Float32Array;
    const time = state.clock.elapsedTime * (reducedMotion ? 0.02 : 0.15);

    // Smooth mouse follow
    const target = mouseRef.current;
    if (target) {
      smoothMouse.current.x += (target.x - smoothMouse.current.x) * 0.05;
      smoothMouse.current.y += (target.y - smoothMouse.current.y) * 0.05;
    }
    const mx = smoothMouse.current.x;
    const my = smoothMouse.current.y;
    const mouseLen = Math.sqrt(mx * mx + my * my);

    for (let i = 0; i < positions.count; i++) {
      const ix = i * 3;
      const iy = ix + 1;
      const iz = ix + 2;

      // Get original position and normalize to get direction
      _vec.set(orig[ix], orig[iy], orig[iz]);
      const len = _vec.length();
      if (len === 0) continue;
      _vec.normalize();

      const px = _vec.x;
      const py = _vec.y;
      const pz = _vec.z;

      // Symmetric noise layer 1 — large-scale undulation
      const p1x = px * 0.5 + time * 0.12;
      const p1y = py * 0.5;
      const p1z = pz * 0.5;
      const n1a = fbm(p1x, p1y, p1z, time * 0.08);
      const n1b = fbm(-p1x, p1y, p1z, time * 0.08);
      const n1 = (n1a + n1b) * 0.5;

      // Symmetric noise layer 2 — finer organic detail
      const p2x = px * 0.35 + time * -0.06;
      const p2y = py * 0.35 + time * 0.08;
      const p2z = pz * 0.35;
      const n2a = fbm(p2x, p2y, p2z, time * 0.04) * 0.4;
      const n2b = fbm(-p2x, p2y, p2z, time * 0.04) * 0.4;
      const n2 = (n2a + n2b) * 0.5;

      let displacement = (n1 + n2) * 0.24;

      // Mouse interaction (symmetric)
      const dxL = px - mx;
      const dyL = py - my;
      const mouseDistL = Math.sqrt(dxL * dxL + dyL * dyL);
      const dxR = -px - mx;
      const mouseDistR = Math.sqrt(dxR * dxR + dyL * dyL);
      const smoothL = mouseDistL < 2.0 ? (1.0 - mouseDistL / 2.0) : 0;
      const smoothR = mouseDistR < 2.0 ? (1.0 - mouseDistR / 2.0) : 0;
      const mouseEffect = (smoothL * smoothL * smoothL + smoothR * smoothR * smoothR) * 0.5 * mouseLen;
      displacement += mouseEffect * 0.05;

      const scale = len * (1 + displacement);
      arr[ix] = px * scale;
      arr[iy] = py * scale;
      arr[iz] = pz * scale;
    }

    // Re-center: compute center of mass and shift so visual mass stays at origin
    let cx = 0, cy = 0, cz = 0;
    for (let i = 0; i < positions.count; i++) {
      cx += arr[i * 3];
      cy += arr[i * 3 + 1];
      cz += arr[i * 3 + 2];
    }
    cx /= positions.count;
    cy /= positions.count;
    cz /= positions.count;
    for (let i = 0; i < positions.count; i++) {
      arr[i * 3] -= cx;
      arr[i * 3 + 1] -= cy;
      arr[i * 3 + 2] -= cz;
    }

    positions.needsUpdate = true;
    geometry.computeVertexNormals();

    // Very gentle rotation
    mesh.rotation.y += 0.0004;
    mesh.rotation.z += 0.002;
    mesh.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.025;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1.3, 128, 128]} />
      <meshPhysicalMaterial
        color="#b8a0d8"
        roughness={0.0}
        metalness={0.0}
        clearcoat={1.0}
        clearcoatRoughness={0.0}
        iridescence={1.0}
        iridescenceIOR={1.3}
        iridescenceThicknessRange={[100, 800] as [number, number]}
        transmission={0.75}
        thickness={0.5}
        ior={1.4}
        envMapIntensity={2.5}
        specularIntensity={1.0}
        specularColor={"#9B8FD9" as unknown as THREE.Color}
        attenuationColor={"#9B8FD9" as unknown as THREE.Color}
        attenuationDistance={1.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
