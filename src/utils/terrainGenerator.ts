import * as THREE from 'three';
import type { TerrainGeneratorOptions, SmoothTerrainOptions } from '@/types/index';

/**
 * Simples pseudo-random generator com seed
 */
const mulberry32 = (seed: number) => {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/**
 * Gera terreno procedural com elevações aleatórias
 */
export function generateProceduralTerrain(
  options: TerrainGeneratorOptions = {}
): THREE.BufferGeometry {
  const {
    width = 100,
    height = 100,
    segmentsX = 32,
    segmentsZ = 32,
    maxElevation = 20,
    minElevation = 0,
    seed = 0,
  } = options;

  const rng = mulberry32(seed);
  const geometry = new THREE.PlaneGeometry(width, height, segmentsX, segmentsZ);

  const positions = geometry.attributes.position.array as Float32Array;

  // Altera elevação Y de cada vértice
  for (let i = 0; i < positions.length; i += 3) {
    const noise = rng() * 0.33 + rng() * 0.33 + rng() * 0.34;
    const elevation = minElevation + noise * (maxElevation - minElevation);
    positions[i + 1] = elevation;
  }

  geometry.attributes.position.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();

  return geometry;
}

/**
 * Gera terreno com Perlin-like noise mais suave
 */
export function generateSmootherTerrain(options: SmoothTerrainOptions = {}): THREE.BufferGeometry {
  const {
    width = 100,
    height = 100,
    segmentsX = 32,
    segmentsZ = 32,
    maxElevation = 20,
    minElevation = 0,
    seed = 0,
    octaves = 4,
    persistence = 0.5,
  } = options;

  const rng = mulberry32(seed);
  const geometry = new THREE.PlaneGeometry(width, height, segmentsX, segmentsZ);

  const positions = geometry.attributes.position.array as Float32Array;

  // Combina múltiplas oitavas de ruído
  for (let i = 0; i < positions.length; i += 3) {
    let noiseValue = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxValue = 0;

    for (let o = 0; o < octaves; o++) {
      const detail = rng() * frequency;
      noiseValue += detail * amplitude;
      maxValue += amplitude;

      amplitude *= persistence;
      frequency *= 2;
    }

    noiseValue /= maxValue;
    const elevation = minElevation + noiseValue * (maxElevation - minElevation);
    positions[i + 1] = elevation;
  }

  geometry.attributes.position.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();

  return geometry;
}

/**
 * Gera terreno com cores baseadas em altura
 */
export function generateColoredProceduralTerrain(
  options: TerrainGeneratorOptions = {}
): THREE.BufferGeometry {
  const {
    width = 100,
    height = 100,
    segmentsX = 32,
    segmentsZ = 32,
    maxElevation = 20,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // seed = 0,
  } = options;

  const geometry = new THREE.PlaneGeometry(width, height, segmentsX, segmentsZ);

  const positions = geometry.attributes.position.array as Float32Array;
  const colors: number[] = [];

  const getColorForHeight = (height: number): THREE.Color => {
    if (height < maxElevation * 0.3) {
      return new THREE.Color(0x00ff00); // Verde
    } else if (height < maxElevation * 0.6) {
      return new THREE.Color(0x8b6f47); // Marrom
    } else if (height < maxElevation * 0.9) {
      return new THREE.Color(0xcccccc); // Cinza
    } else {
      return new THREE.Color(0xffffff); // Branco
    }
  };

  for (let i = 0; i < positions.length; i += 3) {
    const elevation = Math.random() * maxElevation;
    positions[i + 1] = elevation;

    const color = getColorForHeight(elevation);
    colors.push(color.r, color.g, color.b);
  }

  geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
  geometry.attributes.position.needsUpdate = true;
  geometry.computeVertexNormals();

  return geometry;
}
