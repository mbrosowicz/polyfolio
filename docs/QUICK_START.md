# Guia de Integração Rápida - PS1 Shaders

## 🚀 Setup Rápido (5 minutos)

### 1. Copie os arquivos para seu projeto

```
seu-projeto/
├── src/
│   ├── shaders/
│   │   ├── ps1-vertex-jitter.glsl
│   │   └── ps1-fragment-shader.glsl
│   ├── components/
│   │   ├── PS1Material.jsx
│   │   ├── PS1TerrainCanvas.jsx
│   │   └── PS1Demo.jsx
│   ├── utils/
│   │   ├── terrainGenerator.js
│   │   └── posterizationPass.js
│   └── App.jsx
```

### 2. Instale as dependências

```bash
npm install three @react-three/fiber @react-three/drei
```

### 3. Use no seu App.jsx

**Opção A - Demo Completa:**

```jsx
import PS1Demo from './components/PS1Demo';

function App() {
  return <PS1Demo />;
}

export default App;
```

**Opção B - Canvas Customizado:**

```jsx
import PS1TerrainCanvas from './components/PS1TerrainCanvas';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <PS1TerrainCanvas
        gridSize={8}
        wobbleStrength={0.8}
        posterizationEnabled={true}
        posterizationLevels={8}
      />
    </div>
  );
}

export default App;
```

---

## ⚙️ Configuração do Webpack (para .glsl)

Se você estiver usando **Create React App** (está pronto), você precisa ejetar:

```bash
npm run eject
```

Se usar **Vite**, configure em `vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [react(), glsl()],
});
```

Instale o plugin:

```bash
npm install --save-dev vite-plugin-glsl
```

Se usar **Webpack** manualmente, adicione ao `webpack.config.js`:

```javascript
module: {
  rules: [
    {
      test: /\.glsl$/,
      loader: 'raw-loader',
    },
  ];
}
```

Instale:

```bash
npm install --save-dev raw-loader
```

---

## 📋 Próximos Passos

### Adições Recomendadas

1. **Stats de Performance** - adicione `@react-three/drei/Stats`

   ```jsx
   import { Stats } from '@react-three/drei';

   <Canvas>
     <Stats />
     <PS1TerrainScene />
   </Canvas>;
   ```

2. **Controles de Câmera** - já incluído via `OrbitControls`

3. **Otimizações**
   - Use `Suspense` para loading
   - Implemente LOD (Level of Detail) para terreno
   - Use `useMemo` para computações pesadas

### Exemplo Completo Otimizado

```jsx
import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stats } from '@react-three/drei';
import PS1TerrainCanvas from './components/PS1TerrainCanvas';

function App() {
  const terrainConfig = useMemo(
    () => ({
      gridSize: 8,
      wobbleStrength: 0.8,
      posterizationEnabled: true,
      posterizationLevels: 8,
    }),
    []
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Suspense fallback={<div>Carregando...</div>}>
        <PS1TerrainCanvas {...terrainConfig} />
        <Stats />
      </Suspense>
    </div>
  );
}

export default App;
```

---

## 🎨 Customizações Comuns

### Mudar Cor do Terreno

```jsx
// Em PS1TerrainCanvas.jsx, linha 70
<PS1Material
  geometry={geometryRef.current}
  color="#ff6600" // ← Mude para qualquer hexadecimal
  gridSize={gridSize}
  wobbleStrength={wobbleStrength}
  lightDir={[1, 1, 0.5]}
/>
```

### Adicionar Múltiplos Terrenos

```jsx
<>
  <PS1Material geometry={terrain1} color="#00ff00" position={[-50, 0, 0]} />
  <PS1Material geometry={terrain2} color="#ff00ff" position={[50, 0, 0]} />
</>
```

### Exportar como Imagem

```jsx
import { useRef } from 'react';

function ExportButton() {
  const canvasRef = useRef();

  const handleExport = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'ps1-terrain.png';
    link.click();
  };

  return <button onClick={handleExport}>Export PNG</button>;
}
```

---

## 🐛 FAQ

**P: Meu shader não compila!**  
R: Verifique:

- Os caminhos dos arquivos `.glsl` estão corretos?
- Seu webpack está configurado para `.glsl`?
- Não há erros de sintaxe GLSL?

**P: O terreno está todo preto!**  
R: Aumente a luz ou certifique-se de que `computeVertexNormals()` foi chamado

**P: Posterization não funciona!**  
R: Verifique se `EffectComposer` foi inicializado antes do primeiro render

**P: Como adicionar física ao terreno?**  
R: Use Cannon.js com `useCannonStore()` ou Three.js raycasting

---

## 📚 Recursos Adicionais

- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber/)
- [Three.js Examples](https://threejs.org/examples/)
- [WebGL Fundamentals](https://webglfundamentals.org/)
- [Shader Toy](https://www.shadertoy.com/)

---

## 💡 Dicas de Performance

| Métrica       | Recomendação              |
| ------------- | ------------------------- |
| Vértices      | < 500k para 60fps         |
| Grid Size     | 4-16 ideal                |
| Posterization | Desativar em mobile       |
| LOD Terrain   | Ativar para > 1M vértices |

---

## 🎯 Próximas Funcionalidades

- [ ] Sistema de LOD automático
- [ ] Texturas e normal maps
- [ ] Física com Cannon.js
- [ ] Multiplayer (com Colyseus)
- [ ] Skybox procedural
- [ ] Efeitos de partículas PS1

---

Divirta-se criando efeitos retro!
