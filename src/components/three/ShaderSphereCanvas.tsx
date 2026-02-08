'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import ShaderSphere from './ShaderSphere';

interface ShaderSphereCanvasProps {
  mouseRef: React.RefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
  onReady?: () => void;
}

function Scene({ mouseRef, reducedMotion }: ShaderSphereCanvasProps) {
  return (
    <>
      {/* Rich HDR environment for iridescent reflections */}
      <Environment preset="studio" environmentIntensity={1.8} />

      {/* White key light */}
      <pointLight
        color="#ffffff"
        intensity={3}
        distance={30}
        decay={2}
        position={[5, 3, 8]}
      />
      {/* Purple fill — preserves original palette */}
      <pointLight
        color="#b8a0d0"
        intensity={2.5}
        distance={40}
        decay={2}
        position={[-4, -2, -6]}
      />
      {/* Cool rim light */}
      <pointLight
        color="#e0e0ff"
        intensity={2}
        distance={25}
        decay={2}
        position={[0, 4, -8]}
      />
      <ambientLight color="#ffffff" intensity={0.15} />

      <ShaderSphere
        mouseRef={mouseRef}
        reducedMotion={reducedMotion}
      />
    </>
  );
}

export default function ShaderSphereCanvas({ mouseRef, reducedMotion, onReady }: ShaderSphereCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4.5], fov: 45 }}
      gl={{
        alpha: true,
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.4,
      }}
      style={{ background: 'transparent', width: '100%', height: '100%', display: 'block' }}
      onCreated={({ gl }) => {
        // Force R3F to read correct container dimensions immediately
        const container = gl.domElement.parentElement;
        if (container) {
          gl.setSize(container.clientWidth, container.clientHeight);
        }
        // Give the GPU a few frames to compile shaders and warm up
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
        <Scene mouseRef={mouseRef} reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  );
}
