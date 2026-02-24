// ===== FRAGMENT SHADER - PS1 Flat Color =====
// Simples e direto, compatível com a estética PS1
// Usa iluminação Lambertiana básica

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;

uniform vec3 uColor;
uniform vec3 uLightDir;

void main() {
  // Normaliza a normal do vértice
  vec3 normal = normalize(vNormal);

  // Direção da luz
  vec3 lightDir = normalize(uLightDir);

  // Iluminação Lambertiana simples
  float diffuse = max(dot(normal, lightDir), 0.2); // 0.2 é a luz ambiente

  // Cor final com iluminação
  vec3 finalColor = uColor * diffuse;

  gl_FragColor = vec4(finalColor, 1.0);
}
