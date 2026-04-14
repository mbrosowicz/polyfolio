import { describe, it, expect } from 'vitest';
import {
  generateProceduralTerrain,
  generateSmootherTerrain,
  generateColoredProceduralTerrain,
} from './terrainGenerator';
import * as THREE from 'three';

describe('terrainGenerator', () => {
  describe('generateProceduralTerrain', () => {
    it('returns a BufferGeometry instance', () => {
      const geometry = generateProceduralTerrain();
      expect(geometry).toBeInstanceOf(THREE.BufferGeometry);
    });

    it('has position attribute', () => {
      const geometry = generateProceduralTerrain();
      expect(geometry.attributes.position).toBeDefined();
      expect(geometry.attributes.position.array.length).toBeGreaterThan(0);
    });

    it('has normal attribute after generation', () => {
      const geometry = generateProceduralTerrain();
      expect(geometry.attributes.normal).toBeDefined();
    });

    it('computes bounding box', () => {
      const geometry = generateProceduralTerrain();
      expect(geometry.boundingBox).not.toBeNull();
      expect(geometry.boundingBox?.min).toBeDefined();
      expect(geometry.boundingBox?.max).toBeDefined();
    });

    it('respects segmentsX and segmentsZ options', () => {
      const geo16 = generateProceduralTerrain({ segmentsX: 16, segmentsZ: 16 });
      const geo32 = generateProceduralTerrain({ segmentsX: 32, segmentsZ: 32 });
      const pos16 = geo16.attributes.position.array;
      const pos32 = geo32.attributes.position.array;
      // More segments = more vertices
      expect(pos32.length).toBeGreaterThan(pos16.length);
    });

    it('generates elevations within [minElevation, maxElevation]', () => {
      const minElevation = 5;
      const maxElevation = 25;
      const geometry = generateProceduralTerrain({ minElevation, maxElevation, seed: 1 });
      const positions = geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        expect(positions[i]).toBeGreaterThanOrEqual(minElevation - 0.001);
        expect(positions[i]).toBeLessThanOrEqual(maxElevation + 0.001);
      }
    });

    it('is deterministic with the same seed', () => {
      const geo1 = generateProceduralTerrain({ seed: 99 });
      const geo2 = generateProceduralTerrain({ seed: 99 });
      const pos1 = geo1.attributes.position.array;
      const pos2 = geo2.attributes.position.array;
      expect(pos1.length).toBe(pos2.length);
      for (let i = 0; i < pos1.length; i++) {
        expect(pos1[i]).toBeCloseTo(pos2[i], 6);
      }
    });

    it('produces different terrain for different seeds', () => {
      const geo1 = generateProceduralTerrain({ seed: 1 });
      const geo2 = generateProceduralTerrain({ seed: 2 });
      const pos1 = geo1.attributes.position.array as Float32Array;
      const pos2 = geo2.attributes.position.array as Float32Array;
      // At least one Y value should differ
      const hasDifference = Array.from({ length: pos1.length / 3 }, (_, i) => i).some(
        (i) => Math.abs((pos1[i * 3 + 1] ?? 0) - (pos2[i * 3 + 1] ?? 0)) > 0.0001
      );
      expect(hasDifference).toBe(true);
    });

    it('uses default values when no options passed', () => {
      const geometry = generateProceduralTerrain();
      // Default: 32x32 segments → (33 * 33) * 3 = 3267 position values
      expect(geometry.attributes.position.array.length).toBe((32 + 1) * (32 + 1) * 3);
    });
  });

  describe('generateSmootherTerrain', () => {
    it('returns a BufferGeometry instance', () => {
      const geometry = generateSmootherTerrain();
      expect(geometry).toBeInstanceOf(THREE.BufferGeometry);
    });

    it('has position and normal attributes', () => {
      const geometry = generateSmootherTerrain();
      expect(geometry.attributes.position).toBeDefined();
      expect(geometry.attributes.normal).toBeDefined();
    });

    it('computes bounding box', () => {
      const geometry = generateSmootherTerrain();
      expect(geometry.boundingBox).not.toBeNull();
    });

    it('is deterministic with the same seed', () => {
      const geo1 = generateSmootherTerrain({ seed: 7, octaves: 3 });
      const geo2 = generateSmootherTerrain({ seed: 7, octaves: 3 });
      const pos1 = geo1.attributes.position.array;
      const pos2 = geo2.attributes.position.array;
      for (let i = 0; i < pos1.length; i++) {
        expect(pos1[i]).toBeCloseTo(pos2[i], 6);
      }
    });

    it('generates elevations within [minElevation, maxElevation]', () => {
      const minElevation = 0;
      const maxElevation = 40;
      const geometry = generateSmootherTerrain({ minElevation, maxElevation, seed: 3 });
      const positions = geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        expect(positions[i]).toBeGreaterThanOrEqual(minElevation - 0.001);
        expect(positions[i]).toBeLessThanOrEqual(maxElevation + 0.001);
      }
    });

    it('applies octaves correctly — more octaves = same vertex count', () => {
      const geo2 = generateSmootherTerrain({ octaves: 2, segmentsX: 16, segmentsZ: 16 });
      const geo6 = generateSmootherTerrain({ octaves: 6, segmentsX: 16, segmentsZ: 16 });
      expect(geo2.attributes.position.array.length).toBe(geo6.attributes.position.array.length);
    });
  });

  describe('generateColoredProceduralTerrain', () => {
    it('returns a BufferGeometry instance', () => {
      const geometry = generateColoredProceduralTerrain();
      expect(geometry).toBeInstanceOf(THREE.BufferGeometry);
    });

    it('has a color attribute', () => {
      const geometry = generateColoredProceduralTerrain();
      expect(geometry.attributes.color).toBeDefined();
    });

    it('color attribute has 3 components per vertex (RGB)', () => {
      const geometry = generateColoredProceduralTerrain({ segmentsX: 8, segmentsZ: 8 });
      const positions = geometry.attributes.position.array;
      const colors = geometry.attributes.color.array;
      // 3 color values per vertex
      expect(colors.length).toBe(positions.length);
    });

    it('color values are in [0, 1] range', () => {
      const geometry = generateColoredProceduralTerrain({ maxElevation: 20 });
      const colors = geometry.attributes.color.array as Float32Array;
      for (let i = 0; i < colors.length; i++) {
        expect(colors[i]).toBeGreaterThanOrEqual(0);
        expect(colors[i]).toBeLessThanOrEqual(1);
      }
    });
  });
});
