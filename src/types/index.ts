import * as THREE from 'three';

/**
 * Tipos globais para PS1 Shaders
 */

export interface PS1MaterialProps {
  geometry: THREE.BufferGeometry;
  color?: string | number;
  gridSize?: number;
  wobbleStrength?: number;
  lightDir?: [number, number, number];
}

export interface TerrainGeneratorOptions {
  width?: number;
  height?: number;
  segmentsX?: number;
  segmentsZ?: number;
  maxElevation?: number;
  minElevation?: number;
  seed?: number;
}

export interface SmoothTerrainOptions extends TerrainGeneratorOptions {
  octaves?: number;
  persistence?: number;
}

export interface PosterizationOptions {
  enabled?: boolean;
  levels?: number;
  dithering?: boolean;
  ditherStrength?: number;
}

export interface PS1TerrainCanvasProps {
  terrainWidth?: number;
  terrainHeight?: number;
  gridSize?: number;
  wobbleStrength?: number;
  smoothTerrain?: boolean;
  posterizationEnabled?: boolean;
  posterizationLevels?: number;
  dithering?: boolean;
  ditherStrength?: number;
}

export interface ShaderConfig {
  vertexShader: string;
  fragmentShader: string;
  uniforms: Record<string, THREE.IUniform>;
  side?: THREE.Side;
}

export interface PS1EffectsOptions {
  gridSize?: number;
  wobbleStrength?: number;
  posterizationLevels?: number;
  enableAnimation?: boolean;
}

export interface PS1DebugStats {
  vertexCount: number;
  triangleCount: number;
  boundingBox: {
    min: [string, string, string];
    max: [string, string, string];
  };
}
