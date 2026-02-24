/**
 * Fragment shader para posterization (redução de paleta de cores)
 * Reduz as cores para 256 níveis (ou quantidade customizável)
 */
export const posterizationFragmentShader = `
uniform sampler2D tDiffuse;
uniform float uLevels; // Número de níveis por canal (padrão: 8 = 256 cores totais)

varying vec2 vUv;

void main() {
  vec4 color = texture2D(tDiffuse, vUv);

  // Posteriza cada canal de cor
  // uLevels = 8 significa 8 níveis por canal: 8^3 = 512 cores (próximo a 256)
  color.rgb = floor(color.rgb * uLevels) / uLevels;

  gl_FragColor = color;
}
`;

/**
 * Vertex shader padrão para post-processing
 */
export const posterizationVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/**
 * Versão mais avançada com dithering (bayer matrix)
 * Oferece transições mais suaves entre cores
 */
export const posterizationWithDitheringFragmentShader = `
uniform sampler2D tDiffuse;
uniform float uLevels;
uniform float uDitherStrength;

varying vec2 vUv;

// Padrão de dithering Bayer 4x4
const mat4 ditherMatrix = mat4(
  0.0, 8.0, 2.0, 10.0,
  12.0, 4.0, 14.0, 6.0,
  3.0, 11.0, 1.0, 9.0,
  15.0, 7.0, 13.0, 5.0
) / 16.0;

void main() {
  vec4 color = texture2D(tDiffuse, vUv);

  // Calcula o padrão de dithering baseado na posição do pixel
  vec2 pixelCoord = vUv * vec2(800.0, 600.0); // Ajuste conforme necessário
  int ditherX = int(mod(pixelCoord.x, 4.0));
  int ditherY = int(mod(pixelCoord.y, 4.0));
  float dither = ditherMatrix[ditherY][ditherX];

  // Aplica posterização com dithering
  vec3 posterized = floor(color.rgb * uLevels + dither * uDitherStrength) / uLevels;

  gl_FragColor = vec4(posterized, color.a);
}
`;

/**
 * Classe para gerenciar o pós-processamento com posterization
 */
export class PosterizationPass {
  constructor(scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.composer = null;
    this.posterPass = null;
  }

  /**
   * Inicializa o EffectComposer com passes de pós-processamento
   *
   * @param {Object} options - Opções
   * @param {number} options.levels - Número de níveis de posterização (padrão: 8)
   * @param {boolean} options.dithering - Ativar dithering (padrão: false)
   * @param {number} options.ditherStrength - Força do dithering (padrão: 0.5)
   */
  initialize(options = {}) {
    const { levels = 8, dithering = false, ditherStrength = 0.5 } = options;

    // Importa EffectComposer e RenderPass
    // Você precisa ter three/examples instalado
    const { EffectComposer } = require('three/examples/jsm/postprocessing/EffectComposer');
    const { RenderPass } = require('three/examples/jsm/postprocessing/RenderPass');
    const { ShaderPass } = require('three/examples/jsm/postprocessing/ShaderPass');
    const THREE = require('three');

    // Cria o compositor
    this.composer = new EffectComposer(this.renderer);
    this.composer.setSize(this.renderer.domElement.width, this.renderer.domElement.height);

    // Adiciona o render pass padrão
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    // Escolhe o shader baseado em opções
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

    // Cria e adiciona o shader pass
    this.posterPass = new ShaderPass(shaderConfig);
    this.posterPass.renderToScreen = true;
    this.composer.addPass(this.posterPass);

    return this.composer;
  }

  /**
   * Renderiza a cena com pós-processamento
   */
  render() {
    if (this.composer) {
      this.composer.render();
    }
  }

  /**
   * Atualiza os parâmetros da posterização
   */
  setLevels(levels) {
    if (this.posterPass) {
      this.posterPass.uniforms.uLevels.value = levels;
    }
  }

  setDitherStrength(strength) {
    if (this.posterPass && this.posterPass.uniforms.uDitherStrength) {
      this.posterPass.uniforms.uDitherStrength.value = strength;
    }
  }

  /**
   * Atualiza o tamanho do compositor
   */
  setSize(width, height) {
    if (this.composer) {
      this.composer.setSize(width, height);
    }
  }

  /**
   * Limpa recursos
   */
  dispose() {
    if (this.composer) {
      this.composer.dispose();
    }
  }
}

export default {
  posterizationFragmentShader,
  posterizationVertexShader,
  posterizationWithDitheringFragmentShader,
  PosterizationPass,
};
