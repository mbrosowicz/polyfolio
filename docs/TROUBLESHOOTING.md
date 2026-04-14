# Troubleshooting & Performance Guide

## 🔧 Problemas Comuns

### ❌ Problema: Shader não compila

**Sintomas:** Erro de compilação, canvas preto ou console errors

**Soluções:**

1. Verifique importação dos shaders:

```jsx
// ❌ Errado
const vertexShader = require('./vertex.glsl');

// ✅ Correto (com vite-plugin-glsl ou raw-loader)
import vertexShader from './vertex.glsl';
```

2. Valide sintaxe GLSL:

```glsl
// ❌ Errado - falta ;
varying vec3 vNormal

// ✅ Correto
varying vec3 vNormal;
```

3. Certifique-se que webpack/vite está configurado:

```bash
# Vite
npm install --save-dev vite-plugin-glsl

# Webpack
npm install --save-dev raw-loader
```

---

### ❌ Problema: Material aparece preto

**Sintomas:** Mesh renderiza mas sem cor/iluminação

**Soluções:**

1. Adicione luz ambiente:

```jsx
<Canvas>
  <ambientLight intensity={0.6} />
  <directionalLight position={[10, 10, 5]} intensity={1} />
</Canvas>
```

2. Verifique se normals estão sendo calculadas:

```javascript
// Deve estar no terrainGenerator.js
geometry.computeVertexNormals();
```

3. Ajuste uniforms de intensidade:

```jsx
<PS1Material
  wobbleStrength={0.5} // Não muito alto
  gridSize={8}
/>
```

---

### ❌ Problema: EffectComposer/Posterization não funciona

**Sintomas:** Post-processing desativado, sem efeito de posterização

**Soluções:**

1. Certifique-se que está instalado:

```bash
npm install three
# three/examples/jsm/postprocessing já vem incluído
```

2. Use versão adequada:

```javascript
// ✅ Correto
const { EffectComposer } = require('three/examples/jsm/postprocessing/EffectComposer');

// ❌ Errado
import EffectComposer from 'three'; // Não existe!
```

3. Inicialize antes do render:

```jsx
useEffect(() => {
  const pass = new PosterizationPass(scene, camera, gl);
  pass.initialize({ levels: 8 });
  // ... resto do código
}, [gl]); // Dependency array!
```

---

### ❌ Problema: Baixa performance / Frame drops

**Sintomas:** FPS cai, camera fica lenta

**Veja seção de Otimização abaixo**

---

## ⚡ Performance Optimization

### 1. Otimizar Terreno

**Problema:** Muitos vértices = GPU sobrecarregada

**Solução:**

```jsx
// ❌ Muito pesado (vários milhões de vértices)
generateProceduralTerrain({
  segmentsX: 512,
  segmentsZ: 512,
});

// ✅ Ótimo
generateProceduralTerrain({
  segmentsX: 64, // Para mobile: 32
  segmentsZ: 64, // Para mobile: 32
  maxElevation: 30,
});
```

**Implementar LOD (Level of Detail):**

```javascript
function generateTerrainWithLOD(camera, terrainBounds) {
  const distanceToCamera = camera.position.distanceTo(terrainBounds.getCenter());

  let segments;
  if (distanceToCamera < 50) {
    segments = 128; // Close-up: detalhado
  } else if (distanceToCamera < 200) {
    segments = 64; // Médio
  } else {
    segments = 32; // Longe: menos detalhes
  }

  return generateProceduralTerrain({
    segmentsX: segments,
    segmentsZ: segments,
  });
}
```

---

### 2. Otimizar Shaders

**Problem:** Vertex shader complexo = processamento lento

**Solução - Mover cálculos para Fragment:**

```glsl
// ❌ Pesado no Vertex (executado millions de vezes)
varying vec3 vColor;
void main() {
  for(int i = 0; i < 100; i++) {
    vColor += complexCalculation();
  }
}

// ✅ Melhor no Fragment (menos pixels que vértices)
varying vec3 vPosition;
void main() {
  vec3 color = complexCalculation(vPosition);
}
```

---

### 3. Otimizar Posterization

**Problema:** Post-processing com múltiplos passes é caro

**Solução:**

```jsx
// ❌ Múltiplos passes (lento)
composer.addPass(renderPass);
composer.addPass(pass1);
composer.addPass(pass2);
composer.addPass(pass3);

// ✅ Um único pass customizado
composer.addPass(renderPass);
composer.addPass(combinedShaderPass); // Tudo em um shader
```

**Desativar em dispositivos pouco potentes:**

```jsx
const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
const posterizationEnabled = !isMobile;

<PS1TerrainCanvas posterizationEnabled={posterizationEnabled} />;
```

---

### 4. Usar Memoization

**Problema:** Recálculos desnecessários

**Solução:**

```jsx
// ❌ Recalcula terreno a cada render
const terrain = generateProceduralTerrain();

// ✅ Memoizado
const terrain = useMemo(() => generateProceduralTerrain({ seed: 42 }), []);
```

---

### 5. Implementar Frustum Culling

**Problema:** Renderiza objetos fora da câmera

**Solução:**

```jsx
// Three.js já faz por padrão, mas você pode otimizar:
mesh.frustumCulled = true; // Default, mas certifique-se
```

---

## 📊 Benchmark

### Performance esperada por configuração:

```
Terreno 64x64 + Vertex Jitter + Posterization:
┌─────────────────────┬─────┬──────────┐
│ Configuração        │ FPS │ Memória  │
├─────────────────────┼─────┼──────────┤
│ Desktop High-end    │ 60  │ 200-300MB│
│ Desktop Mid-range   │ 45  │ 150-200MB│
│ Desktop Low-end     │ 30  │ 100-150MB│
│ Laptop              │ 30  │ 80-120MB │
│ Mobile (Chrome)     │ 20  │ 50-80MB  │
│ Mobile (Safari)     │ 15  │ 40-60MB  │
└─────────────────────┴─────┴──────────┘
```

---

## 🎯 Checklist de Otimização

- [ ] Reduzir segmentos do terreno para mobile
- [ ] Desativar posterization em mobile
- [ ] Usar memoization para geometrias
- [ ] Implementar LOD progressivo
- [ ] Ativar frustum culling
- [ ] Otimizar shaders (cálculos no fragment, não vertex)
- [ ] Lazy load termos pesados
- [ ] Testar com React DevTools Profiler

```jsx
// Profiling
import { Profiler } from 'react';

<Profiler id="PS1Terrain" onRender={onRender}>
  <PS1TerrainCanvas />
</Profiler>;
```

---

## 🔍 Debugging

### Ver estatísticas de GPU:

```jsx
import { Stats } from '@react-three/drei';

<Canvas>
  <Stats /> {/* Shows FPS, geometries, triangles */}
  <PS1TerrainScene />
</Canvas>;
```

### Debug Shader:

```glsl
// Visualiza valores intermediários
void main() {
  // Mude o valor para debug
  gl_FragColor = vec4(vPosition, 1.0); // Ver posições
  // ou
  gl_FragColor = vec4(vNormal, 1.0);  // Ver normais
  // ou
  gl_FragColor = vec4(vUv, 0.0, 1.0); // Ver UVs
}
```

### Console Logs:

```javascript
if (geometry) {
  console.log('Vertex count:', geometry.attributes.position.count);
  console.log('Triangle count:', geometry.attributes.position.count / 3);
  console.log('Bounding box:', geometry.boundingBox);
}
```

---

## 📚 Recursos Avançados

- [Three.js Performance Tips](https://threejs.org/docs/#manual/en/introduction/PerformanceTips)
- [WebGL Performance](https://www.khronos.org/webgl/wiki/HandlingHighDPI)
- [React Three Fiber Performance](https://docs.pmnd.rs/react-three-fiber/advanced/performance)
- [Shader Optimization](https://www.lighthouse3d.com/tutorials/glsl-core-tutorial/)

---

## 💡 Pro Tips

1. **Use DevTools:** Chrome DevTools > Performance > Record
2. **Perfis diferentes:** Crie perfis para mobile, tablet, desktop
3. **Test real devices:** Chrome Remote Debugging
4. **Incremental improvement:** Otimize um problema por vez

---

Nível de help necessário aumentou? Abra uma issue ou contribua com otimizações! 🚀
