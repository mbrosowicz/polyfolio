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
  ditherStrength: number;
}> = ({
  enabled,
  levels,
  dithering,
  ditherStrength,
}: {
  enabled: boolean;
  levels: number;
  dithering: boolean;
  ditherStrength: number;
}) => {
  const { gl, scene, camera, size } = useThree();
  const posterPassRef = useRef<PosterizationPass | null>(null);

  useEffect(() => {
    if (!enabled) {
      posterPassRef.current?.dispose();
      posterPassRef.current = null;
      return;
    }

    let disposed = false;

    const init = async () => {
      try {
        const pass = new PosterizationPass(scene, camera, gl);
        await pass.initialize({
          levels,
          dithering,
          ditherStrength,
        });

        pass.setSize(size.width, size.height);

        if (disposed) {
          pass.dispose();
          return;
        }

        posterPassRef.current?.dispose();
        posterPassRef.current = pass;
      } catch (error) {
        console.error('Erro ao inicializar PosterizationPass:', error);
      }
    };

    void init();

    return () => {
      disposed = true;
      posterPassRef.current?.dispose();
      posterPassRef.current = null;
    };
  }, [enabled, levels, dithering, ditherStrength, gl, scene, camera, size.width, size.height]);

  useEffect(() => {
    if (posterPassRef.current) {
      posterPassRef.current.setLevels(levels);
    }
  }, [levels]);

  useFrame(() => {
    if (posterPassRef.current && enabled) {
      posterPassRef.current.render();
    }
  }, 1);

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
  ditherStrength = 0.5,
  smoothTerrain = true,
}) => {
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

  if (!geometryRef.current) return null;

  return (
    <>
      {posterizationEnabled && (
        <PostProcessing
          enabled={posterizationEnabled}
          levels={posterizationLevels}
          dithering={dithering}
          ditherStrength={ditherStrength}
        />
      )}

      {/* PlaneGeometry nasce no plano XY; rotacionamos para o plano XZ */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <PS1Material
          geometry={geometry}
          color="#00ff00"
          gridSize={gridSize}
          wobbleStrength={wobbleStrength}
          lightDir={[1, 1, 0.5]}
        />
      </group>

      <OrbitControls makeDefault enableDamping dampingFactor={0.06} />
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
