/**
 * TypeScript Definitions para PS1 Shaders
 *
 * Use este arquivo se estiver trabalhando com TypeScript
 * Copie as definições para seus arquivos .d.ts ou use junto com seu tsconfig
 */

declare module '*.glsl' {
  const shader: string;
  export default shader;
}

// ===== Tipos para Configuração =====

export interface PS1MaterialProps {
  /** Geometria THREE.js para renderizar */
  geometry: THREE.BufferGeometry;
  /** Cor do material em hex string ou número */
  color?: string | number;
  /** Tamanho da grade de snap em pixels */
  gridSize?: number;
  /** Intensidade do efeito de wobble */
  wobbleStrength?: number;
  /** Direção da luz [x, y, z] */
  lightDir?: [number, number, number];
  /** Propriedades padrão de mesh */
  [key: string]: any;
}

export interface TerrainGeneratorOptions {
  /** Largura do terreno */
  width?: number;
  /** Altura do terreno */
  height?: number;
  /** Segmentos no eixo X */
  segmentsX?: number;
  /** Segmentos no eixo Z */
  segmentsZ?: number;
  /** Elevação máxima */
  maxElevation?: number;
  /** Elevação mínima */
  minElevation?: number;
  /** Seed para reproducibilidade */
  seed?: number;
}

export interface SmoothTerrainOptions extends TerrainGeneratorOptions {
  /** Número de oitavas de ruído */
  octaves?: number;
  /** Persistência de cada oitava */
  persistence?: number;
}

export interface PosterizationOptions {
  /** Ativar posterização */
  enabled?: boolean;
  /** Número de níveis por canal */
  levels?: number;
  /** Ativar dithering Bayer */
  dithering?: boolean;
  /** Força do dithering */
  ditherStrength?: number;
}

export interface PS1TerrainCanvasProps extends PosterizationOptions {
  /** Largura do terreno em unidades */
  terrainWidth?: number;
  /** Altura do terreno em unidades */
  terrainHeight?: number;
  /** Tamanho da grade de snap do vertex shader */
  gridSize?: number;
  /** Força do wobble do vertex shader */
  wobbleStrength?: number;
  /** Usar terreno com Perlin-like noise */
  smoothTerrain?: boolean;
}

// ===== Tipos para Shaders =====

export interface ShaderUniforms {
  [key: string]: THREE.IUniform;
}

export interface ShaderConfig {
  vertexShader: string;
  fragmentShader: string;
  uniforms: ShaderUniforms;
  side?: THREE.Side;
}

// ===== Tipos para EffectComposer =====

export class PosterizationPass {
  constructor(scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer);

  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.WebGLRenderer;
  composer: THREE.EffectComposer | null;
  posterPass: THREE.ShaderPass | null;

  initialize(options?: PosterizationOptions): THREE.EffectComposer;
  render(): void;
  setLevels(levels: number): void;
  setDitherStrength(strength: number): void;
  setSize(width: number, height: number): void;
  dispose(): void;
}

// ===== Tipos para Utilidades =====

export interface AnimationConfig {
  fromColor: string | number;
  toColor: string | number;
  duration: number;
  onUpdate: (color: THREE.Color) => void;
}

export interface PS1DebugStats {
  vertexCount: number;
  triangleCount: number;
  boundingBox: {
    min: [string, string, string];
    max: [string, string, string];
  };
}

export interface PS1EffectsOptions {
  gridSize?: number;
  wobbleStrength?: number;
  posterizationLevels?: number;
  enableAnimation?: boolean;
}

// ===== Funções Exportadas =====

export function generateProceduralTerrain(options?: TerrainGeneratorOptions): THREE.BufferGeometry;

export function generateSmootherTerrain(options?: SmoothTerrainOptions): THREE.BufferGeometry;

export function generateColoredProceduralTerrain(
  options?: TerrainGeneratorOptions
): THREE.BufferGeometry;

export const PS1Utils: {
  createPS1Material(config: ShaderConfig): THREE.ShaderMaterial;
  lerp(start: number, end: number, t: number): number;
  animateColor(
    fromColor: string | number,
    toColor: string | number,
    duration: number,
    onUpdate: (color: THREE.Color) => void
  ): void;
  getTerrainHeightAtPoint(
    geometry: THREE.BufferGeometry,
    x: number,
    z: number,
    gridWidth: number,
    gridHeight: number
  ): number;
};

// ===== React Hooks =====

export function usePS1Effects(options?: PS1EffectsOptions): {
  time: number;
  gridSize: number;
  wobbleStrength: number;
  posterizationLevels: number;
  uniforms: ShaderUniforms;
};

// ===== React Components =====

export const PS1Material: React.ForwardRefExoticComponent<
  PS1MaterialProps & React.RefAttributes<THREE.Mesh>
>;

export const PS1TerrainCanvas: React.FC<PS1TerrainCanvasProps>;

export const PS1Demo: React.FC;

export const PS1DebugPanel: React.FC<{ geometry: THREE.BufferGeometry }>;

export default {};
