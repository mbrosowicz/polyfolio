# 🎮 Polyfolio - PS1 Shader Portfolio

Portfolio web com efeitos de PlayStation 1 usando React Three Fiber, TypeScript e shaders customizados.

## ✨ Features

- 🎨 **Vertex Jitter Shader** - Efeito wobble característico do PS1
- 🏞️ **Terreno Procedural** - Geração dinâmica com múltiplas oitavas
- 🎮 **Post-Processing** - Posterização com até 256 cores
- 📱 **Responsivo** - Funciona em desktop e mobile
- 🧪 **Bem Testado** - Testes unitários com Vitest
- 🔒 **Type-Safe** - TypeScript strict mode
- 🎯 **Code Quality** - ESLint, Prettier, Husky

## 🚀 Quick Start

### Requisitos

- Node.js >= 18.0.0
- npm >= 9.0.0

### Instalação

```bash
# Clone o repositório
git clone <seu-repo>
cd polyfolio

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O projeto abrirá automaticamente em `http://localhost:5173`

## 📋 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev           # Inicia servidor Vite com hot reload

# Build
npm run build         # Build para produção (type-check + vite build)
npm run preview       # Preview do build em desenvolvimento

# Qualidade de Código
npm run type-check    # Verifica tipos TypeScript
npm run lint          # Executar ESLint
npm run lint:fix      # Fix automático do ESLint
npm run format        # Format com Prettier
npm run format:check  # Check format sem modificar

# Testes
npm run test          # Rodar testes (Vitest)
npm run test:ui       # UI interativa dos testes
npm run test:coverage # Gerar relatório de cobertura

# Git Hooks (automático)
npm run prepare       # Instalar Husky hooks
```

## 📁 Estrutura do Projeto

```
polyfolio/
├── src/
│   ├── components/          # Componentes React
│   │   ├── PS1Material.tsx  # Material customizado
│   │   ├── PS1TerrainCanvas.tsx
│   │   ├── PS1Demo.tsx      # Demo interativa
│   │   └── PS1Demo.module.css
│   ├── shaders/             # Shaders GLSL
│   │   ├── ps1VertexJitter.glsl
│   │   └── ps1Fragment.glsl
│   ├── utils/               # Utilidades e lógica
│   │   ├── terrainGenerator.ts
│   │   ├── posterizationPass.ts
│   │   └── env.ts
│   ├── hooks/               # Hooks customizados
│   │   └── usePS1Effects.ts
│   ├── types/               # TypeScript types
│   │   ├── index.ts
│   │   └── globals.d.ts
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── public/                  # Assets estáticos
├── index.html              # HTML principal
├── vite.config.ts          # Config Vite
├── vitest.config.ts        # Config Vitest
├── tsconfig.json           # Config TypeScript
├── .eslintrc.json          # Config ESLint
├── .prettierrc              # Config Prettier
├── .editorconfig            # Config EditorConfig
└── package.json            # Dependências
```

## 🎮 Como Usar

### Demo Completa

```tsx
import PS1Demo from '@components/PS1Demo';

function App() {
  return <PS1Demo />;
}
```

### Canvas Customizado

```tsx
import PS1TerrainCanvas from '@components/PS1TerrainCanvas';

<PS1TerrainCanvas
  gridSize={8}
  wobbleStrength={0.8}
  posterizationEnabled={true}
  posterizationLevels={8}
  smoothTerrain={true}
/>;
```

### Material Com Geometria Customizada

```tsx
import PS1Material from '@components/PS1Material';
import { generateProceduralTerrain } from '@utils/terrainGenerator';

const geometry = generateProceduralTerrain({
  width: 200,
  height: 200,
  maxElevation: 30,
  seed: 42,
});

<Canvas>
  <PS1Material geometry={geometry} color="#ff6600" gridSize={8} wobbleStrength={0.5} />
</Canvas>;
```

## ⚙️ Configuração de Desenvolvimento

### Git Hooks (Husky)

O projeto usa Husky para executar verificações antes de commits:

- **pre-commit**: Lint-staged (ESLint + Prettier)
- **pre-push**: Type checking

### Environment Variables

Crie um arquivo `.env.local` baseado em `.env.example`:

```env
VITE_APP_TITLE=Polyfolio
VITE_API_URL=http://localhost:3000/api
VITE_DEBUG=true
```

### IDE Setup (VS Code)

**Extensões recomendadas:**

- ESLint
- Prettier - Code formatter
- TypeScript Vue Plugin
- Three.js Extension Pack

**.vscode/settings.json**:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

## 📊 Performance

### Recomendações por Plataforma

| Plataforma | gridSize | segmentosX/Z | posterization |
| ---------- | -------- | ------------ | ------------- |
| Desktop    | 8        | 64           | Ativado       |
| Laptop     | 12       | 32           | Ativado       |
| Mobile     | 16       | 16           | Desativado    |

## 🧪 Testes

```bash
# Rodar todos os testes
npm run test

# Modo watch
npm run test -- --watch

# UI interativa
npm run test:ui

# Cobertura
npm run test:coverage
```

## 🔧 Troubleshooting

### Erro: "Cannot find module vite-plugin-glsl"

```bash
npm install --save-dev vite-plugin-glsl
```

### Shader não renderiza

1. Verifique os caminhos dos .glsl em `tsconfig.json`
2. Certifique-se de que `vite-plugin-glsl` está configurado
3. Verifique erros de sintaxe GLSL no console

### Build fails com "Cannot find type"

```bash
npm run type-check
```

## 📚 Documentação Adicional

- [PS1_SHADERS_README.md](./PS1_SHADERS_README.md) - Guia completo de shaders
- [QUICK_START.md](./QUICK_START.md) - Setup rápido
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Problemas comuns

## 🚢 Deploy

### Vercel

```bash
# Automático com Git
# Vercel detecta automaticamente Vite
```

### Netlify

```bash
npm run build
# Deploy da pasta 'dist'
```

### GitHub Pages

```bash
# Configure no package.json
"build": "tsc && vite build --base=/polyfolio/"
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 License

MIT - Veja [LICENSE](LICENSE) para detalhes

## 🙏 Agradecimentos

- [Three.js](https://threejs.org/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [Vite](https://vitejs.dev/)

---

**Status:** Em desenvolvimento ✨

Feito com ❤️ para portfolio
