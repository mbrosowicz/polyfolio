# PS1 Vertex Jitter + Posterization Effect

Implementação completa de shaders e componentes React Three Fiber para simular o visual característico do PlayStation 1, incluindo:

- ✨ **Vertex Jitter Shader**: Snapeia vértices para uma grade baseada em resolução (efeito wobble PS1)
- 🏞️ **Terreno Procedural Low-Poly**: Geração de geometria com elevações aleatórias
- 🎨 **Post-Processing Posterization**: Redução de paleta de cores (256 cores)
- 🎮 **Componente R3F Completo**: Canvas interativo com controles

## 📁 Arquivos

### Shaders

- **ps1-vertex-jitter.glsl**: Vertex shader com snap de grade
- **ps1-fragment-shader.glsl**: Fragment shader com iluminação Lambertiana

### Componentes React

- **PS1Material.jsx**: Wrapper do shader material para R3F
- **PS1TerrainCanvas.jsx**: Canvas com terreno e pós-processamento
- **PS1Demo.jsx**: Demo interativa com painel de controles

### Geração de Terreno

- **terrainGenerator.js**: Funções para criar geometria procedural

### Pós-Processamento

- **posterizationPass.js**: Shaders e classe para posterization com EffectComposer

## 🚀 Como Usar

### 1. Instalação de Dependências

```bash
npm install three @react-three/fiber @react-three/drei
```

### 2. Usar o Demo Completo

```jsx
import PS1Demo from './PS1Demo';

function App() {
  return <PS1Demo />;
}
```

### 3. Usar Componentes Individuais

#### Apenas o Canvas com Terreno

```jsx
import PS1TerrainCanvas from './PS1TerrainCanvas';

function MyScene() {
  return (
    <PS1TerrainCanvas
      gridSize={8}
      wobbleStrength={0.8}
      posterizationEnabled={true}
      posterizationLevels={8}
      dithering={false}
    />
  );
}
```

#### Usar o Material PS1 com Geometria Customizada

```jsx
import { Canvas } from '@react-three/fiber';
import PS1Material from './PS1Material';
import * as THREE from 'three';

function CustomMesh() {
  // Cria sua própria geometria
  const geometry = new THREE.BoxGeometry(10, 10, 10, 8, 8, 8);

  return (
    <Canvas>
      <PS1Material
        geometry={geometry}
        color="#ff00ff"
        gridSize={8}
        wobbleStrength={0.5}
        lightDir={[1, 1, 0.5]}
      />
    </Canvas>
  );
}
```

#### Gerar Terreno Customizado

```jsx
import { generateProceduralTerrain, generateSmootherTerrain } from './terrainGenerator';
import * as THREE from 'three';

// Terreno simples e rápido
const terrain = generateProceduralTerrain({
  width: 200,
  height: 200,
  segmentsX: 64,
  segmentsZ: 64,
  maxElevation: 30,
  seed: 42,
});

// Terreno mais suave com múltiplas oitavas
const smoothTerrain = generateSmootherTerrain({
  width: 200,
  height: 200,
  segmentsX: 64,
  segmentsZ: 64,
  maxElevation: 30,
  seed: 42,
  octaves: 4,
  persistence: 0.6,
});

// Usar em malha
<mesh geometry={terrain}>
  <meshPhongMaterial color="green" />
</mesh>;
```

## 🎮 Entendendo os Parâmetros

### Vertex Jitter (PS1Material)

| Parâmetro        | Padrão      | O que faz                                                              |
| ---------------- | ----------- | ---------------------------------------------------------------------- |
| `gridSize`       | 8           | Tamanho da grade de snap em pixels. Menor = suave, Maior = mais wobble |
| `wobbleStrength` | 0.5         | Intensidade do tremor. 0 = sem efeito, 2+ = muito tremante             |
| `color`          | '#ff00ff'   | Cor do material (hex ou THREE.Color)                                   |
| `lightDir`       | [1, 1, 0.5] | Direção da luz para iluminação Lambertiana                             |

### Geração de Terreno

| Parâmetro                | Padrão | O que faz                                                     |
| ------------------------ | ------ | ------------------------------------------------------------- |
| `width`, `height`        | 100    | Dimensões do terreno em unidades                              |
| `segmentsX`, `segmentsZ` | 32     | Resolução da malha (mais = mais detalhes)                     |
| `maxElevation`           | 20     | Altura máxima das montanhas                                   |
| `seed`                   | 0      | Seed para reprodutibilidade                                   |
| `octaves`                | 4      | Só para `generateSmootherTerrain`: número de oitavas de ruído |
| `persistence`            | 0.5    | Contribuição de cada oitava                                   |

### Posterization

| Parâmetro              | Padrão | O que faz                                           |
| ---------------------- | ------ | --------------------------------------------------- |
| `posterizationEnabled` | true   | Ativar/desativar pós-processamento                  |
| `posterizationLevels`  | 8      | Níveis por canal (8 = 8³ = 512 cores ≈ 256)         |
| `dithering`            | false  | Aplicar dithering Bayer para transições mais suaves |

## 🔧 Customizando os Shaders

### Modificar o Vertex Shader

Edite `ps1-vertex-jitter.glsl` para:

**Adicionar mais wobble procedural:**

```glsl
vec3 wobble = sin(position.y * 0.1 + time) * uWobbleStrength;
```

**Adicionar animação:**

```glsl
uniform float uTime;
vec3 wobble = (position - snappedPosition) * sin(uTime) * uWobbleStrength;
```

### Modificar o Fragment Shader

Edite `ps1-fragment-shader.glsl` para:

**Adicionar textura:**

```glsl
uniform sampler2D uTexture;
vec3 texColor = texture2D(uTexture, vUv).rgb;
vec3 finalColor = texColor * diffuse;
```

**Adicionar outlines/cel shading:**

```glsl
float edge = length(fwidth(normal)) * 0.5;
finalColor = mix(uColor * 0.2, uColor * diffuse, 1.0 - edge);
```

## 📊 Exemplos de Valores

### Para máximo efeito PS1 autêntico:

```jsx
<PS1TerrainCanvas
  gridSize={16}
  wobbleStrength={1.2}
  posterizationLevels={6} // ~216 cores
  dithering={true}
/>
```

### Para efeito mais sutil:

```jsx
<PS1TerrainCanvas
  gridSize={4}
  wobbleStrength={0.3}
  posterizationLevels={12} // ~1728 cores
  dithering={false}
/>
```

## ⚡ Performance

- **gridSize alto + wobbleStrength alto**: Mais visual, menos performance
- **Terreno com 128x128 segmentos**: Pesado, use 64x64 para mobile
- **Posterization + Dithering**: Adiciona overhead, considere desabilitar em mobile

## 🐛 Troubleshooting

### O shader não está sendo aplicado

- Certifique-se de que os caminhos para os arquivos `.glsl` estão corretos
- Verifique se o webpack está configurado para importar `.glsl` como strings

### Posterization não funciona

- Verifique se o `EffectComposer` foi inicializado antes do render
- Certifique-se de que `three/examples/jsm` está instalado

### Terreno fica preto

- Aumente a intensidade da luz ambient
- Verifique se a normal está sendo calculada corretamente

## 📚 Referências

- [Three.js ShaderMaterial](https://threejs.org/docs/#api/en/materials/ShaderMaterial)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [EffectComposer/PostProcessing](https://threejs.org/docs/#examples/en/postprocessing/EffectComposer)
- [PlayStation 1 Graphics](https://en.wikipedia.org/wiki/PlayStation_graphics)

## 📄 License

Use livremente! Crédito apreciado mas não obrigatório.
