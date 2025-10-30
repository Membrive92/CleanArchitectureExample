## Purpose
Short, repo-specific guidance for AI coding agents to be immediately productive in this clean-architecture TypeScript project.

## Big picture (what this repo is)
- Project follows a Clean Architecture layout under `src/` with clear layer folders:
  - `src/application/` — ports and use-cases (application logic boundary)
  - `src/domain/` — entities, events, value-objects (core business models)
  - `src/infraestructure/` — adapters, http, persistence (infrastructure implementations)
  - `src/shared/` — cross-cutting helpers (e.g. `src/shared/health.ts`)
- Note: the repository spells the folder as `infraestructure` (with an extra "e"). Preserve this exact path when adding files.

## How to run & test (discovered from repo)
- Scripts in `package.json`:
  - `npm run dev` — runs `tsx main.ts` (requires `tsx` available; not listed in devDependencies)
  - `npm run test` — runs `vitest run` (vitest is in devDependencies)
- TypeScript config: `tsconfig.json` emits to `./dist`, sets `module: "nodenext"` and `type: "commonjs"` in `package.json` — be careful when changing module/type to avoid runtime import resolution issues.

## Project-specific conventions & patterns
- Layer boundaries are strict: implement interfaces (ports) in `src/application/ports` and concrete adapters in `src/infraestructure/adapters`.
- Put orchestration/use-case logic in `src/application/use-cases` (not in controllers/adapters).
- Domain classes and value-objects belong in `src/domain/entities` and `src/domain/value-objects` respectively.
- Keep infra code (HTTP servers, DB clients) inside `src/infraestructure/http` or `src/infraestructure/persistence`.
- Shared utilities go in `src/shared` (example file: `src/shared/health.ts`).

## Common pitfalls & caveats (observed from files)
- `npm run dev` calls `tsx` but `tsx` is not present in `devDependencies`; use `npx tsx main.ts` or add `tsx` to dependencies if you will run the dev script locally.
- `tsconfig.json` uses `module: "nodenext"` while `package.json` uses `type: "commonjs"`. Don't change these without confirming with maintainers — changing may break module resolution.
- Many folders are present but currently empty; when adding new files, follow the existing layer naming and keep exports minimal and focused.

## Small contract for code changes
- Inputs: new/changed files should only modify a single layer (domain, application, or infra) unless the change is explicitly cross-cutting.
- Outputs: new adapters must implement an interface in `src/application/ports` and be registered only where the app bootstraps (currently `main.ts` is the app entry).
- Error modes: surface errors as typed Error subclasses in `domain` where appropriate; let adapters translate external errors.

## Concrete examples to follow
- If you add an HTTP adapter, mirror path `src/infraestructure/http/<name>.ts` and keep routing thin — call application use-cases from the handler.
- If you add persistence, put repository implementations under `src/infraestructure/persistence` and reference ports defined in `src/application/ports`.

## Tests & debugging
- Run unit tests with `npm run test` (uses Vitest). Tests are excluded in `tsconfig.json` by pattern `**/*.test.ts`.
- For local dev, `npm run dev` is the intended entry but ensure `tsx` is installed or run `npx tsx main.ts`.

## When unsure
- Prefer small, incremental PRs that change a single layer and include a brief explanation in the PR description (which port was implemented and where the adapter is registered).

## Where to look first (key files / folders)
- `package.json` — scripts and installed dev tools
- `tsconfig.json` — compiler settings and module targets
- `main.ts` — app entry (currently present in repo root)
- `src/application/ports` and `src/infraestructure/adapters` — the port-adapter boundary to respect
- `src/domain/*` — domain models and value objects

If any section is unclear or you want more detail (examples, checklist for PRs, or preferred dependency updates), tell me which part to expand.
