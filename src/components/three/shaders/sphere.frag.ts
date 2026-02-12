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

  // Rose/Earth palette
  vec3 roseDeep  = vec3(0.43, 0.29, 0.29);   // Deep Earth #6E4A49
  vec3 roseMid   = vec3(0.61, 0.44, 0.43);    // Rose Clay #9C6F6E
  vec3 roseLight = vec3(0.91, 0.77, 0.75);    // Rose 300 #E8C4BF
  vec3 goldWarm  = vec3(0.62, 0.58, 0.42);    // Antique Olive Brass #9E956B

  // Caustic-like interior — directional streaks
  float animTime = uTime * mix(0.12, 0.0, uReducedMotion);
  vec3 rayDir = normalize(vPosition + vec3(0.0, 1.0, 0.5));
  float interior = snoise(rayDir * 2.0 + vPosition * 1.2 + animTime) * 0.5 + 0.5;
  float interior2 = snoise(vPosition * 2.5 + vec3(animTime * 0.3, animTime * -0.2, 0.0)) * 0.5 + 0.5;
  float waterPattern = mix(interior, interior2, 0.5);

  // Base: deep in core, lighter toward surface
  vec3 baseColor = mix(roseDeep, roseMid, waterPattern * 0.5);

  // Fresnel: glassy rim with rose visible
  baseColor = mix(baseColor, roseLight, fresnel * 0.7);
  baseColor = mix(baseColor, goldWarm, fresnel * fresnel * 0.3);

  // Primary specular — sharp warm highlight
  vec3 lightDir = normalize(vec3(3.0, 5.0, 4.0) - vPosition);
  vec3 halfDir = normalize(lightDir + viewDir);
  float spec = pow(max(0.0, dot(normal, halfDir)), 120.0);
  baseColor += goldWarm * spec * 0.7;

  // Soft secondary highlight (broader, warm)
  vec3 lightDir2 = normalize(vec3(-2.0, 3.0, 5.0) - vPosition);
  vec3 halfDir2 = normalize(lightDir2 + viewDir);
  float spec2 = pow(max(0.0, dot(normal, halfDir2)), 40.0);
  baseColor += roseLight * spec2 * 0.35;

  // Transparency: clearer in center, more opaque at rim
  float alpha = 0.35 + fresnel * 0.55 + waterPattern * 0.08;

  gl_FragColor = vec4(baseColor, alpha);
}
`;
