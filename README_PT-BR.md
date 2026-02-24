# 🎮 PS1 Vertex Jitter + Posterization - Complete Implementation

Implementação profissional completa de shaders PlayStation 1 para React Three Fiber com terreno procedural e post-processing.

---

## 📦 O que foi criado

### Arquivos Principais

```
polyfolio/
├── 📄 Shaders GLSL
│   ├── ps1-vertex-jitter.glsl           # Vertex shader com snap de grade
│   └── ps1-fragment-shader.glsl          # Fragment shader com iluminação
│
├── ⚛️ Componentes React Three Fiber
│   ├── PS1Material.jsx                   # Wrapper customizado do shader
│   ├── PS1TerrainCanvas.jsx              # Canvas com terreno completo
│   └── PS1Demo.jsx                       # Demo interativa com controles
│
├── 🛠️ Utilitários
│   ├── terrainGenerator.js               # Geração procedural de terreno
│   ├── posterizationPass.js              # Post-processing com posterização
│   └── PS1_ADVANCED_EXAMPLES.js          # Exemplos avançados e hooks
│
├── 📚 Configuração & Build
│   ├── package.json                      # Dependências e scripts
│   ├── vite.config.js                    # Configuração Vite (recomendado)
│   ├── webpack.config.js                 # Alternativa: Webpack
│   ├── types.d.ts                        # Tipagens TypeScript opcionais
│   └── ps1-shaders.test.js               # Testes unitários
│
└── 📖 Documentação
    ├── README.md                         # Este arquivo
    ├── PS1_SHADERS_README.md             # Guia completo de uso
    ├── QUICK_START.md                    # Setup rápido (5 minutos)
    └── TROUBLESHOOTING.md                # Solução de problemas
```

---

## 🚀 Quick Start (5 minutos)

### 1. Instale dependências

```bash
npm install three @react-three/fiber @react-three/drei
npm install --save-dev vite-plugin-glsl
```

### 2. Use no seu App.jsx

```jsx
import PS1Demo from './PS1Demo';

function App() {
  return <PS1Demo />;
}

export default App;
```

### 3. Pronto!

Você agora tem um terreno PS1 interativo com:

- ✨ Vertex jitter (wobble) animado
- 🏞️ Terreno procedural low-poly
- 🎨 Posterização de 256 cores
- 🎮 Controles de câmera (OrbitControls)

---

## 📋 Características Implementadas

### ✅ Vertex Jitter Shader

- Snapeia vértices baseado em resolução da tela
- Parâmetro `gridSize` para controlar intensidade
- Parâmetro `wobbleStrength` para controlar tremor
- Iluminação Lambertiana integrada

### ✅ Terreno Procedural

- `generateProceduralTerrain()` - Rápido e simples
- `generateSmootherTerrain()` - Perlin-like com múltiplas oitavas
- Suporte a seed para reproducibilidade
- Cálculo automático de normais

### ✅ Post-Processing Posterization

- `PosterizationPass` com EffectComposer
- Reduz para N cores (8 níveis = ~256 cores)
- Dithering Bayer 4x4 opcional para transições suaves
- Totalmente customizável em tempo real

### ✅ Componentes R3F

- `PS1Material` - Wrapper reutilizável
- `PS1TerrainCanvas` - Canvas pronto para usar
- `PS1Demo` - Demo funcional com painel de controles

---

## 📊 Parâmetros Principais

### Vertex Jitter

| Parâmetro      | Padrão | Intervalo | Efeito                           |
| -------------- | ------ | --------- | -------------------------------- |
| gridSize       | 8      | 2-32      | Tamanho da grade (menor = suave) |
| wobbleStrength | 0.5    | 0-2       | Intensidade do tremor            |

### Terreno

| Parâmetro    | Padrão | Intervalo | Efeito             |
| ------------ | ------ | --------- | ------------------ |
| segmentsX/Z  | 32     | 8-256     | Resolução da malha |
| maxElevation | 20     | 0-100     | Altura máxima      |
| octaves      | 4      | 1-8       | Camadas de ruído   |

### Posterização

| Parâmetro | Padrão | Intervalo  | Efeito                       |
| --------- | ------ | ---------- | ---------------------------- |
| levels    | 8      | 2-16       | Níveis/canal (8 = 512 cores) |
| dithering | false  | true/false | Ativa dithering Bayer        |

---

## 🎯 Casos de Uso

### Jogos Retro

```jsx
<PS1TerrainCanvas gridSize={16} wobbleStrength={1.2} posterizationLevels={6} dithering={true} />
```

### Aplicações com efeito suave

```jsx
<PS1TerrainCanvas gridSize={4} wobbleStrength={0.3} posterizationLevels={12} dithering={false} />
```

### Performance crítica (mobile)

```jsx
<PS1TerrainCanvas terrainWidth={100} posterizationEnabled={false} smoothTerrain={false} />
```

---

## 💻 Requisitos Técnicos

- **Node.js:** ≥ 16.0.0
- **npm:** ≥ 8.0.0
- **React:** ≥ 18.0.0
- **Three.js:** r128 ou superior
- **Navegador:** WebGL 1.0+ (qualquer navegador moderno)

---

## 📖 Documentação Completa

| Arquivo                                          | Conteúdo                                  |
| ------------------------------------------------ | ----------------------------------------- |
| [PS1_SHADERS_README.md](./PS1_SHADERS_README.md) | Guia completo, customizações, referências |
| [QUICK_START.md](./QUICK_START.md)               | Setup inicial, exemplos básicos, dicas    |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)       | Problemas comuns, otimização, debugging   |
| [types.d.ts](./types.d.ts)                       | Tipagens TypeScript (se usar TS)          |

---

## 🔧 Customizações Comuns

### Mudar cor do terreno

```jsx
<PS1Material color="#ff6600" />
```

### Adicionar animação ao shader

```javascript
// No PS1_ADVANCED_EXAMPLES.js
const { vertexShader, fragmentShader } = AnimatedVertexJitterMaterial();
```

### Gerar terreno com cores por altura

```javascript
const terrain = generateColoredProceduralTerrain({
  width: 200,
  maxElevation: 30,
});
```

---

## ⚡ Performance

### Recomendações por plataforma

**Desktop (60fps)**

- segmentsX/Z: 128
- gridSize: 8
- posterizationLevels: 8

**Mobile (30fps)**

- segmentsX/Z: 32
- gridSize: 16
- posterizationEnabled: false

**Très baixa performance**

- Implementar LOD (veja TROUBLESHOOTING.md)
- Reduzir grid size
- Desativar texturas

---

## 🧪 Testes

```bash
# Rodar testes
npm test

# UI com Vitest
npm run test:ui

# Type checking TypeScript
npm run type-check
```

---

## 📦 Buildando para Produção

### Vite (Recomendado)

```bash
npm run build
npm run preview
```

### Webpack

```bash
npm run build -- --mode production
```

---

## 🎨 Exemplos de Uso Avançados

### 1. Componente com animação

```jsx
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

const AnimatedPS1Mesh = () => {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current?.material?.uniforms) {
      meshRef.current.material.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return <PS1Material ref={meshRef} />;
};
```

### 2. Sistema de partículas PS1

```jsx
const ParticleSystem = () => {
  const particles = useMemo(() => generateProceduralTerrain({ segmentsX: 64, segmentsZ: 64 }), []);

  return <PS1Material geometry={particles} />;
};
```

### 3. Terreno carregando dinamicamente

```jsx
const DynamicTerrain = ({ seed }) => {
  const terrain = useMemo(() => generateProceduralTerrain({ seed }), [seed]);

  return <PS1Material geometry={terrain} />;
};
```

---

## 🐛 Suporte e Contribuições

Encontrou um bug ou tem uma sugestão?

- Verifique [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- Leia [PS1_SHADERS_README.md](./PS1_SHADERS_README.md)
- Abra uma issue no GitHub
- Faça um pull request com melhorias!

---

## 📄 License

MIT - Use livremente em seus projetos! Crédito é apreciado mas não obrigatório.

---

## 🎓 Aprendizado

Este projeto demonstra:

- Custom shaders com Three.js
- React Three Fiber advanced patterns
- GLSL vertex/fragment shaders
- Procedural generation com JavaScript
- Post-processing com EffectComposer
- Performance optimization técnicas
- TypeScript integration opcional

---

## 💡 Próximas Ideias

- [ ] Sistema de LOD automático
- [ ] Texturas e parallax mapping
- [ ] Física com Cannon.js
- [ ] Multiplayer (Colyseus)
- [ ] Skybox procedural PS1
- [ ] Animação de personagens low-poly
- [ ] Efeitos de chuva/neblina
- [ ] Sistema de som (Three.js Audio)

---

**Versão:** 1.0.0  
**Atualizado:** 2025  
**Status:** Pronto para produção ✅

Divirta-se criando experiências retro em WebGL! 🎮✨
