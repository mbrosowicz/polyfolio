import React, { forwardRef, useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { PS1MaterialProps } from '@/types/index';
import vertexShader from '@/shaders/ps1VertexJitter.glsl';
import fragmentShader from '@/shaders/ps1Fragment.glsl';

/**
 * Componente PS1Material - Wrapper para ShaderMaterial
 */
export const PS1Material = forwardRef<THREE.Mesh, PS1MaterialProps>(
  (
    {
      geometry,
      color = '#ff00ff',
      gridSize = 8,
      wobbleStrength = 0.5,
      lightDir = [1, 1, 0.5],
      ...meshProps
    }: PS1MaterialProps,
    ref
  ) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const { size } = useThree();

    useEffect(() => {
      if (!meshRef.current) return;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
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

    useFrame(() => {
      if (meshRef.current?.material && 'uniforms' in meshRef.current.material) {
        const mat = meshRef.current.material as THREE.ShaderMaterial;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        mat.uniforms.uResolution.value.set(size.width, size.height);
      }
    });

    // Merge refs
    React.useImperativeHandle(ref, () => meshRef.current as THREE.Mesh);

    // eslint-disable-next-line react/no-unknown-property
    return <mesh ref={meshRef} geometry={geometry} {...meshProps} />;
  }
);

PS1Material.displayName = 'PS1Material';

export default PS1Material;
