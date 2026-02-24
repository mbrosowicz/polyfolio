import { describe, it, expect } from 'vitest';
import { generateProceduralTerrain, generateSmootherTerrain } from './terrainGenerator';
import * as THREE from 'three';

describe('Terrain Generator', () => {
  describe('generateProceduralTerrain', () => {
    it('should create valid geometry', () => {
      const geometry = generateProceduralTerrain();

      expect(geometry).toBeDefined();
      expect(geometry).toBeInstanceOf(THREE.BufferGeometry);
    });

    it('should respect size options', () => {
      const geometry = generateProceduralTerrain({
        width: 200,
        height: 200,
        segmentsX: 64,
        segmentsZ: 64,
      });

      const positions = geometry.attributes.position.array as Float32Array;
      expect(positions.length).toBeGreaterThan(0);
    });

    it('should generate elevations within limits', () => {
      const maxElevation = 30;
      const geometry = generateProceduralTerrain({
        maxElevation,
        minElevation: 0,
      });

      const positions = geometry.attributes.position.array as Float32Array;

      for (let i = 1; i < positions.length; i += 3) {
        const y = positions[i];
        expect(y).toBeGreaterThanOrEqual(0);
        expect(y).toBeLessThanOrEqual(maxElevation);
      }
    });

    it('should be reproducible with seed', () => {
      const geometry1 = generateProceduralTerrain({ seed: 42 });
      const geometry2 = generateProceduralTerrain({ seed: 42 });

      const positions1 = geometry1.attributes.position.array as Float32Array;
      const positions2 = geometry2.attributes.position.array as Float32Array;

      for (let i = 0; i < positions1.length; i++) {
        expect(positions1[i]).toBeCloseTo(positions2[i], 5);
      }
    });

    it('should compute normals', () => {
      const geometry = generateProceduralTerrain();
      expect(geometry.attributes.normal).toBeDefined();
    });

    it('should compute bounding box', () => {
      const geometry = generateProceduralTerrain({
        width: 100,
        height: 100,
      });

      expect(geometry.boundingBox).toBeDefined();
      expect(geometry.boundingBox?.min).toBeDefined();
      expect(geometry.boundingBox?.max).toBeDefined();
    });
  });

  describe('generateSmootherTerrain', () => {
    it('should generate terrain with multiple octaves', () => {
      const geometry = generateSmootherTerrain({
        octaves: 4,
        persistence: 0.6,
      });

      expect(geometry).toBeInstanceOf(THREE.BufferGeometry);
    });
  });
});
