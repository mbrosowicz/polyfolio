import type { PortfolioProjectNode } from '@/types/index';

export const defaultProjectNodes: PortfolioProjectNode[] = [
  {
    id: 'renderer-pipeline',
    title: 'PS1 Rendering Pipeline',
    summary: 'Custom GLSL pipeline with vertex jitter and posterization controls.',
    position: [-22, 0, -16],
    icon: 'disc',
    accentColor: '#55ff88',
    stack: ['React', 'Three.js', 'R3F', 'GLSL'],
  },
  {
    id: 'terrain-lab',
    title: 'Procedural Terrain Lab',
    summary: 'Noise-driven low-poly terrain generation with tunable presets.',
    position: [20, 0, -12],
    icon: 'memory-card',
    accentColor: '#7ef7ff',
    stack: ['TypeScript', 'Three.js', 'Vitest'],
  },
  {
    id: 'post-processing',
    title: 'Retro Post Processing',
    summary: 'Posterization + dithering stack designed for nostalgic color palettes.',
    position: [-16, 0, 18],
    icon: 'controller',
    accentColor: '#ffde73',
    stack: ['ShaderPass', 'EffectComposer', 'R3F'],
  },
  {
    id: 'portfolio-engine',
    title: 'Portfolio World Engine',
    summary: 'Reusable scene architecture for expandable interactive project maps.',
    position: [18, 0, 16],
    icon: 'tower',
    accentColor: '#ff8fb1',
    stack: ['React', 'TypeScript', 'CSS Modules'],
  },
];
