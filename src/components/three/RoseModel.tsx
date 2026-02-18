'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

interface RoseModelProps {
  mouseRef: React.RefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
  isDark?: boolean;
}

export default function RoseModel({ mouseRef, reducedMotion, isDark }: RoseModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const smoothMouse = useRef(new THREE.Vector2(0, 0));
  const { viewport } = useThree();

  // Load GLB with a silent manager so missing texture refs don't 404
  const gltf = useLoader(GLTFLoader, '/models/rose/rose.glb', (loader) => {
    const manager = new THREE.LoadingManager();
    manager.onError = () => {}; // silence missing texture errors
    loader.manager = manager;
  });

  // Build model once — materials & geometry only (no scaling yet)
  const { model, maxDim, centerOffset } = useMemo(() => {
    const clone = gltf.scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const mx = Math.max(size.x, size.y, size.z);

    // Override materials with bright rose color
    const petalMaterial = new THREE.MeshStandardMaterial({
      color: '#D94060',
      roughness: 0.4,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
    const leafMaterial = new THREE.MeshStandardMaterial({
      color: '#3A7D44',
      roughness: 0.5,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });
    const stemMaterial = new THREE.MeshStandardMaterial({
      color: '#2D5E34',
      roughness: 0.6,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });

    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const name = (child.name || '').toLowerCase();
        if (name.includes('petal') || name.includes('rose')) {
          child.material = petalMaterial;
        } else if (name.includes('leaf')) {
          child.material = leafMaterial;
        } else if (name.includes('stem') || name.includes('thorn')) {
          child.material = stemMaterial;
        } else {
          child.material = petalMaterial;
        }
      }
    });

    return { model: clone, maxDim: mx, centerOffset: center.clone() };
  }, [gltf.scene]);

  // Responsive scaling — adapts when viewport changes (resize / orientation)
  // Rose fills ~85% of the smaller viewport dimension so it's always visible.
  useEffect(() => {
    const vMin = Math.min(viewport.width, viewport.height);
    // Fill 96% of the smaller dimension — as large as possible without clipping
    const scale = (vMin * 0.96) / maxDim;
    model.position.set(
      -centerOffset.x * scale,
      -centerOffset.y * scale,
      -centerOffset.z * scale,
    );
    model.scale.setScalar(scale);
  }, [viewport.width, viewport.height, model, maxDim, centerOffset]);

  // Adjust brightness for theme
  useEffect(() => {
    model.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material as THREE.MeshStandardMaterial;
        mat.envMapIntensity = isDark ? 1.0 : 1.4;
        mat.needsUpdate = true;
      }
    });
  }, [isDark, model]);

  // Slow rotation + gentle mouse tilt
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Slow Y rotation (~25s per revolution)
    if (!reducedMotion) {
      groupRef.current.rotation.y += delta * 0.25;
    }

    // Gentle mouse-follow tilt
    const target = mouseRef.current;
    if (target && !reducedMotion) {
      smoothMouse.current.x += (target.x - smoothMouse.current.x) * 0.02;
      smoothMouse.current.y += (target.y - smoothMouse.current.y) * 0.02;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        smoothMouse.current.y * 0.08,
        0.03,
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        -smoothMouse.current.x * 0.04,
        0.03,
      );
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <group ref={groupRef}>
        <primitive object={model} />
      </group>
    </group>
  );
}

