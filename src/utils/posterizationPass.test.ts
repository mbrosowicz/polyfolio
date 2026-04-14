import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as THREE from 'three';
import {
  posterizationVertexShader,
  posterizationFragmentShader,
  posterizationWithDitheringFragmentShader,
  PosterizationPass,
} from './posterizationPass';

// Mock three.js postprocessing modules used inside initialize()
const mockComposer = {
  setSize: vi.fn(),
  addPass: vi.fn(),
  render: vi.fn(),
  dispose: vi.fn(),
};
const MockEffectComposer = vi.fn(() => mockComposer);
const MockRenderPass = vi.fn();
const mockPosterPass = {
  renderToScreen: false,
  uniforms: {
    tDiffuse: { value: null },
    uLevels: { value: 8 },
    uDitherStrength: { value: 0.5 },
  },
};
const MockShaderPass = vi.fn(() => mockPosterPass);

vi.mock('three/examples/jsm/postprocessing/EffectComposer', () => ({
  EffectComposer: MockEffectComposer,
}));
vi.mock('three/examples/jsm/postprocessing/RenderPass', () => ({
  RenderPass: MockRenderPass,
}));
vi.mock('three/examples/jsm/postprocessing/ShaderPass', () => ({
  ShaderPass: MockShaderPass,
}));

describe('posterizationPass', () => {
  describe('posterizationVertexShader', () => {
    it('is a non-empty string', () => {
      expect(typeof posterizationVertexShader).toBe('string');
      expect(posterizationVertexShader.length).toBeGreaterThan(0);
    });

    it('declares vUv varying', () => {
      expect(posterizationVertexShader).toContain('varying vec2 vUv');
    });

    it('contains a main function', () => {
      expect(posterizationVertexShader).toContain('void main()');
    });

    it('assigns gl_Position', () => {
      expect(posterizationVertexShader).toContain('gl_Position');
    });

    it('reads uv from attribute', () => {
      expect(posterizationVertexShader).toContain('vUv = uv');
    });
  });

  describe('posterizationFragmentShader', () => {
    it('is a non-empty string', () => {
      expect(typeof posterizationFragmentShader).toBe('string');
      expect(posterizationFragmentShader.length).toBeGreaterThan(0);
    });

    it('has tDiffuse sampler uniform', () => {
      expect(posterizationFragmentShader).toContain('uniform sampler2D tDiffuse');
    });

    it('has uLevels uniform', () => {
      expect(posterizationFragmentShader).toContain('uniform float uLevels');
    });

    it('applies floor operation for quantization', () => {
      expect(posterizationFragmentShader).toContain('floor');
    });

    it('writes to gl_FragColor', () => {
      expect(posterizationFragmentShader).toContain('gl_FragColor');
    });
  });

  describe('posterizationWithDitheringFragmentShader', () => {
    it('is a non-empty string', () => {
      expect(typeof posterizationWithDitheringFragmentShader).toBe('string');
      expect(posterizationWithDitheringFragmentShader.length).toBeGreaterThan(0);
    });

    it('contains a Bayer dither matrix', () => {
      expect(posterizationWithDitheringFragmentShader).toContain('ditherMatrix');
    });

    it('has uDitherStrength uniform', () => {
      expect(posterizationWithDitheringFragmentShader).toContain('uDitherStrength');
    });

    it('has uLevels uniform', () => {
      expect(posterizationWithDitheringFragmentShader).toContain('uLevels');
    });

    it('writes to gl_FragColor', () => {
      expect(posterizationWithDitheringFragmentShader).toContain('gl_FragColor');
    });

    it('uses texture2D to sample input', () => {
      expect(posterizationWithDitheringFragmentShader).toContain('texture2D');
    });
  });

  describe('PosterizationPass', () => {
    const makePass = () => {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera();
      // Minimal renderer stub — no real WebGL needed for constructor
      const renderer = {
        domElement: { clientWidth: 800, clientHeight: 600 },
      } as unknown as THREE.WebGLRenderer;
      return new PosterizationPass(scene, camera, renderer);
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('can be instantiated', () => {
      const pass = makePass();
      expect(pass).toBeInstanceOf(PosterizationPass);
    });

    it('composer starts as null before initialize', () => {
      const pass = makePass();
      expect(pass.composer).toBeNull();
    });

    it('posterPass starts as null before initialize', () => {
      const pass = makePass();
      expect(pass.posterPass).toBeNull();
    });

    it('render() is safe to call when composer is null', () => {
      const pass = makePass();
      // Should not throw when composer is not initialized
      expect(() => pass.render()).not.toThrow();
    });

    it('setLevels() is safe to call when posterPass is null', () => {
      const pass = makePass();
      expect(() => pass.setLevels(4)).not.toThrow();
    });

    it('setDitherStrength() is safe to call when posterPass is null', () => {
      const pass = makePass();
      expect(() => pass.setDitherStrength(0.8)).not.toThrow();
    });

    it('setLevels() updates posterPass uniforms when initialized', () => {
      const pass = makePass();
      const mockUniforms = { uLevels: { value: 8 } };
      pass.posterPass = { uniforms: mockUniforms };
      pass.setLevels(4);
      expect(mockUniforms.uLevels.value).toBe(4);
    });

    it('setDitherStrength() updates posterPass uniforms when initialized', () => {
      const pass = makePass();
      const mockUniforms = { uDitherStrength: { value: 0.5 } };
      pass.posterPass = { uniforms: mockUniforms };
      pass.setDitherStrength(0.9);
      expect(mockUniforms.uDitherStrength.value).toBe(0.9);
    });

    it('render() calls composer.render() when initialized', () => {
      const pass = makePass();
      const renderFn = vi.fn();
      pass.composer = { render: renderFn };
      pass.render();
      expect(renderFn).toHaveBeenCalledOnce();
    });

    it('initialize() creates an EffectComposer and returns it', async () => {
      const pass = makePass();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await pass.initialize();
      expect(result).toBeDefined();
      expect(pass.composer).not.toBeNull();
    });

    it('initialize() creates a posterPass', async () => {
      const pass = makePass();
      await pass.initialize();
      expect(pass.posterPass).not.toBeNull();
    });

    it('initialize() uses non-dithering shader by default', async () => {
      const pass = makePass();
      await pass.initialize();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const shaderConfig = (MockShaderPass.mock.calls as unknown[][])[0]?.[0] as
        | { fragmentShader: string }
        | undefined;
      expect(shaderConfig?.fragmentShader).toBe(posterizationFragmentShader);
    });

    it('initialize() uses dithering shader when dithering=true', async () => {
      const pass = makePass();
      await pass.initialize({ dithering: true });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const shaderConfig = (MockShaderPass.mock.calls as unknown[][])[0]?.[0] as
        | { fragmentShader: string }
        | undefined;
      expect(shaderConfig?.fragmentShader).toBe(posterizationWithDitheringFragmentShader);
    });

    it('initialize() passes custom levels to shader config', async () => {
      const pass = makePass();
      await pass.initialize({ levels: 4 });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const shaderConfig = (MockShaderPass.mock.calls as unknown[][])[0]?.[0] as
        | { uniforms: { uLevels: { value: number } } }
        | undefined;
      expect(shaderConfig?.uniforms.uLevels.value).toBe(4);
    });

    it('initialize() sets renderToScreen on posterPass', async () => {
      const pass = makePass();
      await pass.initialize();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(pass.posterPass.renderToScreen).toBe(true);
    });

    it('setSize() calls composer.setSize() when composer is initialized', () => {
      const pass = makePass();
      const setSizeFn = vi.fn();
      pass.composer = { setSize: setSizeFn };
      pass.setSize(1920, 1080);
      expect(setSizeFn).toHaveBeenCalledWith(1920, 1080);
    });

    it('setSize() is safe to call when composer is null', () => {
      const pass = makePass();
      expect(() => pass.setSize(800, 600)).not.toThrow();
    });

    it('dispose() calls composer.dispose() when composer is initialized', () => {
      const pass = makePass();
      const disposeFn = vi.fn();
      pass.composer = { dispose: disposeFn };
      pass.dispose();
      expect(disposeFn).toHaveBeenCalledOnce();
    });

    it('dispose() is safe to call when composer is null', () => {
      const pass = makePass();
      expect(() => pass.dispose()).not.toThrow();
    });
  });
});
