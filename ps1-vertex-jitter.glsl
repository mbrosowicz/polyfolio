// ===== VERTEX SHADER - PS1 Vertex Jitter (Wobble) =====
// Simula o efeito característico de "vertex snap" do PlayStation 1
// Snapeia vértices para uma grade de pixels baseada na resolução da tela

uniform vec2 uResolution;
uniform float uGridSize;
uniform float uWobbleStrength;

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  // Calcula o tamanho da grade em espaço de mundo
  // baseado na resolução da tela
  float pixelGridSize = uGridSize / uResolution.x;

  // Snapeia a posição do vértice para a grade
  vec3 snappedPosition = floor(position / pixelGridSize) * pixelGridSize;

  // Aplica um pequeno wobble aleatório (baseado na posição original)
  // para simular o tremor do hardware PS1
  vec3 wobble = (position - snappedPosition) * uWobbleStrength;

  // Posição final
  vec3 finalPosition = snappedPosition + wobble;

  // Passa dados para o fragment shader
  vNormal = normalize(normalMatrix * normal);
  vUv = uv;
  vPosition = (modelMatrix * vec4(finalPosition, 1.0)).xyz;

  gl_Position = projectionMatrix * viewMatrix * vec4(finalPosition, 1.0);
}
