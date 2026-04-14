# 📋 TypeScript + ESLint + Prettier Setup Guide

## ✅ O Que Foi Incluído

Este projeto está totalmente configurado com:

### TypeScript Strict Mode

- `tsconfig.json` com configurações rigorosas
- Path aliases (`@/`, `@components/`, etc)
- Type checking automático no build

### Code Quality Tools

#### ESLint

- Configuração para React + TypeScript
- Rules stritas (no-any, unused variables)
- Integração com Prettier

#### Prettier

- Configuração centralizada
- Integração com ESLint (sem conflitos)
- EditorConfig para consistência

#### Husky + Lint-Staged

- Pre-commit: ESLint + Prettier
- Pre-push: Type checking
- Automático - nenhuma configuração necessária

### Testing

- Vitest (alternativa rápida ao Jest)
- Testes unitários em `*.test.ts`
- Coverage reporting

### CI/CD

- GitHub Actions workflow
- Lint, type-check, test em cada push
- Build verification

## 🚀 Primeiro Setup

```bash
# 1. Instale as dependências
npm install

# 2. Husky será configurado automaticamente no npm install
# Se não, execute:
npm run prepare

# 3. Verifique se tudo está funcionando
npm run type-check
npm run lint
npm run test

# 4. Comece o desenvolvimento
npm run dev
```

## 📝 Adicionando TypeScript a um Componente Existente

### Antes (JavaScript)

```jsx
const MyComponent = ({ props }) => {
  return <div>{props.name}</div>;
};
```

### Depois (TypeScript)

```tsx
interface MyComponentProps {
  name: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ name }) => {
  return <div>{name}</div>;
};
```

## 🎯 Checklist de Qualidade

Antes de fazer commit:

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# Run tests
npm run test
```

Ou execute todos de uma vez:

```bash
npm run lint && npm run type-check && npm run test
```

## 🔒 Regras ESLint Importantes

- ✅ `@typescript-eslint/explicit-function-return-types` - sempre tipagem
- ✅ `@typescript-eslint/no-explicit-any` - evitar `any`
- ✅ `@typescript-eslint/no-unused-vars` - sem variáveis não usadas
- ✅ `no-console` - console apenas em dev (warn/error permitido)

## 💡 Dicas

### VS Code Integration

1. Instale extensões:
   - ESLint
   - Prettier - Code formatter

2. Adicione ao `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### Ignorar Regra Específica

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = something;

// ou para a linha inteira
// eslint-disable-next-line
```

### Path Aliases

Os path aliases estão configurados em `tsconfig.json`:

```typescript
// Ao invés de:
import { terrainGenerator } from '../../../utils/terrainGenerator';

// Use:
import { terrainGenerator } from '@utils/terrainGenerator';
```

Aliases disponíveis:

- `@/` → `src/`
- `@components/` → `src/components/`
- `@utils/` → `src/utils/`
- `@shaders/` → `src/shaders/`
- `@hooks/` → `src/hooks/`
- `@types/` → `src/types/`

## 🐛 Troubleshooting

### ESLint não funciona

```bash
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm run lint -- --fix
```

### Prettier e ESLint conflitam

Já está resolvido na configuração! ESLint tem `prettier` como estendido.

### Husky hooks não funciona

```bash
# Reinicialize husky
npm run prepare

# Verifique permissões
ls -la .husky/
chmod +x .husky/*
```

### Type errors demais

Use `// @ts-ignore` temporariamente, mas resolva os tipos:

```typescript
// @ts-ignore - TODO: Fix typing
```

## 📚 Referências

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [Husky Docs](https://typicode.github.io/husky/)

---

✨ Projeto pronto para escala com qualidade de código profissional!
