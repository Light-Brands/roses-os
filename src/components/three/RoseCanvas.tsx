'use client';

import { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';
import RoseModel from './RoseModel';

interface RoseCanvasProps {
  mouseRef: React.RefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
  isDark?: boolean;
  onReady?: () => void;
}

// Adjust camera FOV + distance based on canvas aspect ratio so
// the rose is always visible — especially on portrait mobile screens.
function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height;

    if (aspect < 0.7) {
      // Narrow portrait (phones)
      cam.fov = 55;
      cam.position.z = 7;
    } else if (aspect < 1.2) {
      // Square-ish / tablets
      cam.fov = 45;
      cam.position.z = 6;
    } else {
      // Landscape / desktop
      cam.fov = 40;
      cam.position.z = 5;
    }
    cam.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}

function Scene({ mouseRef, reducedMotion, isDark }: RoseCanvasProps) {
  return (
    <>
      <ResponsiveCamera />

      {/* Soft studio environment for natural reflections */}
      <Environment preset="studio" environmentIntensity={isDark ? 0.6 : 1.0} />

      {/* Warm key light — top-right */}
      <directionalLight
        color="#FFF5E8"
        intensity={isDark ? 1.5 : 2.5}
        position={[4, 5, 6]}
        castShadow={false}
      />

      {/* Rose-tinted fill — left */}
      <directionalLight
        color="#D4B1AF"
        intensity={isDark ? 0.8 : 1.2}
        position={[-3, 2, -4]}
      />

      {/* Soft gold rim — behind */}
      <pointLight
        color="#9E956B"
        intensity={isDark ? 0.6 : 1.0}
        distance={20}
        decay={2}
        position={[0, 3, -6]}
      />

      {/* Gentle ambient */}
      <ambientLight color="#FFF8F0" intensity={isDark ? 0.15 : 0.3} />

      <RoseModel
        mouseRef={mouseRef}
        reducedMotion={reducedMotion}
        isDark={isDark}
      />
    </>
  );
}

export default function RoseCanvas({ mouseRef, reducedMotion, isDark, onReady }: RoseCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5], fov: 40 }}
      gl={{
        alpha: true,
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      style={{ background: 'transparent', width: '100%', height: '100%', display: 'block' }}
      onCreated={({ gl }) => {
        const container = gl.domElement.parentElement;
        if (container) {
          gl.setSize(container.clientWidth, container.clientHeight);
        }
        let frames = 0;
        const warmup = () => {
          frames++;
          if (frames >= 5) {
            onReady?.();
          } else {
            requestAnimationFrame(warmup);
          }
        };
        requestAnimationFrame(warmup);
      }}
    >
      <Suspense fallback={null}>
        <Scene mouseRef={mouseRef} reducedMotion={reducedMotion} isDark={isDark} />
      </Suspense>
      {/* Auto-lower pixel ratio on slower GPUs */}
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
