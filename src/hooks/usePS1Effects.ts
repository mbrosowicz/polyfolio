import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import type { PS1EffectsOptions } from '@/types/index';
import * as THREE from 'three';

/**
 * Hook customizado para efeitos PS1
 */
export function usePS1Effects(options: PS1EffectsOptions = {}) {
  const {
    gridSize = 8,
    wobbleStrength = 0.5,
    posterizationLevels = 8,
    enableAnimation = false,
  } = options;

  const [time, setTime] = useState(0);

  useFrame(({ clock }: { clock: THREE.Clock }) => {
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
}

/**
 * Hook para monitorar mudanças de tamanho da janela
 */
export function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

/**
 * Hook para debug de performance
 */
export function usePerformanceMonitor() {
  const [fps, setFps] = useState(0);
  const fpsRef = useRef(0);
  const lastTimeRef = useRef(Date.now());

  useFrame(() => {
    const now = Date.now();
    const delta = now - lastTimeRef.current;

    if (delta >= 1000) {
      setFps(Math.round(fpsRef.current / (delta / 1000)));
      fpsRef.current = 0;
      lastTimeRef.current = now;
    } else {
      fpsRef.current++;
    }
  });

  return { fps };
}
