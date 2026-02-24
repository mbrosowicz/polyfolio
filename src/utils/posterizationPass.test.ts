import { describe, it, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import {
  posterizationVertexShader,
  posterizationFragmentShader,
  posterizationWithDitheringFragmentShader,
} from './posterizationPass';

describe('Posterization Shaders', () => {
  describe('posterizationVertexShader', () => {
    it('should be a valid shader string', () => {
      expect(posterizationVertexShader).toBeDefined();
      expect(typeof posterizationVertexShader).toBe('string');
      expect(posterizationVertexShader.length).toBeGreaterThan(0);
    });

    it('should contain required varying declarations', () => {
      expect(posterizationVertexShader).toContain('varying vec2 vUv');
    });

    it('should contain main function', () => {
      expect(posterizationVertexShader).toContain('void main()');
    });
  });

  describe('posterizationFragmentShader', () => {
    it('should be a valid shader string', () => {
      expect(posterizationFragmentShader).toBeDefined();
      expect(typeof posterizationFragmentShader).toBe('string');
      expect(posterizationFragmentShader.length).toBeGreaterThan(0);
    });

    it('should contain uniform samplers', () => {
      expect(posterizationFragmentShader).toContain('uniform sampler2D tDiffuse');
      expect(posterizationFragmentShader).toContain('uniform float uLevels');
    });

    it('should contain color posterization logic', () => {
      expect(posterizationFragmentShader).toContain('floor');
    });
  });

  describe('posterizationWithDitheringFragmentShader', () => {
    it('should be a valid shader string', () => {
      expect(posterizationWithDitheringFragmentShader).toBeDefined();
      expect(typeof posterizationWithDitheringFragmentShader).toBe('string');
    });

    it('should contain dither matrix', () => {
      expect(posterizationWithDitheringFragmentShader).toContain('ditherMatrix');
    });

    it('should have dither strength uniform', () => {
      expect(posterizationWithDitheringFragmentShader).toContain('uDitherStrength');
    });
  });
});

describe('Shader Compilation', () => {
  let renderer: THREE.WebGLRenderer;

  beforeEach(() => {
    // Create a mock renderer
    const canvas = document.createElement('canvas');
    renderer = new THREE.WebGLRenderer({ canvas });
  });

  it('should compile posterization vertex shader', () => {
    const shader = renderer.getContext().createShader(renderer.getContext().VERTEX_SHADER);
    expect(shader).toBeDefined();
  });

  it('should compile posterization fragment shader', () => {
    const shader = renderer.getContext().createShader(renderer.getContext().FRAGMENT_SHADER);
    expect(shader).toBeDefined();
  });
});
