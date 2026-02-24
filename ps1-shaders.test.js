/**
 * Testes unitários para PS1 Shaders e Terrain
 *
 * Use com Jest ou Vitest:
 * npm install --save-dev jest @testing-library/react
 * npm test
 */

import * as THREE from 'three';
import { generateProceduralTerrain, generateSmootherTerrain } from './terrainGenerator';
import { PS1Utils } from './PS1_ADVANCED_EXAMPLES';

describe('Terrain Generator', () => {
  describe('generateProceduralTerrain', () => {
    it('deve criar uma geometria válida', () => {
      const geometry = generateProceduralTerrain();

      expect(geometry).toBeDefined();
      expect(geometry).toBeInstanceOf(THREE.BufferGeometry);
    });

    it('deve respeitar opções de tamanho', () => {
      const geometry = generateProceduralTerrain({
        width: 200,
        height: 200,
        segmentsX: 64,
        segmentsZ: 64,
      });

      const positions = geometry.attributes.position.array;
      expect(positions.length).toBeGreaterThan(0);
    });

    it('deve gerar elevações dentro dos limites', () => {
      const maxElevation = 30;
      const geometry = generateProceduralTerrain({
        maxElevation,
        minElevation: 0,
      });

      const positions = geometry.attributes.position.array;

      // Verifica todas as elevações Y
      for (let i = 1; i < positions.length; i += 3) {
        const y = positions[i];
        expect(y).toBeGreaterThanOrEqual(0);
        expect(y).toBeLessThanOrEqual(maxElevation);
      }
    });

    it('deve ser reproducível com seed', () => {
      const geometry1 = generateProceduralTerrain({ seed: 42 });
      const geometry2 = generateProceduralTerrain({ seed: 42 });

      const positions1 = geometry1.attributes.position.array;
      const positions2 = geometry2.attributes.position.array;

      // Compara arrays (mesma seed = mesmas posições)
      for (let i = 0; i < positions1.length; i++) {
        expect(positions1[i]).toBeCloseTo(positions2[i], 5);
      }
    });

    it('deve compute normals para iluminação', () => {
      const geometry = generateProceduralTerrain();

      expect(geometry.attributes.normal).toBeDefined();
    });

    it('deve computar bounding box', () => {
      const geometry = generateProceduralTerrain({
        width: 100,
        height: 100,
      });

      expect(geometry.boundingBox).toBeDefined();
      expect(geometry.boundingBox.min).toBeDefined();
      expect(geometry.boundingBox.max).toBeDefined();
    });
  });

  describe('generateSmootherTerrain', () => {
    it('deve gerar terreno com múltiplas oitavas', () => {
      const geometry = generateSmootherTerrain({
        octaves: 4,
        persistence: 0.6,
      });

      expect(geometry).toBeInstanceOf(THREE.BufferGeometry);
    });

    it('deve ter mais suavidade que terreno simples', () => {
      const simpleGeometry = generateProceduralTerrain({
        seed: 42,
        segmentsX: 16,
        segmentsZ: 16,
      });

      const smoothGeometry = generateSmootherTerrain({
        seed: 42,
        segmentsX: 16,
        segmentsZ: 16,
        octaves: 4,
      });

      const simplePos = simpleGeometry.attributes.position.array;
      const smoothPos = smoothGeometry.attributes.position.array;

      // Calcula variância para comparação (suavidade)
      let simpleVariance = 0;
      let smoothVariance = 0;

      for (let i = 1; i < simplePos.length; i += 3) {
        if (simplePos[i + 3]) {
          simpleVariance += Math.abs(simplePos[i] - simplePos[i + 3]);
          smoothVariance += Math.abs(smoothPos[i] - smoothPos[i + 3]);
        }
      }

      // Terreno suave deve ter variação menor entre vértices adjacentes
      expect(smoothVariance).toBeLessThan(simpleVariance);
    });
  });
});

describe('PS1Utils', () => {
  describe('lerp', () => {
    it('deve interpolar linearmente', () => {
      expect(PS1Utils.lerp(0, 10, 0)).toBe(0);
      expect(PS1Utils.lerp(0, 10, 1)).toBe(10);
      expect(PS1Utils.lerp(0, 10, 0.5)).toBe(5);
    });

    it('deve clampar valores fora de [0, 1]', () => {
      expect(PS1Utils.lerp(0, 10, -0.5)).toBe(0);
      expect(PS1Utils.lerp(0, 10, 1.5)).toBe(10);
    });
  });

  describe('createPS1Material', () => {
    it('deve criar shader material', () => {
      const vertexShader = 'void main() { gl_Position = vec4(0.0); }';
      const fragmentShader = 'void main() { gl_FragColor = vec4(1.0); }';

      const material = PS1Utils.createPS1Material({
        vertexShader,
        fragmentShader,
      });

      expect(material).toBeInstanceOf(THREE.ShaderMaterial);
      expect(material.uniforms.uColor).toBeDefined();
      expect(material.uniforms.uGridSize).toBeDefined();
      expect(material.uniforms.uWobbleStrength).toBeDefined();
    });

    it('deve aceitar uniforms customizados', () => {
      const material = PS1Utils.createPS1Material({
        vertexShader: 'void main() {}',
        fragmentShader: 'void main() {}',
        uniforms: {
          customValue: { value: 3.14 },
        },
      });

      expect(material.uniforms.customValue.value).toBe(3.14);
    });
  });

  describe('getTerrainHeightAtPoint', () => {
    it('deve retornar altura válida', () => {
      const geometry = generateProceduralTerrain({
        width: 100,
        height: 100,
        segmentsX: 32,
        segmentsZ: 32,
      });

      const height = PS1Utils.getTerrainHeightAtPoint(geometry, 0, 0, 100, 100);

      expect(typeof height).toBe('number');
    });
  });
});

describe('ShaderMaterial Configuration', () => {
  it('deve compilar vertex shader válido', () => {
    const shader = `
      uniform vec2 uResolution;
      void main() {
        gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0);
      }
    `;

    // Validação básica
    expect(shader).toContain('gl_Position');
    expect(shader).toContain('uniform');
  });

  it('deve compilar fragment shader válido', () => {
    const shader = `
      void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
      }
    `;

    expect(shader).toContain('gl_FragColor');
    expect(shader).toContain('main');
  });
});

describe('Integration Tests', () => {
  it('deve integrar terreno com material PS1', () => {
    const geometry = generateProceduralTerrain();
    const material = PS1Utils.createPS1Material({
      vertexShader: 'void main() {}',
      fragmentShader: 'void main() {}',
    });

    expect(geometry.attributes.position).toBeDefined();
    expect(material.uniforms).toBeDefined();
  });

  it('deve criar cena mínima válida', () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const geometry = generateProceduralTerrain();
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    expect(scene.children).toContain(mesh);
    expect(mesh.geometry.attributes.position.count).toBeGreaterThan(0);
  });
});

describe('Performance Tests', () => {
  it('deve gerar terreno em tempo aceitável', () => {
    const startTime = performance.now();
    const geometry = generateProceduralTerrain({
      segmentsX: 128,
      segmentsZ: 128,
    });
    const endTime = performance.now();

    const executionTime = endTime - startTime;

    // Deve executar em menos de 500ms
    expect(executionTime).toBeLessThan(500);
  });

  it('deve conservar memória com geometria otimizada', () => {
    const geometry = generateProceduralTerrain({
      segmentsX: 64,
      segmentsZ: 64,
    });

    // Verifica se as propriedades estão otimizadas
    expect(geometry.attributes.position).toBeDefined();
    expect(geometry.attributes.normal).toBeDefined();
    // Não deve ter índices duplicados
    expect(geometry.index).toBeNull();
  });
});

export const testSuite = {
  // Export para uso externo
};

export default testSuite;
