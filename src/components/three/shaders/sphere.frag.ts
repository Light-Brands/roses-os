import { simplexNoise3D } from './noise';

export const fragmentShader = /* glsl */ `
${simplexNoise3D}

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

uniform float uTime;
uniform float uReducedMotion;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(cameraPosition - vPosition);

  // Stronger fresnel — water-like glassy rim, clear transition
  float NdotV = max(0.0, dot(viewDir, normal));
  float fresnel = pow(1.0 - NdotV, 3.2);

  // Indigo palette: #8B7FD8 and #9B8FD9 (exact hex → RGB 0–1)
  vec3 waterDeep  = vec3(0.33, 0.30, 0.51);   // darker #8B7FD8 for core
  vec3 waterMid   = vec3(0.545, 0.498, 0.847); // #8B7FD8
  vec3 waterLight = vec3(0.608, 0.561, 0.851); // #9B8FD9
  vec3 white = vec3(1.0);

  // Caustic-like interior — directional streaks (water light rays)
  float animTime = uTime * mix(0.12, 0.0, uReducedMotion);
  vec3 rayDir = normalize(vPosition + vec3(0.0, 1.0, 0.5));
  float interior = snoise(rayDir * 2.0 + vPosition * 1.2 + animTime) * 0.5 + 0.5;
  float interior2 = snoise(vPosition * 2.5 + vec3(animTime * 0.3, animTime * -0.2, 0.0)) * 0.5 + 0.5;
  float waterPattern = mix(interior, interior2, 0.5);

  // Base: deep in core (#8B7FD8 family), lighter toward surface (#9B8FD9)
  vec3 baseColor = mix(waterDeep, waterMid, waterPattern * 0.5);

  // Fresnel: glassy rim but keep indigo visible (less white wash)
  baseColor = mix(baseColor, waterLight, fresnel * 0.7);
  baseColor = mix(baseColor, white, fresnel * fresnel * 0.4);

  // Primary specular — sharp water highlight
  vec3 lightDir = normalize(vec3(3.0, 5.0, 4.0) - vPosition);
  vec3 halfDir = normalize(lightDir + viewDir);
  float spec = pow(max(0.0, dot(normal, halfDir)), 120.0);
  baseColor += white * spec * 0.7;

  // Soft secondary highlight (broader, water-like)
  vec3 lightDir2 = normalize(vec3(-2.0, 3.0, 5.0) - vPosition);
  vec3 halfDir2 = normalize(lightDir2 + viewDir);
  float spec2 = pow(max(0.0, dot(normal, halfDir2)), 40.0);
  baseColor += waterLight * spec2 * 0.35;

  // Transparency: clearer in center (looking through water), more opaque at rim
  float alpha = 0.35 + fresnel * 0.55 + waterPattern * 0.08;

  gl_FragColor = vec4(baseColor, alpha);
}
`;
