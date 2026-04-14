Este projeto é um portfolio 3D com estética retro de PlayStation 1, construído com React, TypeScript,
Three.js e React Three Fiber. O estilo visual segue a estética PS1 — low-poly, vertex jitter,
posterização e paleta reduzida. Toda UI de controles usa CSS Modules com tema dark retro
(fundo escuro, acentos em verde neon, fonte monoespaçada).

Lembre-se de sempre manter a documentação atualizada, especialmente os guias em `docs/` e a
arquitetura do projeto, para garantir que novos colaboradores entendam rapidamente as convenções e
a estrutura de shaders, componentes e hooks.

Todo código deve ser escrito em inglês (variáveis, funções, tipos, comentários em código). Comentários
explicativos e a documentação em `docs/` podem ser escritos em português para facilitar a compreensão.
Se algo estiver em português no código (ex.: `corVertice`), renomeie para inglês (ex.: `vertexColor`)
e atualize todas as referências.

Projeto usa Node >= 18.0.0 e pnpm. Siga as convenções de código estabelecidas: TypeScript strict mode,
ESLint com `@typescript-eslint/recommended-requiring-type-checking`, Prettier para formatação.
Escreva mensagens de commit seguindo Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`, etc.).

Sempre gere testes unitários (Vitest) para novas funcionalidades e correções de bugs. Manter cobertura
acima de 90%. Shaders GLSL não são testados diretamente — o foco de testes é nos utilitários
(`terrainGenerator`, `posterizationPass`, `env`), hooks e tipos. Use `happy-dom` como ambiente de teste.

Para novos componentes Three.js/R3F: use `forwardRef`, defina as props em `src/types/index.ts`,
use path aliases (`@components`, `@utils`, `@shaders`, `@hooks`) e nunca importe com caminhos relativos
longos. Shaders GLSL ficam em `src/shaders/` e são importados via `vite-plugin-glsl`.
