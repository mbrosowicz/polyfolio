# Contributing to Polyfolio

Obrigado por se interessar em contribuir! Este documento fornece diretrizes.

## 🎯 Antes de Começar

1. Faça um Fork do projeto
2. Clone seu fork: `git clone https://github.com/seu-usuario/polyfolio.git`
3. Crie uma branch: `git checkout -b feature/sua-feature`

## ✅ CodeStyle & Quality

### TypeScript

- Use `strict: true`
- Sempre adicione tipos de retorno em funções
- Evite `any` - use generics ou tipos específicos

```typescript
// ❌ Ruim
const processData = (data) => {
  return data.map((item: any) => item.value);
};

// ✅ Bom
interface DataItem {
  value: number;
}

const processData = (data: DataItem[]): number[] => {
  return data.map((item) => item.value);
};
```

### ESLint & Prettier

```bash
# Before committing
npm run lint:fix
npm run format
npm run type-check
```

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new PS1 effect
fix: correct terrain generation seed
docs: update README with examples
test: add tests for posterization
chore: update dependencies
```

## 📝 Pull Request Process

1. Update the README.md if applicable
2. Run all checks:
   ```bash
   npm run type-check
   npm run lint
   npm run test
   npm run build
   ```
3. Fill out the PR template
4. Link related issues
5. Request review

## 🧪 Testing

- Write tests for new features
- Tests go in `src/**/*.test.ts`
- Aim for >80% coverage

```bash
npm run test:coverage
```

## 📚 Documentation

- Update docs when changing behavior
- Add JSDoc comments to public functions
- Include examples for new utilities

```typescript
/**
 * Generates procedural terrain with optional smoothing
 *
 * @param options - Configuration options
 * @param options.width - Terrain width (default: 100)
 * @param options.segmentsX - Grid resolution (default: 32)
 * @returns BufferGeometry of the terrain
 *
 * @example
 * const terrain = generateProceduralTerrain({
 *   width: 200,
 *   maxElevation: 30
 * });
 */
export function generateProceduralTerrain(options: TerrainGeneratorOptions): THREE.BufferGeometry {
  // ...
}
```

## 🎨 Component Structure

New components should follow this structure:

```typescript
// src/components/MyComponent.tsx
import React, { ReactNode } from 'react';
import styles from './MyComponent.module.css';

interface MyComponentProps {
  children?: ReactNode;
  className?: string;
  // Add more props...
}

/**
 * MyComponent description
 */
const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.container} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MyComponent.displayName = 'MyComponent';

export default MyComponent;
```

## 🐛 Reporting Bugs

Include:

- Environment (OS, Node version, browser)
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/console errors

## ✨ Feature Requests

Suggest improvements with:

- Clear use case
- Why it's useful
- Implementation ideas (optional)

## 📋 Code Review Checklist

- [ ] Types are complete
- [ ] No `any` types
- [ ] Tests pass
- [ ] ESLint passing
- [ ] JSDoc comments added
- [ ] No console.log in production code
- [ ] Performance impact considered
- [ ] Mobile responsive (if UI)

## 🚀 Release Process

Maintainers only:

```bash
# Update version
npm version patch|minor|major

# Build & publish
npm run build
npm publish

# Git push with tags
git push --follow-tags
```

## 💬 Questions?

- Open a GitHub Discussion
- Ask in Issues
- Check TROUBLESHOOTING.md

---

Toda contribuição é apreciada! 🙏
