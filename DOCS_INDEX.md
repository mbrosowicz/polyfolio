# 📚 Documentação - Índice de Navegação

Bem-vindo ao Polyfolio! Use este índice para encontrar rapidamente o que precisa.

## 🚀 Começar

Se é sua primeira vez aqui:

1. **[README.md](README.md)** - Overview geral do projeto
2. **[SETUP.md](SETUP.md)** - Instalação e configuração inicial
3. **[QUICK_START.md](QUICK_START.md)** - Exemplos rápidos (5 minutos)

Se já tem experiência:

```bash
npm install
npm run prepare
npm run dev
```

## 📖 Documentação Principal

### Para Desenvolvedores

| Documento                                      | Conteúdo                            |
| ---------------------------------------------- | ----------------------------------- |
| [SETUP.md](SETUP.md)                           | Instalação, estrutura, CI/CD        |
| [TESTING.md](TESTING.md) ⭐ **NEW**            | Testes, Vitest, cobertura           |
| [TYPESCRIPT_SETUP.md](TYPESCRIPT_SETUP.md)     | TypeScript, ESLint, Prettier, Husky |
| [COMPONENT_TEMPLATE.md](COMPONENT_TEMPLATE.md) | Como criar componentes              |
| [CONTRIBUTING.md](CONTRIBUTING.md)             | Diretrizes contribuição             |

### Para Entender os Shaders

| Documento                                      | Conteúdo               |
| ---------------------------------------------- | ---------------------- |
| [PS1_SHADERS_README.md](PS1_SHADERS_README.md) | Shaders, customizações |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md)       | Problemas comuns       |
| [QUICK_START.md](QUICK_START.md) (Shaders)     | Exemplos de uso        |

### Migração PS1

| Documento                          | Conteúdo                     |
| ---------------------------------- | ---------------------------- |
| [README_PT-BR.md](README_PT-BR.md) | Resumo completo em português |

## 🎯 Guias Específicos

### Quero...

#### ...começar a desenvolver

→ [SETUP.md](SETUP.md) → [COMPONENT_TEMPLATE.md](COMPONENT_TEMPLATE.md)

#### ...entender TypeScript/ESLint

→ [TYPESCRIPT_SETUP.md](TYPESCRIPT_SETUP.md)

#### ...contribuir ao projeto

→ [CONTRIBUTING.md](CONTRIBUTING.md) → [COMPONENT_TEMPLATE.md](COMPONENT_TEMPLATE.md)

#### ...usar os shaders PS1

→ [PS1_SHADERS_README.md](PS1_SHADERS_README.md) → [QUICK_START.md](QUICK_START.md)

#### ...resolver um problema

→ [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

#### ...entender a estrutura

→ [SETUP.md](SETUP.md#-estrutura-do-projeto)

#### ...fazer deploy

→ [SETUP.md](SETUP.md#-deploy) → [README.md](README.md#-deploy)

## 📋 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # 🎯 Comece por aqui!

# Qualidade
npm run type-check       # Análise de tipos
npm run lint             # Linting
npm run format           # Formatação
npm run lint:fix         # Fix automático

# Testes
npm run test             # Rodar testes
npm run test:ui          # UI dos testes
npm run test:coverage    # Cobertura

# Build
npm run build            # Produção
npm run preview          # Preview build
```

## 🛠️ Stack Técnico

```
Frontend Framework: React 18.2
Language: TypeScript 5.3
3D Graphics: Three.js r156
Build Tool: Vite 5.0
Testing: Vitest 1.1
Code Quality: ESLint 8.5 + Prettier 3.1
Git Hooks: Husky 8.0
```

## 📊 Arquitetura

```
Polyfolio
├── Shaders (GLSL)
│   └── PS1 Effects (Vertex Jitter)
├── Components (React/TypeScript)
│   ├── PS1Material
│   ├── PS1TerrainCanvas
│   └── PS1Demo
├── Utilities
│   ├── terrainGenerator (Procedural)
│   └── posterizationPass (Post-processing)
└── Testing & Quality
    ├── Vitest
    ├── ESLint
    └── Prettier
```

## 🔍 Busca Rápida

### Termos Comuns

- **"setup"** → [SETUP.md](SETUP.md)
- **"typescript"** → [TYPESCRIPT_SETUP.md](TYPESCRIPT_SETUP.md)
- **"componente"** → [COMPONENT_TEMPLATE.md](COMPONENT_TEMPLATE.md)
- **"shader"** → [PS1_SHADERS_README.md](PS1_SHADERS_README.md)
- **"erro"** → [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **"contribute"** → [CONTRIBUTING.md](CONTRIBUTING.md)
- **"deploy"** → [SETUP.md](SETUP.md#-deploy)

## 📞 Suporte

- 🐛 **Bug?** → [Issues](https://github.com/mbrosowicz/polyfolio/issues)
- 💬 **Pergunta?** → [Discussions](https://github.com/mbrosowicz/polyfolio/discussions)
- 📧 **Contato** → Veja [README.md](README.md#-contato)

## ✅ Checklist Inicial

- [ ] Executei `npm install`
- [ ] Executei `npm run prepare` (Husky)
- [ ] Rodei `npm run dev`
- [ ] Abri http://localhost:5173
- [ ] Implementei meu primeiro componente
- [ ] Rodei `npm run test`
- [ ] Li [COMPONENT_TEMPLATE.md](COMPONENT_TEMPLATE.md)

## 🎓 Recursos Externos

- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Three.js Docs](https://threejs.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Vitest Docs](https://vitest.dev/)

## 🚀 Próximos Passos

1. Rode `npm run dev`
2. Abra http://localhost:5173
3. Customize PS1Demo.tsx
4. Leia [COMPONENT_TEMPLATE.md](COMPONENT_TEMPLATE.md)
5. Crie seu primeiro componente
6. Faça um commit com suas mudanças

---

**Dúvida?** Consulte este índice ou abra uma issue!

Divirta-se desenvolvendo 🚀
