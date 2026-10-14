# Collection Database Project Guidelines

## Architecture

- Treat this as a TypeScript monorepo with separate `frontend` and `backend` npm projects.
- The frontend is React with Vite, React Router, MUI, Lucide icons, and page-specific CSS under `frontend/src`.
- The backend is Express with Prisma and MariaDB under `backend/src`; keep database access behind the shared Prisma client.
- Docker Compose definitions and their Make targets live under `docker`. Follow the setup and container workflows in `README.md`.

## Implementation Conventions

- Preserve the existing style: tabs, single quotes, no semicolons, and extensionless local imports in TypeScript and TSX.
- Prefer focused changes that follow nearby component, route, CSS, and Prisma patterns. Do not refactor unrelated code.
- Use function components and hooks for React code. Preserve the existing MUI theme and CSS custom-property approach when changing UI.
- Use MUI or Lucide components already installed before introducing another UI dependency or hand-drawn icon.
- Keep secrets and environment-specific values out of source control. Read database configuration from environment variables.
- Update `backend/prisma/schema.prisma` for data-model changes and regenerate Prisma artifacts when required; do not hand-edit generated files.
- Maintain responsive and accessible UI behavior, including semantic controls, labels, keyboard access, and light/dark theme support.
- End text-based source and configuration files with a newline when appropriate for the file format.

## Validation

- For frontend changes, run `npm run lint` and `npm run build` from `frontend`.
- For backend changes, run `npx tsc --noEmit` from `backend`. Use `npm run run-prod` when a production build and startup check is appropriate.
- There is currently no automated test script. Do not claim tests passed unless a test suite has been added and run.
- Use `make -C docker dev-up` and `make -C docker dev-down` for full development-stack checks when Docker integration is relevant.

## Command Execution

- Run routine, non-destructive development commands without requesting permission, including builds, tests, linters, type checks, formatters, dependency inspection, and read-only Git commands.
- Ask before destructive operations, deployments, database mutations, installing system-wide software, or commands that expose credentials or affect external services.

## Change Discipline

- Do not commit generated output, dependencies, credentials, certificates, or local environment files.
- Keep API response shapes and routes backward compatible unless the requested change explicitly alters them.
- Update `README.md` when setup steps, environment requirements, exposed ports, or operational commands change.
