/**
 * Exemplos Avançados para PS1 Vertex Jitter + Posterization
 *
 * Este arquivo contém exemplos mais complexos e customizações avançadas
 */

import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Exemplo 1: Vertex Jitter com Animação de Tempo
 *
 * Cria um efeito de wobble que varia ao longo do tempo
 */
export const AnimatedVertexJitterMaterial = () => {
  const vertexShader = `
    uniform vec2 uResolution;
    uniform float uGridSize;
    uniform float uWobbleStrength;
    uniform float uTime;

    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      float pixelGridSize = uGridSize / uResolution.x;
      vec3 snappedPosition = floor(position / pixelGridSize) * pixelGridSize;

      // Wobble sinusoidal baseado no tempo
      vec3 wobble = sin(position + uTime) * uWobbleStrength * 0.1;
      vec3 finalPosition = snappedPosition + wobble;

      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelMatrix * vec4(finalPosition, 1.0)).xyz;

      gl_Position = projectionMatrix * viewMatrix * vec4(finalPosition, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;

    uniform vec3 uColor;
    uniform float uTime;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 lightDir = normalize(vec3(sin(uTime), 1.0, cos(uTime)));

      float diffuse = max(dot(normal, lightDir), 0.2);
      vec3 finalColor = uColor * diffuse;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  return { vertexShader, fragmentShader };
};

/**
 * Exemplo 2: Posterization com Transições Suaves
 *
 * Blend entre quantidade de cores (transição em tempo real)
 */
export const AdaptivePosterizationShader = () => {
  return `
    uniform sampler2D tDiffuse;
    uniform float uLevels;
    uniform float uBlend; // 0 a 1

    varying vec2 vUv;

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);

      // Posterização
      vec3 posterized = floor(color.rgb * uLevels) / uLevels;

      // Blend entre cor original e posterizada
      vec3 blended = mix(color.rgb, posterized, uBlend);

      gl_FragColor = vec4(blended, color.a);
    }
  `;
};

/**
 * Exemplo 3: Terreno com Cores Baseadas em Altura
 *
 * Diferentes cores em diferentes elevações
 */
export function generateColoredProceduralTerrain(options = {}) {
  const {
    width = 100,
    height = 100,
    segmentsX = 32,
    segmentsZ = 32,
    maxElevation = 20,
    seed = 0,
  } = options;

  const mulberry32 = (a) => {
    return () => {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  const rng = mulberry32(seed);
  const geometry = new THREE.PlaneGeometry(width, height, segmentsX, segmentsZ);

  const positions = geometry.attributes.position.array;
  const colors = [];

  // Função para mapear altura para cor
  function getColorForHeight(height) {
    // Verde (baixo) → Marrom (médio) → Branco (alto)
    if (height < maxElevation * 0.3) {
      return new THREE.Color(0x00ff00); // Verde
    } else if (height < maxElevation * 0.6) {
      return new THREE.Color(0x8b6f47); // Marrom
    } else if (height < maxElevation * 0.9) {
      return new THREE.Color(0xcccccc); // Cinza claro
    } else {
      return new THREE.Color(0xffffff); // Branco
    }
  }

  for (let i = 0; i < positions.length; i += 3) {
    const elevation = Math.random() * maxElevation;
    positions[i + 1] = elevation;

    // Adiciona cor ao vértice
    const color = getColorForHeight(elevation);
    colors.push(color.r, color.g, color.b);
  }

  geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

  geometry.attributes.position.needsUpdate = true;
  geometry.computeVertexNormals();

  return geometry;
}

/**
 * Exemplo 4: Material com Múltiplos Texturas e Blend
 *
 * Blend entre múltiplas texturas baseado em altura
 */
export const MultiTextureTerrainShader = () => {
  const vertexShader = `
    varying vec3 vNormal;
    varying vec2 vUv;
    varying float vHeight;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vUv = uv;
      vHeight = position.y; // Altura do vértice

      gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform sampler2D uTexture1; // Textura do terreno baixo
    uniform sampler2D uTexture2; // Textura do terreno médio
    uniform sampler2D uTexture3; // Textura do terreno alto
    uniform float uMaxHeight;

    varying vec3 vNormal;
    varying vec2 vUv;
    varying float vHeight;

    void main() {
      // Normaliza altura em [0, 1]
      float normalizedHeight = vHeight / uMaxHeight;

      vec3 color;

      if (normalizedHeight < 0.33) {
        color = mix(
          texture2D(uTexture1, vUv).rgb,
          texture2D(uTexture2, vUv).rgb,
          (normalizedHeight - 0.0) * 3.0
        );
      } else if (normalizedHeight < 0.66) {
        color = mix(
          texture2D(uTexture2, vUv).rgb,
          texture2D(uTexture3, vUv).rgb,
          (normalizedHeight - 0.33) * 3.0
        );
      } else {
        color = texture2D(uTexture3, vUv).rgb;
      }

      // Iluminação
      vec3 lightDir = normalize(vec3(1.0, 1.0, 0.5));
      float diffuse = max(dot(normalize(vNormal), lightDir), 0.3);

      gl_FragColor = vec4(color * diffuse, 1.0);
    }
  `;

  return { vertexShader, fragmentShader };
};

/**
 * Exemplo 5: Componente com Estatísticas e Debug
 *
 * Mostra informações sobre vértices, performance, etc
 */
export const PS1DebugPanel = ({ geometry }) => {
  const [stats, setStats] = useState({
    vertexCount: 0,
    triangleCount: 0,
    boundingBox: { min: [0, 0, 0], max: [0, 0, 0] },
  });

  useEffect(() => {
    if (!geometry) return;

    const positions = geometry.attributes.position.array;
    const vertexCount = positions.length / 3;
    const triangleCount = geometry.index ? geometry.index.count / 3 : vertexCount / 3;

    geometry.computeBoundingBox();
    const bbox = geometry.boundingBox;

    setStats({
      vertexCount,
      triangleCount,
      boundingBox: {
        min: [bbox.min.x.toFixed(2), bbox.min.y.toFixed(2), bbox.min.z.toFixed(2)],
        max: [bbox.max.x.toFixed(2), bbox.max.y.toFixed(2), bbox.max.z.toFixed(2)],
      },
    });
  }, [geometry]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: '#0f0',
        padding: 10,
        fontFamily: 'monospace',
        fontSize: 12,
        zIndex: 100,
      }}
    >
      <div>Vértices: {stats.vertexCount}</div>
      <div>Triângulos: {stats.triangleCount}</div>
      <div>Bounding Box Min: [{stats.boundingBox.min.join(', ')}]</div>
      <div>Bounding Box Max: [{stats.boundingBox.max.join(', ')}]</div>
    </div>
  );
};

/**
 * Exemplo 6: Hook customizado para PS1 Effects
 *
 * Simplifica o uso dos efeitos em componentes
 */
export const usePS1Effects = (options = {}) => {
  const {
    gridSize = 8,
    wobbleStrength = 0.5,
    posterizationLevels = 8,
    enableAnimation = false,
  } = options;

  const [time, setTime] = useState(0);

  useFrame(({ clock }) => {
    if (enableAnimation) {
      setTime(clock.getElapsedTime());
    }
  });

  return {
    time,
    gridSize,
    wobbleStrength,
    posterizationLevels,
    uniforms: {
      uTime: { value: time },
      uGridSize: { value: gridSize },
      uWobbleStrength: { value: wobbleStrength },
    },
  };
};

/**
 * Exemplo 7: Funções Utilitárias para Animações
 */
export const PS1Utils = {
  /**
   * Cria um material PS1 com uniforms customizados
   */
  createPS1Material(config = {}) {
    const { vertexShader, fragmentShader, uniforms = {}, ...materialConfig } = config;

    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uResolution: { value: new THREE.Vector2(1024, 768) },
        uGridSize: { value: 8 },
        uWobbleStrength: { value: 0.5 },
        uColor: { value: new THREE.Color(0xff00ff) },
        uLightDir: { value: new THREE.Vector3(1, 1, 0.5) },
        ...uniforms,
      },
      side: THREE.DoubleSide,
      ...materialConfig,
    });
  },

  /**
   * Interpola entre dois valores (para animações suaves)
   */
  lerp(start, end, t) {
    return start + (end - start) * Math.min(Math.max(t, 0), 1);
  },

  /**
   * Cria uma animação de transição de cores
   */
  animateColor(fromColor, toColor, duration, onUpdate) {
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);

      const from = new THREE.Color(fromColor);
      const to = new THREE.Color(toColor);

      const color = new THREE.Color(
        this.lerp(from.r, to.r, t),
        this.lerp(from.g, to.g, t),
        this.lerp(from.b, to.b, t)
      );

      onUpdate(color);

      if (t < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  },

  /**
   * Calcula altura do terreno em um ponto específico (interpolação bilinear)
   */
  getTerrainHeightAtPoint(geometry, x, z, gridWidth, gridHeight) {
    const positions = geometry.attributes.position.array;
    const gridX = Math.floor(((x + gridWidth / 2) / gridWidth) * 32); // 32 = segmentsX
    const gridZ = Math.floor(((z + gridHeight / 2) / gridHeight) * 32);

    const vertexIndex = (gridZ * 33 + gridX) * 3; // 33 = segmentsX + 1
    return positions[vertexIndex + 1];
  },
};

export default {
  AnimatedVertexJitterMaterial,
  AdaptivePosterizationShader,
  generateColoredProceduralTerrain,
  MultiTextureTerrainShader,
  PS1DebugPanel,
  usePS1Effects,
  PS1Utils,
};
