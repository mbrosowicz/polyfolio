import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import type {
  PS1MaterialProps,
  PS1TerrainCanvasProps,
  TerrainGeneratorOptions,
  SmoothTerrainOptions,
  PosterizationOptions,
  PS1EffectsOptions,
  ShaderConfig,
  PS1DebugStats,
} from './index';

describe('Type definitions', () => {
  describe('PS1MaterialProps', () => {
    it('accepts geometry as the only required prop', () => {
      const props: PS1MaterialProps = { geometry: new THREE.BufferGeometry() };
      expect(props.geometry).toBeInstanceOf(THREE.BufferGeometry);
    });

    it('accepts all optional visual props', () => {
      const props: PS1MaterialProps = {
        geometry: new THREE.BufferGeometry(),
        color: '#ff00ff',
        gridSize: 8,
        wobbleStrength: 0.5,
        lightDir: [1, 1, 0.5],
      };
      expect(props.gridSize).toBe(8);
      expect(props.wobbleStrength).toBe(0.5);
      expect(props.lightDir).toEqual([1, 1, 0.5]);
    });

    it('optional props are undefined by default', () => {
      const props: PS1MaterialProps = { geometry: new THREE.BufferGeometry() };
      expect(props.color).toBeUndefined();
      expect(props.gridSize).toBeUndefined();
    });
  });

  describe('PS1TerrainCanvasProps', () => {
    it('accepts all optional props', () => {
      const props: PS1TerrainCanvasProps = {
        terrainWidth: 200,
        terrainHeight: 200,
        gridSize: 16,
        wobbleStrength: 1.0,
        smoothTerrain: true,
        posterizationEnabled: true,
        posterizationLevels: 8,
        dithering: false,
        ditherStrength: 0.5,
      };
      expect(props.terrainWidth).toBe(200);
      expect(props.posterizationEnabled).toBe(true);
    });

    it('can be constructed with no props (all optional)', () => {
      const props: PS1TerrainCanvasProps = {};
      expect(props).toBeDefined();
    });
  });

  describe('TerrainGeneratorOptions', () => {
    it('accepts all terrain generation options', () => {
      const options: TerrainGeneratorOptions = {
        width: 200,
        height: 200,
        segmentsX: 64,
        segmentsZ: 64,
        maxElevation: 30,
        minElevation: 5,
        seed: 42,
      };
      expect(options.width).toBe(200);
      expect(options.seed).toBe(42);
    });

    it('can be empty (all optional)', () => {
      const options: TerrainGeneratorOptions = {};
      expect(options).toBeDefined();
    });
  });

  describe('SmoothTerrainOptions', () => {
    it('extends TerrainGeneratorOptions with octaves and persistence', () => {
      const options: SmoothTerrainOptions = {
        width: 100,
        octaves: 4,
        persistence: 0.5,
      };
      expect(options.octaves).toBe(4);
      expect(options.persistence).toBe(0.5);
    });

    it('inherits base terrain options', () => {
      const options: SmoothTerrainOptions = { width: 50, segmentsX: 32 };
      expect(options.width).toBe(50);
      expect(options.segmentsX).toBe(32);
    });
  });

  describe('PosterizationOptions', () => {
    it('accepts all posterization options', () => {
      const options: PosterizationOptions = {
        enabled: true,
        levels: 8,
        dithering: true,
        ditherStrength: 0.5,
      };
      expect(options.levels).toBe(8);
      expect(options.dithering).toBe(true);
    });

    it('can be empty (all optional)', () => {
      const options: PosterizationOptions = {};
      expect(options).toBeDefined();
    });
  });

  describe('PS1EffectsOptions', () => {
    it('accepts all effects options', () => {
      const options: PS1EffectsOptions = {
        gridSize: 8,
        wobbleStrength: 0.5,
        posterizationLevels: 16,
        enableAnimation: true,
      };
      expect(options.enableAnimation).toBe(true);
    });
  });

  describe('ShaderConfig', () => {
    it('accepts vertex and fragment shaders with uniforms', () => {
      const config: ShaderConfig = {
        vertexShader: 'void main() {}',
        fragmentShader: 'void main() {}',
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(0xff0000) },
        },
      };
      expect(config.vertexShader).toBeDefined();
      expect(config.uniforms.uTime.value).toBe(0);
    });

    it('accepts an optional side property', () => {
      const config: ShaderConfig = {
        vertexShader: '',
        fragmentShader: '',
        uniforms: {},
        side: THREE.DoubleSide,
      };
      expect(config.side).toBe(THREE.DoubleSide);
    });
  });

  describe('PS1DebugStats', () => {
    it('has vertex and triangle count and bounding box', () => {
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
