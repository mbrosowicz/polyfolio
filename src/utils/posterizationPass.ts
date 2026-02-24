import * as THREE from 'three';
import type { PosterizationOptions } from '@/types/index';

/**
 * Vertex shader para post-processing
 */
export const posterizationVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/**
 * Fragment shader para posterização
 */
export const posterizationFragmentShader = `
uniform sampler2D tDiffuse;
uniform float uLevels;

varying vec2 vUv;

void main() {
  vec4 color = texture2D(tDiffuse, vUv);
  color.rgb = floor(color.rgb * uLevels) / uLevels;
  gl_FragColor = color;
}
`;

/**
 * Fragment shader com dithering Bayer
 */
export const posterizationWithDitheringFragmentShader = `
uniform sampler2D tDiffuse;
uniform float uLevels;
uniform float uDitherStrength;

varying vec2 vUv;

const mat4 ditherMatrix = mat4(
  0.0, 8.0, 2.0, 10.0,
  12.0, 4.0, 14.0, 6.0,
  3.0, 11.0, 1.0, 9.0,
  15.0, 7.0, 13.0, 5.0
) / 16.0;

void main() {
  vec4 color = texture2D(tDiffuse, vUv);

  vec2 pixelCoord = vUv * vec2(800.0, 600.0);
  int ditherX = int(mod(pixelCoord.x, 4.0));
  int ditherY = int(mod(pixelCoord.y, 4.0));
  float dither = ditherMatrix[ditherY][ditherX];

  vec3 posterized = floor(color.rgb * uLevels + dither * uDitherStrength) / uLevels;

  gl_FragColor = vec4(posterized, color.a);
}
`;

/**
 * Classe para gerenciar pós-processamento com posterização
 */
export class PosterizationPass {
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private renderer: THREE.WebGLRenderer;
  public composer: any = null; // EffectComposer from jsm
  public posterPass: any = null; // ShaderPass from jsm

  constructor(scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
  }

  /**
   * Inicializa o EffectComposer
   */
  public initialize(options: PosterizationOptions = {}): any {
    const { levels = 8, dithering = false, ditherStrength = 0.5 } = options;

    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
    const { EffectComposer } = require('three/examples/jsm/postprocessing/EffectComposer');
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
    const { RenderPass } = require('three/examples/jsm/postprocessing/RenderPass');
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
    const { ShaderPass } = require('three/examples/jsm/postprocessing/ShaderPass');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    this.composer = new EffectComposer(this.renderer);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.composer.setSize(
      this.renderer.domElement.clientWidth,
      this.renderer.domElement.clientHeight
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const renderPass = new RenderPass(this.scene, this.camera);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.composer.addPass(renderPass);

    const shaderConfig = dithering
      ? {
          uniforms: {
            tDiffuse: { value: null },
            uLevels: { value: levels },
            uDitherStrength: { value: ditherStrength },
          },
          vertexShader: posterizationVertexShader,
          fragmentShader: posterizationWithDitheringFragmentShader,
        }
      : {
          uniforms: {
            tDiffuse: { value: null },
            uLevels: { value: levels },
          },
          vertexShader: posterizationVertexShader,
          fragmentShader: posterizationFragmentShader,
        };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    this.posterPass = new ShaderPass(shaderConfig);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.posterPass.renderToScreen = true;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.composer.addPass(this.posterPass);

    return this.composer;
  }

  /**
   * Renderiza a cena
   */
  public render(): void {
    if (this.composer) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      this.composer.render();
    }
  }

  /**
   * Atualiza nível de posterização
   */
  public setLevels(levels: number): void {
    if (this.posterPass) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.posterPass.uniforms.uLevels.value = levels;
    }
  }

  /**
   * Atualiza força do dithering
   */
  public setDitherStrength(strength: number): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (this.posterPass?.uniforms.uDitherStrength) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.posterPass.uniforms.uDitherStrength.value = strength;
    }
  }

  /**
   * Atualiza tamanho
   */
  public setSize(width: number, height: number): void {
    if (this.composer) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      this.composer.setSize(width, height);
    }
  }

  /**
   * Limpa recursos
   */
  public dispose(): void {
    if (this.composer) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      this.composer.dispose();
    }
  }
}
