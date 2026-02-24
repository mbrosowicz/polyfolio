import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import PS1Material from './PS1Material';
import { generateProceduralTerrain, generateSmootherTerrain } from '@/utils/terrainGenerator';
import { PosterizationPass } from '@/utils/posterizationPass';
import type { PS1TerrainCanvasProps } from '@/types/index';

/**
 * Componente para post-processing
 */
const PostProcessing: React.FC<{
  enabled: boolean;
  levels: number;
  dithering: boolean;
}> = ({ enabled, levels, dithering }: { enabled: boolean; levels: number; dithering: boolean }) => {
  const { gl, scene, camera } = useThree();
  const posterPassRef = useRef<PosterizationPass | null>(null);

  useEffect(() => {
    if (!enabled) return;

    try {
      const pass = new PosterizationPass(scene, camera, gl);
      pass.initialize({
        levels,
        dithering,
        ditherStrength: 0.5,
      });

      posterPassRef.current = pass;

      return () => {
        pass.dispose();
      };
    } catch (error) {
      console.error('Erro ao inicializar PosterizationPass:', error);
    }
  }, [enabled, levels, dithering, gl, scene, camera]);

  useEffect(() => {
    if (posterPassRef.current) {
      posterPassRef.current.setLevels(levels);
    }
  }, [levels]);

  useFrame(() => {
    if (posterPassRef.current && enabled) {
      posterPassRef.current.render();
    }
  });

  return null;
};

/**
 * Componente principal do terreno
 */
const PS1TerrainScene: React.FC<PS1TerrainCanvasProps> = ({
  terrainWidth = 200,
  terrainHeight = 200,
  gridSize = 8,
  wobbleStrength = 0.8,
  posterizationEnabled = true,
  posterizationLevels = 8,
  dithering = false,
  smoothTerrain = true,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);

  const geometry = useMemo(() => {
    const gen = smoothTerrain
      ? generateSmootherTerrain({
          width: terrainWidth,
          height: terrainHeight,
          segmentsX: 64,
          segmentsZ: 64,
          maxElevation: 30,
          seed: Math.random() * 1000,
          octaves: 4,
          persistence: 0.6,
        })
      : generateProceduralTerrain({
          width: terrainWidth,
          height: terrainHeight,
          segmentsX: 32,
          segmentsZ: 32,
          maxElevation: 25,
          seed: Math.random() * 1000,
        });

    geometryRef.current = gen;
    return gen;
  }, [terrainWidth, terrainHeight, smoothTerrain]);

  useFrame(({ camera }: { camera: THREE.Camera }) => {
    camera.position.set(80, 60, 80);
    camera.lookAt(0, 15, 0);
  });

  if (!geometryRef.current) return null;

  return (
    <>
      {posterizationEnabled && (
        <PostProcessing
          enabled={posterizationEnabled}
          levels={posterizationLevels}
          dithering={dithering}
        />
      )}

      <PS1Material
        ref={meshRef}
        geometry={geometry}
        color="#00ff00"
        gridSize={gridSize}
        wobbleStrength={wobbleStrength}
        lightDir={[1, 1, 0.5]}
      />

      <OrbitControls />
    </>
  );
};

/**
 * Canvas principal
 */
export const PS1TerrainCanvas: React.FC<PS1TerrainCanvasProps> = (props: PS1TerrainCanvasProps) => {
  return (
    <Canvas
      camera={{ position: [80, 60, 80], far: 2000 }}
      gl={{ antialias: true, precision: 'highp' }}
    >
      {/* eslint-disable-next-line react/no-unknown-property */}
      <ambientLight intensity={0.6} />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <PS1TerrainScene {...props} />
    </Canvas>
  );
};

export default PS1TerrainCanvas;
