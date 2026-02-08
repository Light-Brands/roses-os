import { simplexNoise3D } from './noise';

export const vertexShader = /* glsl */ `
${simplexNoise3D}

uniform float uTime;
uniform vec2 uMouse;
uniform float uReducedMotion;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

// fBm — 3 octaves, smooth organic distortion
float fbm(vec3 p, float t) {
  float sum = 0.0;
  float amplitude = 1.0;
  float frequency = 1.0;

  for (int i = 0; i < 3; i++) {
    sum += amplitude * snoise(p * frequency + t);
    amplitude *= 0.45;
    frequency *= 2.0;
  }

  return sum;
}

void main() {
  vUv = uv;

  vec3 pos = position;

  float time = uTime * mix(0.2, 0.0, uReducedMotion);

  // Symmetric noise (mirror X so blob stays visually centered)
  vec3 p = pos * 0.6 + vec3(time * 0.15, 0.0, 0.0);
  float noise1a = fbm(p, time * 0.1);
  float noise1b = fbm(vec3(-p.x, p.y, p.z), time * 0.1);
  float noise1 = (noise1a + noise1b) * 0.5;

  vec3 p2 = pos * 0.4 + vec3(time * -0.08, time * 0.1, 0.0);
  float noise2a = fbm(p2, time * 0.05) * 0.4;
  float noise2b = fbm(vec3(-p2.x, p2.y, p2.z), time * 0.05) * 0.4;
  float noise2 = (noise2a + noise2b) * 0.5;

  // Combined displacement — gentle, symmetric so mass stays centered
  float displacement = (noise1 + noise2) * 0.18;

  // Mouse: symmetric pull so blob doesn't shift off-center (subtle, balanced)
  float mouseDistL = length(pos.xy - uMouse);
  float mouseDistR = length(vec2(-pos.x, pos.y) - uMouse);
  float mouseEffect = (smoothstep(2.0, 0.0, mouseDistL) + smoothstep(2.0, 0.0, mouseDistR)) * 0.5 * length(uMouse);
  displacement += mouseEffect * 0.04;

  // Apply displacement along normal only
  pos += normal * displacement;

  vPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
  vNormal = normalize(normalMatrix * normal);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;
