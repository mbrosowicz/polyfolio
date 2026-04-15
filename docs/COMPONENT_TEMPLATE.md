# Component Template

Use este template para criar novos componentes React com TypeScript.

## Para um Novo Componente

### 1. Criar Arquivo Principal

**src/components/MyNewComponent.tsx**:

```typescript
import React, { ReactNode } from 'react';
import styles from './MyNewComponent.module.css';

interface MyNewComponentProps {
  /** Primary content */
  children?: ReactNode;
  /** Additional CSS class */
  className?: string;
  /** Component title */
  title?: string;
}

/**
 * MyNewComponent
 *
 * Brief description of what it does
 *
 * @example
 * <MyNewComponent title="Test">
 *   Content here
 * </MyNewComponent>
 */
const MyNewComponent = React.forwardRef<HTMLDivElement, MyNewComponentProps>(
  ({ children, className = '', title, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.container} ${className}`}
        {...props}
      >
        {title && <h2 className={styles.title}>{title}</h2>}
        {children}
      </div>
    );
  }
);

MyNewComponent.displayName = 'MyNewComponent';

export default MyNewComponent;
```

### 2. Criar Estilos

**src/components/MyNewComponent.module.css**:

```css
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.title {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  color: #333;
}
```

### 3. Criar Testes

**src/components/MyNewComponent.test.tsx**:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyNewComponent from './MyNewComponent';

describe('MyNewComponent', () => {
  it('renders with title', () => {
    render(<MyNewComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <MyNewComponent>
        <div>Test Content</div>
      </MyNewComponent>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies custom class', () => {
    const { container } = render(
      <MyNewComponent className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
```

### 4. Exportar no Index

**src/components/index.ts**:

```typescript
export { default as MyNewComponent } from './MyNewComponent';
export type { MyNewComponentProps } from './MyNewComponent';
```

## Para uma Nova Utility

**src/utils/myUtility.ts**:

```typescript
/**
 * Utility description
 *
 * @param input - Input description
 * @returns Return description
 *
 * @example
 * const result = myUtility('test');
 * console.log(result);
 */
export function myUtility(input: string): string {
  return input.toUpperCase();
}

/**
 * Optional: async utility with error handling
 */
export async function myAsyncUtility(id: string): Promise<any> {
  try {
    const response = await fetch(`/api/${id}`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  } catch (error) {
    console.error('Error in myAsyncUtility:', error);
    throw error;
  }
}
```

**src/utils/myUtility.test.ts**:

```typescript
import { describe, it, expect } from 'vitest';
import { myUtility } from './myUtility';

describe('myUtility', () => {
  it('should convert to uppercase', () => {
    expect(myUtility('hello')).toBe('HELLO');
  });

  it('should handle empty string', () => {
    expect(myUtility('')).toBe('');
  });
});
```

## Para um Novo Hook

**src/hooks/useMyHook.ts**:

```typescript
import { useState, useEffect } from 'react';

interface UseMyHookOptions {
  enabled?: boolean;
}

interface UseMyHookReturn {
  data: any;
  loading: boolean;
  error: Error | null;
}

/**
 * Custom hook description
 *
 * @param options - Hook options
 * @returns Hook return values
 *
 * @example
 * const { data, loading } = useMyHook({ enabled: true });
 */
export function useMyHook(options: UseMyHookOptions = {}): UseMyHookReturn {
  const { enabled = true } = options;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Your logic here
        setData(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [enabled]);

  return { data, loading, error };
}
```

## Para um Novo Type

**src/types/myTypes.ts**:

```typescript
/**
 * My custom type interface
 */
export interface MyType {
  id: string;
  name: string;
  value: number;
  createdAt: Date;
}

/**
 * Props for MyType component
 */
export interface MyTypeComponentProps {
  data: MyType;
  onSelect?: (item: MyType) => void;
}

/**
 * Type guards
 */
export function isMyType(obj: unknown): obj is MyType {
  return typeof obj === 'object' && obj !== null && 'id' in obj && 'name' in obj && 'value' in obj;
}
```

## Checklist

Antes de fazer commit:

- [ ] TypeScript types completos
- [ ] JSDoc comentários adicionados
- [ ] Testes escritos e passando
- [ ] ESLint/Prettier rodados
- [ ] Sem `console.log` em código production
- [ ] Sem `any` types
- [ ] Sem variáveis não usadas
- [ ] Pronto para revisão

## Running Tests Locally

```bash
# Run all tests
pnpm run test

# Watch mode
pnpm run test -- --watch

# This specific test file
pnpm run test MyNewComponent

# With UI
pnpm run test:ui
```

---

Pronto para criar componentes profissionais! 🚀
