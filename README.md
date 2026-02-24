# 🎮 Polyfolio

> Um portfolio web moderno com efeitos visuais de PlayStation 1, construído com **React**, **Three.js**, **TypeScript** e **shaders GLSL customizados**. Production-ready com testes automatizados, code quality tools e CI/CD.

[![CI/CD](https://github.com/mbrosowicz/polyfolio/workflows/CI%2FCD/badge.svg)](https://github.com/mbrosowicz/polyfolio/actions)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18.2+-61dafb?logo=react&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-r156-black?logo=threedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0+-646cff?logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-1.1+-6e9f18?logo=vitest&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-8.56+-4b32c3?logo=eslint&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🎨 Visual Effects

- **PS1 Vertex Jitter Shader** - Efeito wobble autêntico com grid snapping
- **Procedural Terrain** - Geração procedural com múltiplas oitavas Perlin-like
- **Posterization Post-Processing** - Redução de paleta com até 256 cores
- **Dithering Effect** - Suavização com matriz Bayer de 4x4

### 🔧 Developer Experience

- **Type-Safe** - 100% TypeScript em strict mode, zero `any` types
- **Tested** - Vitest com coverage reporting, setup para React Testing Library
- **Code Quality** - ESLint (strict), Prettier, EditorConfig
- **Git Workflows** - Husky pre-commit/pre-push hooks, lint-staged
- **Environment Config** - Variáveis tipadas e validadas

### 🚀 Production Ready

- **Build Optimization** - Vite com tree-shaking, code splitting, minification
- **CI/CD Pipeline** - GitHub Actions com matrix testing (Node 18/20)
- **Documentation** - Guides de setup, testing, contributing
- **Module System** - Path aliases, CSS Modules, GLSL imports

### 📱 Responsive & Accessible

- **Mobile Friendly** - Canvas responsivo com OrbitControls
- **Performance** - FPS monitor, efficient render calls
- **Scalable** - Componentes modular e composable

## 🎯 Quick Start

### Pré-requisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### Instalação (60 segundos)

```bash
# 1. Clone repositório
git clone https://github.com/mbrosowicz/polyfolio.git
cd polyfolio

# 2. Execute setup automático (recomendado)
# Windows:
setup.bat

# macOS/Linux:
chmod +x setup.sh && ./setup.sh

# Ou manualmente:
npm install
npm run prepare          # Configura Husky
npm run type-check       # Valida tipos
npm run lint             # Executa ESLint

# 3. Inicie o servidor
npm run dev
```

Abrirá em: **http://localhost:5173** com hot reload automático

## 📖 Documentação Completa

### Para Iniciantes

1. **[QUICK_START.md](QUICK_START.md)** - Exemplos práticos (5 min)
2. **[SETUP.md](SETUP.md)** - Guia passo-a-passo de instalação
3. **[DOCS_INDEX.md](DOCS_INDEX.md)** - Índice de navegação

### Para Desenvolvedores

- **[TESTING.md](TESTING.md)** ⭐ **NEW** - Estrutura de testes e como escrever testes
- **[TYPESCRIPT_SETUP.md](TYPESCRIPT_SETUP.md)** - TypeScript, ESLint, Prettier
- **[COMPONENT_TEMPLATE.md](COMPONENT_TEMPLATE.md)** - Template para novos componentes
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Diretrizes de contribuição

### Para 3D Artists

- **[PS1_SHADERS_README.md](PS1_SHADERS_README.md)** - Customização de shaders
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Problemas comuns e soluções

## 📁 Arquitetura do Projeto

```
polyfolio/
├── src/
│   ├── components/               # React components
│   │   ├── PS1Material.tsx       # Shader material wrapper
│   │   ├── PS1TerrainCanvas.tsx  # Canvas com terreno
│   │   ├── PS1Demo.tsx           # Demo interativa
│   │   └── PS1Demo.module.css
│   │
│   ├── utils/                    # Utilities & logic
│   │   ├── terrainGenerator.ts   # Geração procedural
│   │   ├── posterizationPass.ts  # Post-processing
│   │   ├── env.ts               # Variáveis de ambiente
│   │   └── *.test.ts            # Unit tests
│   │
│   ├── hooks/                    # Custom React Hooks
│   │   ├── usePS1Effects.ts      # PS1 effects hook
│   │   └── *.test.ts
│   │
│   ├── shaders/                  # GLSL Shaders
│   │   ├── ps1VertexJitter.glsl  # Vertex jitter
│   │   └── ps1Fragment.glsl      # Lambertian lighting
│   │
│   ├── types/                    # TypeScript types
│   │   ├── index.ts              # Type definitions
│   │   ├── modules.d.ts          # Module declarations
│   │   ├── globals.d.ts          # Global types
│   │   └── *.test.ts
│   │
│   ├── vite-env.d.ts            # Vite environment types
│   ├── setup.test.ts            # Test setup
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
│
├── .github/workflows/
│   └── ci.yml                    # CI/CD pipeline (lint, test, build)
│
├── .husky/
│   ├── pre-commit               # Lint-staged
│   └── pre-push                 # Type check
│
├── public/                       # Static assets
├── index.html
├── tsconfig.json                # TypeScript config (strict mode)
├── vitest.config.ts             # Test config com coverage
├── vite.config.ts               # Build config
├── .eslintrc.json              # ESLint rules
├── .prettierrc                  # Code formatting
├── .editorconfig                # Editor consistency
├── package.json
└── Docs/
    ├── README.md                (this file)
    ├── SETUP.md
    ├── TESTING.md               ⭐ NEW
    ├── TYPESCRIPT_SETUP.md
    ├── CONTRIBUTING.md
    └── ...outros docs
```

## 🛠️ Scripts Disponíveis

### Desenvolvimento

```bash
npm run dev              # ▶️  Vite dev server (http://localhost:5173)
npm run build            # 🏗️  Build para produção
npm run preview          # 👁️  Preview da build
```

### Code Quality

```bash
npm run type-check       # ✅ TypeScript strict checking
npm run lint             # 🔍 ESLint checking
npm run lint:fix         # 🔧 ESLint auto-fix
npm run format           # ✨ Prettier format
npm run format:check     # ✨ Prettier check (sem modificar)
```

### Testing ⭐ NEW

```bash
npm run test             # 🧪 Rodar testes (watch mode)
npm run test:ui          # 🎨 Vitest UI (http://localhost:51204)
npm run test:coverage    # 📊 Coverage report (veja coverage/index.html)
```

### Git & Husky

```bash
npm run prepare          # 🔐 Setup Husky hooks
npm run lint-staged      # 📋 Lint staged files (roda automaticamente)
```

## ⚙️ Configuração Técnica

### TypeScript

- **target**: ES2020
- **strict**: true (todas as checks ativadas)
- **noUnusedLocals**: true
- **noFallthroughCasesInSwitch**: true
- **Path aliases**: `@/*`, `@components/*`, `@utils/*`, etc

### ESLint

- **react/recommended** + **react-hooks/recommended**
- **@typescript-eslint/recommended-requiring-type-checking**
- Zero `any` types (ESLint rule: `@typescript-eslint/no-explicit-any`)
- Integrado com Prettier (sem conflitos)

### Testing ⭐ NEW

- **Framework**: Vitest (10x faster than Jest)
- **Environment**: happy-dom (rápido e light)
- **Coverage**: v8 (lcov, html, json reporters)
- **React Testing**: @testing-library/react + @testing-library/jest-dom
- **Veja**: [TESTING.md](TESTING.md) para guia completo

### Build & Optimization

- **Bundler**: Vite (rollup-based)
- **Code splitting**: three, @react-three/fiber separados
- **Minification**: Terser
- **GLSL Support**: vite-plugin-glsl (raw string imports)

## 📊 Performance

### Metrics

- **Dev Server Start**: < 500ms
- **Build Time**: < 10s (production)
- **Bundle Size**: ~300KB (gzipped)
- **FPS**: 60fps (com terreno 64x64)

### Optimization Strategies

1. Code splitting de dependências pesadas
2. Lazy loading de componentes R3F
3. Memoization com `useMemo`, `useCallback`
4. Efficient shader uniforms updates
5. Geometry caching

## 🔐 Code Quality Gates

```bash
# Pre-commit (automatic)
✅ ESLint + Prettier
✅ Type checking

# Pre-push (automatic)
✅ Full type check
✅ All tests must pass
✅ No console.errors in src/

# CI/CD (GitHub Actions)
✅ Lint check (all files)
✅ Type check (TypeScript strict)
✅ Format check (Prettier)
✅ Test suite (all envs)
✅ Build verification
✅ Coverage reporting
```

## 💻 Requisitos

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **Navegador**: WebGL 1.0+ (Chrome, Firefox, Safari, Edge)

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

### Material com Geometria Customizada

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

## 🛠️ Tech Stack

| Tecnologia        | Versão | Uso              |
| ----------------- | ------ | ---------------- |
| React             | 18.2+  | UI Framework     |
| TypeScript        | 5.3+   | Type Safety      |
| Three.js          | r156   | 3D Graphics      |
| React Three Fiber | 8.15+  | React + Three.js |
| Vite              | 5.0+   | Build Tool       |
| Vitest            | 1.1+   | Testing ⭐ NEW   |
| ESLint            | 8.56+  | Linting          |
| Prettier          | 3.1+   | Formatting       |
| Husky             | 8.0+   | Git Hooks        |

## 🚢 Deploy

### Vercel (Recomendado)

```bash
# Conecte seu GitHub
# Vercel detecta automaticamente Vite e faz o deploy
```

### Netlify

```bash
npm run build
# Deploy a pasta 'dist'
```

### Self-hosted

```bash
npm run build
# Serve a pasta 'dist' com qualquer servidor HTTP
```

## 🤝 Contributing

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/SuperFeature`)
3. Commit suas mudanças (`git commit -m 'feat: SuperFeature'`)
4. Push para a branch (`git push origin feature/SuperFeature`)
5. Abra um Pull Request

Veja [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes.

## 🐛 Issues & Bugs

Encontrou um bug? [Abra uma issue](https://github.com/mbrosowicz/polyfolio/issues)

## 📝 License

MIT License - veja [LICENSE](LICENSE) para detalhes

## 🙏 Créditos

- [Three.js](https://threejs.org/) - 3D graphics library
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) - React renderer for Three.js
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Vitest](https://vitest.dev/) - Unit testing framework

## 📞 Suporte

### Precisa de ajuda?

- **Documentação**: [DOCS_INDEX.md](DOCS_INDEX.md)
- **Issues**: [GitHub Issues](https://github.com/mbrosowicz/polyfolio/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mbrosowicz/polyfolio/discussions)
- **Troubleshooting**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

<div align="center">

**[⬆ voltar ao topo](#-polyfolio)**

Feito com ❤️ para mostrar efeitos visuais retro em WebGL

![Stars](https://img.shields.io/github/stars/mbrosowicz/polyfolio?style=social)
![Forks](https://img.shields.io/github/forks/mbrosowicz/polyfolio?style=social)

</div>
