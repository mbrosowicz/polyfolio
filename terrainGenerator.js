import * as THREE from 'three';

/**
 * Gera uma geometria de terreno low-poly procedural com elevações aleatórias
 *
 * @param {Object} options - Opções de configuração
 * @param {number} options.width - Largura do terreno em unidades (padrão: 100)
 * @param {number} options.height - Altura do terreno em unidades (padrão: 100)
 * @param {number} options.segmentsX - Número de segmentos no eixo X (padrão: 32)
 * @param {number} options.segmentsZ - Número de segmentos no eixo Z (padrão: 32)
 * @param {number} options.maxElevation - Elevação máxima aleatória (padrão: 20)
 * @param {number} options.minElevation - Elevação mínima (padrão: 0)
 * @param {number} options.seed - Seed para geração procedural (padrão: 0)
 * @returns {THREE.BufferGeometry} Geometria do terreno
 *
 * @example
 * const terrain = generateProceduralTerrain({
 *   width: 200,
 *   height: 200,
 *   segmentsX: 64,
 *   segmentsZ: 64,
 *   maxElevation: 30,
 *   seed: 42
 * });
 */
export function generateProceduralTerrain(options = {}) {
  const {
    width = 100,
    height = 100,
    segmentsX = 32,
    segmentsZ = 32,
    maxElevation = 20,
    minElevation = 0,
    seed = 0,
  } = options;

  // Simples pseudo-random generator baseado em seed
  // Garante reprodutibilidade com seed fixo
  const mulberry32 = (a) => {
    return () => {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  const rng = mulberry32(seed);

  // Cria a geometria base
  const geometry = new THREE.PlaneGeometry(width, height, segmentsX, segmentsZ);

  // Obtém o array de posições
  const positions = geometry.attributes.position.array;

  // Altera a elevação Y de cada vértice
  for (let i = 0; i < positions.length; i += 3) {
    // i é X, i+1 é Y, i+2 é Z
    // Gera 3 valores aleatórios para suavizar a elevação usando Perlin-like noise
    const noise = rng() * 0.33 + rng() * 0.33 + rng() * 0.34;
    const elevation = minElevation + noise * (maxElevation - minElevation);

    positions[i + 1] = elevation;
  }

  // Atualiza o atributo de posição
  geometry.attributes.position.needsUpdate = true;

  // Recalcula as normais para iluminação correta
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();

  return geometry;
}

/**
 * Gera terreno com Perlin noise mais suave (requer biblioteca de noise)
 * Versão simplificada usando múltiplas oitavas aleatórias
 *
 * @param {Object} options - Opções iguais a generateProceduralTerrain
 * @returns {THREE.BufferGeometry} Geometria com elevações mais suaves
 */
export function generateSmootherTerrain(options = {}) {
  const {
    width = 100,
    height = 100,
    segmentsX = 32,
    segmentsZ = 32,
    maxElevation = 20,
    minElevation = 0,
    seed = 0,
    octaves = 4, // Número de oitavas de ruído
    persistence = 0.5, // Quanto cada oitava contribui
  } = options;

  const mulberry32 = (a) => {
    return () => {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  const rng = mulberry32(seed);

  // Cria a geometria base
  const geometry = new THREE.PlaneGeometry(width, height, segmentsX, segmentsZ);

  const positions = geometry.attributes.position.array;

  // Gera valores de ruído para toda a grade
  const noiseMap = new Map();

  for (let i = 0; i < positions.length; i += 3) {
    let noiseValue = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxValue = 0;

    // Combina múltiplas oitavas de ruído
    for (let o = 0; o < octaves; o++) {
      const detail = rng() * frequency;
      noiseValue += detail * amplitude;
      maxValue += amplitude;

      amplitude *= persistence;
      frequency *= 2;
    }

    noiseValue /= maxValue;

    // Normaliza para [0, 1]
    const elevation = minElevation + noiseValue * (maxElevation - minElevation);
    positions[i + 1] = elevation;
  }

  geometry.attributes.position.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();

  return geometry;
}

/**
 * Cria colisões baseadas em malha de terreno
 * Útil para physics
 */
export function getTerrainHeightAtPoint(geometry, x, z, width, height) {
  // Normaliza coordenadas em [0, 1]
  const normalizedX = (x + width / 2) / width;
  const normalizedZ = (z + height / 2) / height;

  // Encontra os vértices mais próximos
  const positions = geometry.attributes.position.array;

  // Interpolação bilinear (simplificada)
  // Em produção, você poderia usar raycasting ou altura armazenada em texturas
  return 0; // Placeholder
}

export default {
  generateProceduralTerrain,
  generateSmootherTerrain,
  getTerrainHeightAtPoint,
};
