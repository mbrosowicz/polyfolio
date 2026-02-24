import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import PS1Material from './PS1Material';
import { generateProceduralTerrain, generateSmootherTerrain } from './terrainGenerator';
import { PosterizationPass } from './posterizationPass';

/**
 * Componente para render com EffectComposer e posterization
 */
const PostProcessing = ({ enabled = true, levels = 8, dithering = false }) => {
  const { gl, scene, camera } = useThree();
  const posterPassRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    try {
      // Inicializa o pós-processamento
      const pass = new PosterizationPass(scene, camera, gl);
      pass.initialize({
        levels,
        dithering,
        ditherStrength: 0.5,
      });

      posterPassRef.current = pass;

      // Sobrescreve o render loop para usar o compositor
      gl.setAnimationLoop((time) => {
        camera.position.z = 50;
        pass.render();
      });

      return () => {
        pass.dispose();
      };
    } catch (error) {
      console.error('Erro ao inicializar PosterizationPass:', error);
    }
  }, [enabled, levels, dithering, gl, scene, camera]);

  // Atualiza nível de posterização
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
 * Componente principal: Terreno PS1 com Posterization
 */
const PS1TerrainScene = ({
  terrainWidth = 200,
  terrainHeight = 200,
  gridSize = 8,
  wobbleStrength = 0.8,
  posterizationEnabled = true,
  posterizationLevels = 8,
  dithering = false,
  smoothTerrain = true,
}) => {
  const meshRef = useRef();
  const geometryRef = useRef();

  useEffect(() => {
    // Gera a geometria do terreno
    const geometry = smoothTerrain
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

    geometryRef.current = geometry;
  }, [terrainWidth, terrainHeight, smoothTerrain]);

  // Rotaciona a câmera para visualizar melhor
  useFrame(({ camera }) => {
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
        geometry={geometryRef.current}
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
 * Componente Canvas com configurações R3F
 */
export const PS1TerrainCanvas = (props) => {
  return (
    <Canvas
      camera={{ position: [80, 60, 80], far: 2000 }}
      gl={{ antialias: true, precision: 'highp' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <PS1TerrainScene {...props} />
    </Canvas>
  );
};

export default PS1TerrainCanvas;
