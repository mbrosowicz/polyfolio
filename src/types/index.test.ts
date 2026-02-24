import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import type {
  PS1MaterialProps,
  TerrainGeneratorOptions,
  SmoothTerrainOptions,
  PosterizationOptions,
  PS1DebugStats,
} from './index';

describe('Type Definitions', () => {
  describe('PS1MaterialProps', () => {
    it('should allow valid material props', () => {
      const props: PS1MaterialProps = {
        geometry: new THREE.BufferGeometry(),
        color: '#ff00ff',
        gridSize: 8,
        wobbleStrength: 0.5,
        lightDir: [1, 1, 0.5],
      };

      expect(props.gridSize).toBe(8);
      expect(props.wobbleStrength).toBe(0.5);
    });

    it('should have optional properties', () => {
      const props: PS1MaterialProps = {
        geometry: new THREE.BufferGeometry(),
      };

      expect(props.geometry).toBeDefined();
      expect(props.color).toBeUndefined();
    });
  });

  describe('TerrainGeneratorOptions', () => {
    it('should allow terrain options', () => {
      const options: TerrainGeneratorOptions = {
        width: 200,
        height: 200,
        segmentsX: 64,
        segmentsZ: 64,
        maxElevation: 30,
      };

      expect(options.width).toBe(200);
      expect(options.maxElevation).toBe(30);
    });
  });

  describe('SmoothTerrainOptions', () => {
    it('should extend TerrainGeneratorOptions with smoothing properties', () => {
      const options: SmoothTerrainOptions = {
        width: 200,
        octaves: 4,
        persistence: 0.5,
      };

      expect(options.octaves).toBe(4);
      expect(options.persistence).toBe(0.5);
    });
  });

  describe('PosterizationOptions', () => {
    it('should allow posterization options', () => {
      const options: PosterizationOptions = {
        enabled: true,
        levels: 8,
        dithering: true,
        ditherStrength: 0.5,
      };

      expect(options.levels).toBe(8);
      expect(options.dithering).toBe(true);
    });
  });

  describe('PS1DebugStats', () => {
    it('should have vertex and triangle count', () => {
      const stats: PS1DebugStats = {
        vertexCount: 1024,
        triangleCount: 512,
        boundingBox: {
          min: ['0', '0', '0'],
          max: ['100', '100', '100'],
        },
      };

      expect(stats.vertexCount).toBe(1024);
      expect(stats.triangleCount).toBe(512);
    });
  });
});
