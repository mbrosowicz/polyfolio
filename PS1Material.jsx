import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import vertexShader from './ps1-vertex-jitter.glsl';
import fragmentShader from './ps1-fragment-shader.glsl';

/**
 * Componente R3F para PS1 Vertex Jitter Shader Material
 *
 * Props:
 * - geometry: THREE.BufferGeometry - geometria a renderizar
 * - color: string ou number - cor do material (hex ou número)
 * - gridSize: number - tamanho da grade de snap em pixels (padrão: 8)
 * - wobbleStrength: number - intensidade do wobble (padrão: 0.5)
 * - lightDir: [x, y, z] - direção da luz
 */
export const PS1Material = React.forwardRef((props, ref) => {
  const {
    geometry,
    color = '#ff00ff',
    gridSize = 8,
    wobbleStrength = 0.5,
    lightDir = [1, 1, 0.5],
    ...meshProps
  } = props;

  const meshRef = useRef();
  const { size } = useThree();

  useEffect(() => {
    if (!meshRef.current) return;

    // Cria o material com shaders customizados
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uResolution: { value: new THREE.Vector2(size.width, size.height) },
        uGridSize: { value: gridSize },
        uWobbleStrength: { value: wobbleStrength },
        uColor: { value: new THREE.Color(color) },
        uLightDir: { value: new THREE.Vector3(...lightDir) },
      },
      side: THREE.DoubleSide,
    });

    meshRef.current.material = material;
  }, [color, gridSize, wobbleStrength, lightDir, size]);

  // Atualiza a resolução da tela se a janela mudar de tamanho
  useFrame(() => {
    if (meshRef.current?.material?.uniforms) {
      meshRef.current.material.uniforms.uResolution.value.set(size.width, size.height);
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} {...meshProps}>
      {/* Material será aplicado via ref */}
    </mesh>
  );
});

PS1Material.displayName = 'PS1Material';

export default PS1Material;
