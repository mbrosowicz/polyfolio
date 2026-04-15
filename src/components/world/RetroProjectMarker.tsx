import React, { forwardRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import type { RetroProjectMarkerProps } from '@/types/index';

type MarkerIconProps = {
  icon: 'disc' | 'memory-card' | 'controller' | 'tower';
  color: THREE.Color;
};

const MarkerIcon: React.FC<MarkerIconProps> = ({ icon, color }) => {
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.75,
        metalness: 0.15,
      }),
    [color]
  );

  if (icon === 'disc') {
    return (
      <group>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <mesh material={material} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.8, 0.24, 10, 20]} />
        </mesh>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <mesh material={material} position={[0, 0, 0.02]}>
          <cylinderGeometry args={[0.17, 0.17, 0.22, 10]} />
        </mesh>
      </group>
    );
  }

  if (icon === 'controller') {
    return (
      <group>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <mesh material={material}>
          <boxGeometry args={[1.55, 0.6, 0.6]} />
        </mesh>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <mesh material={material} position={[-0.8, -0.2, 0]}>
          <sphereGeometry args={[0.28, 10, 10]} />
        </mesh>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <mesh material={material} position={[0.8, -0.2, 0]}>
          <sphereGeometry args={[0.28, 10, 10]} />
        </mesh>
      </group>
    );
  }

  if (icon === 'tower') {
    return (
      <group>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <mesh material={material} position={[0, 0.2, 0]}>
          <boxGeometry args={[0.85, 1.2, 0.85]} />
        </mesh>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <mesh material={material} position={[0, 0.96, 0]}>
          <coneGeometry args={[0.62, 0.65, 4]} />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <mesh material={material}>
        <boxGeometry args={[1, 1.3, 0.24]} />
      </mesh>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <mesh material={material} position={[0, -0.12, 0.15]}>
        <boxGeometry args={[0.55, 0.1, 0.08]} />
      </mesh>
    </group>
  );
};

export const RetroProjectMarker = forwardRef<THREE.Group, RetroProjectMarkerProps>(
  ({ project, isSelected = false, onSelect }, ref) => {
    const [isHovered, setIsHovered] = useState(false);

    const accentColor = useMemo(() => new THREE.Color(project.accentColor ?? '#55ff88'), [project]);
    const pedestalColor = useMemo(
      () => new THREE.Color(isSelected ? '#2c2f2f' : '#1d1e1f'),
      [isSelected]
    );

    const baseMaterial = useMemo(
      () =>
        new THREE.MeshStandardMaterial({
          color: pedestalColor,
          roughness: 0.86,
          metalness: 0.04,
        }),
      [pedestalColor]
    );

    const iconScale = isSelected ? 1.08 : isHovered ? 1.04 : 1;

    return (
      <group
        ref={ref}
        position={project.position}
        onClick={(event) => {
          event.stopPropagation();
          onSelect?.(project);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setIsHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setIsHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        {/* eslint-disable-next-line react/no-unknown-property */}
        <mesh material={baseMaterial} position={[0, 0.35, 0]}>
          <cylinderGeometry args={[1.5, 1.7, 0.7, 6]} />
        </mesh>

        {/* eslint-disable-next-line react/no-unknown-property */}
        <group
          position={[0, 1.15 + (isHovered ? 0.08 : 0), 0]}
          scale={[iconScale, iconScale, iconScale]}
        >
          <MarkerIcon icon={project.icon} color={accentColor} />
        </group>
      </group>
    );
  }
);

RetroProjectMarker.displayName = 'RetroProjectMarker';

export default RetroProjectMarker;
