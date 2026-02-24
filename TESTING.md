# Testing Guide

Guia completo para testes no projeto Polyfolio.

## 📋 Estrutura de Testes

```
src/
├── setup.test.ts                    # Setup global para todos os testes
├── utils/
│   ├── env.test.ts                 # Testes de variáveis de ambiente
│   ├── terrainGenerator.test.ts     # Testes de geração de terreno
│   └── posterizationPass.test.ts    # Testes de shaders de posterização
├── hooks/
│   └── usePS1Effects.test.ts        # Testes de custom hooks
└── types/
    └── index.test.ts                # Testes de type definitions
```

## 🚀 Executando Testes

### Rodar todos os testes

```bash
npm run test
```

### Modo watch (rerun em mudanças)

```bash
npm run test -- --watch
```

### Interface gráfica

```bash
npm run test:ui
```

Abrirá um navegador em `http://localhost:51204` com interface gráfica de testes.

### Cobertura de código

```bash
npm run test:coverage
```

Gera relatório detalhado de cobertura em `coverage/index.html`

## 📊 Estrutura de Testes

### Testes Unitários

#### `utils/env.test.ts`

- Verifica se variáveis de ambiente estão configuradas corretamente
- Testa valores padrão
- Valida tipos

#### `utils/terrainGenerator.test.ts`

- Verifica criação de geometrias válidas
- Testa limites de elevação
- Valida parâmetros customizados

#### `utils/posterizationPass.test.ts`

- Valida shaders GLSL
- Testa compilação de shaders
- Verifica uniforms e varyings

#### `hooks/usePS1Effects.test.ts`

- Testa custom hooks com React Testing Library
- Verifica atualizações de estado
- Valida valores retornados

#### `types/index.test.ts`

- Valida interfaces TypeScript
- Testa tipos genéricos
- Verifica extensão de tipos

### Testes de Integração

Integração com Three.js e React Three Fiber são testadas indiretamente através dos componentes.

## 🛠️ Setup de Testes

### Arquivo: `src/setup.test.ts`

Configura:

- Cleanup automático após cada teste
- Mocks de WebGL
- Mocks de Media Queries
- Suporte a Canvas

## ✅ Best Practices

### 1. Nomeação

```typescript
// ✅ Bom
describe('generateProceduralTerrain', () => {
  it('should create valid BufferGeometry', () => {});
});

// ❌ Ruim
describe('terrain', () => {
  it('works', () => {});
});
```

### 2. TDD (Test-Driven Development)

```typescript
// 1. Escrever teste que falha
it('should generate terrain with correct dimensions', () => {
  const terrain = generateProceduralTerrain({ width: 100, height: 100 });
  expect(terrain.boundingBox?.min.x).toBe(-50);
});

// 2. Implementar código para passar
export function generateProceduralTerrain(options: Options) {
  // ...implementation
}

// 3. Refatorar mantendo testes passando
```

### 3. Testes Independentes

```typescript
// ✅ Cada teste é independente
it('test 1', () => {
  const result = doSomething();
  expect(result).toBe(expected);
});

it('test 2', () => {
  const result = doSomething();
  expect(result).toBe(expected);
});

// ❌ Evitar dependências entre testes
let state = null;
it('test 1', () => {
  state = doSomething();
});
it('test 2', () => {
  expect(state).toBeDefined(); // Depende do teste anterior!
});
```

### 4. Arrange-Act-Assert

```typescript
it('should increase counter by 1', () => {
  // Arrange: preparar dados
  const initialCount = 0;

  // Act: executar ação
  const result = increment(initialCount);

  // Assert: verificar resultado
  expect(result).toBe(1);
});
```

## 🧪 Cobertura de Testes

### Alvo de Cobertura

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

### Visualizar Cobertura

```bash
npm run test:coverage
# Abra coverage/index.html no navegador
```

## 🔄 CI/CD Integration

Testes rodam automaticamente:

- ✅ Em cada push (GitHub Actions)
- ✅ Em Pull Requests
- ✅ Pre-commit (lint-staged)

Veja `.github/workflows/ci.yml` para detalhes.

## 🐛 Debugando Testes

### No VS Code

Adicione no `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Vitest Debug",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "test", "--", "--inspect-brk", "--no-file-parallelism"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### Usando console.log

```typescript
it('debug example', () => {
  const value = doSomething();
  console.log('Debug:', value); // Visível com --reporter=verbose
  expect(value).toBe(expected);
});
```

## 📝 Escrevendo Novos Testes

### Template para Component

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render without crashing', () => {
    const { container } = render(<MyComponent />);
    expect(container).toBeDefined();
  });

  it('should display text content', () => {
    render(<MyComponent />);
    expect(screen.getByText(/expected text/i)).toBeInTheDocument();
  });
});
```

### Template para Utility

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from './myFunction';

describe('myFunction', () => {
  it('should return expected value', () => {
    const result = myFunction(input);
    expect(result).toBe(expectedOutput);
  });

  it('should handle edge cases', () => {
    const result = myFunction(edgeCase);
    expect(result).toBe(expectedOutput);
  });
});
```

## 🚨 Troubleshooting

### Erro: Cannot find module

```
Error: Cannot find module '...'
```

**Solução**: Verifique o caminho do import, use path aliases (`@/`, `@utils/`, etc)

### WebGL errors

```
Error: WebGL context not found
```

**Solução**: Verifique se `src/setup.test.ts` está sendo executado (veja `vitest.config.ts`)

### Testes timeout

```
Test timeout exceeded
```

**Solução**: Aumente timeout com `{ timeout: 10000 }`:

```typescript
it(
  'slow test',
  async () => {
    // ...
  },
  { timeout: 10000 }
);
```

## 📚 Recursos

- [Vitest Documentation](https://vitest.dev)
- [React Testing Library](https://testing-library.com/react)
- [Three.js Testing](https://threejs.org/docs/#manual/en/introduction/Testing)

## ✨ Próximos Passos

1. Aumentar cobertura de testes para > 90%
2. Adicionar testes de performance
3. Integrar com SonarQube para análise de qualidade
4. Aautomatizar snapshots de componentes visuais
