import React, { forwardRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { RetroPlayerIconProps } from '@/types/index';

export const RetroPlayerIcon = forwardRef<THREE.Group, RetroPlayerIconProps>(
  ({ position = [0, 0.55, 0], color = '#f4f7ff', bobSpeed = 1.8 }, ref) => {
    const bodyRef = React.useRef<THREE.Group>(null);

    const bodyMaterial = useMemo(
      () =>
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.8,
          metalness: 0.1,
        }),
      [color]
    );

    const baseMaterial = useMemo(
      () =>
        new THREE.MeshStandardMaterial({
          color: '#2d3340',
          roughness: 0.9,
          metalness: 0.05,
        }),
      []
    );

    useFrame(({ clock }) => {
      if (!bodyRef.current) return;
      const time = clock.getElapsedTime();
      bodyRef.current.position.y = position[1] + Math.sin(time * bobSpeed) * 0.09;
      bodyRef.current.rotation.y = Math.sin(time * 0.7) * 0.12;
    });

    return (
      <group ref={ref} position={position}>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <mesh material={baseMaterial} position={[0, -0.42, 0]}>
          <cylinderGeometry args={[0.85, 1, 0.36, 5]} />
        </mesh>

        {/* eslint-disable-next-line react/no-unknown-property */}
        <group ref={bodyRef}>
          {/* eslint-disable-next-line react/no-unknown-property */}
          <mesh material={bodyMaterial} position={[0, 0.2, 0]}>
            <coneGeometry args={[0.48, 1.05, 5]} />
          </mesh>
          {/* eslint-disable-next-line react/no-unknown-property */}
          <mesh material={bodyMaterial} position={[0.22, 0.6, 0]} rotation={[0, 0, -0.38]}>
            <boxGeometry args={[0.33, 0.7, 0.28]} />
          </mesh>
          {/* eslint-disable-next-line react/no-unknown-property */}
          <mesh material={bodyMaterial} position={[0.05, 0.9, 0]}>
            <sphereGeometry args={[0.22, 8, 8]} />
          </mesh>
        </group>
      </group>
    );
  }
);

RetroPlayerIcon.displayName = 'RetroPlayerIcon';

export default RetroPlayerIcon;
