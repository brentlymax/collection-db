# Collection Database
Database of my collections. Written as a MERN stack.

## App Architecture
- backend
- docker
- frontend
- nginx

## Prerequisite Libraries to Install Locally
- git
- docker
- docker compose v2
- make
- nvm
- npm

## Development Container Purposes
- Frontend container
    - Runs development react app (npm run dev)
- Nginx container
    - A reverse proxy that serves app to localhost

## Production Container Purposes
- Frontend container
    - Uses multi-stage docker build
        - Builds production app (npm run build)
        - Copies built app into nginx html directory
    - A reverse proxy that serves app to elastic IP
- Certbot container
    - renews certbot certificates when they expire
    - requires an initial generation of certificates before deploying

## Run Development
- make -C docker dev-up
- make -C docker dev-down
- NOTE: make sure to forward ports 3001 (backend) and 5173 (frontend)

## Run Production
- make -C docker prod-up
- make -C docker prod-down
- NOTE: make sure to forward port 3000 (backend)

## Generate Certbot Certificates
- ./nginx/generate_ssl_cert.sh
- NOTE: this should place certs in /etc/letsencrypt/live/\*
- NOTE: compose.prod.yml copies /etc/letsencrypt/\* into both prod containers

## Create Tables for an Empty Development Database
Local Prisma and reset commands use `DATABASE_URL_DEV` or `DATABASE_URL_PROD` directly. Define both in your backend `.env` or shell, using URLs reachable from where you run the commands. For the current database port mappings, local URLs have this shape (replace the credential placeholders):

```dotenv
DATABASE_URL_DEV="mysql://USER:PASSWORD@localhost:3307/collection"
DATABASE_URL_PROD="mysql://USER:PASSWORD@localhost:3306/collection"
```

`npm run prisma-dev -- <command>` selects `DATABASE_URL_DEV`; `npm run prisma-prod -- <command>` selects `DATABASE_URL_PROD`. These wrappers set `PRISMA_ENV` explicitly. Database commands without a valid `PRISMA_ENV` fail rather than silently choosing development. Client generation (`npx prisma generate`) is database-independent and does not require an environment selector or database URL, including during the production Docker build. Local tooling does not use `DATABASE_URL_BACKEND`.

Both backend environments run in Docker. Compose supplies `DATABASE_URL_BACKEND` to the running backend containers from their respective dev/prod URLs. The server reads only the injected process environment and does not load a backend `.env` file. Do not define `DATABASE_URL_BACKEND` in the local backend `.env`; that file is only for local tooling's `DATABASE_URL_DEV` and `DATABASE_URL_PROD` values. Local commands do not inherit Compose's container environment or Docker `.env`. Local connections use published host/ports, while container connections can use Docker service hostnames. Keep credentials out of source control.

`prisma/schema.prisma` is the source of truth for all tables, including Better Auth. Do not use `prisma db pull` in this flow: it introspects the database and rewrites the Prisma schema.

```bash
cd backend
npm run prisma-dev -- migrate deploy
npm run prisma-dev -- generate
npm run prisma-dev -- db execute --file prisma/insert-graded-comics.sql
```

This applies the committed migrations to an empty development database. If tables already exist without migration history, choose either the destructive clean-start workflow or the data-preserving baseline below. The insert script is for an empty comics table. For repeat imports, clear comics first using the scoped reset below.

## Reset Comics or Users
These commands delete rows, not tables, and do not rewrite the Prisma schema. They require explicit `--confirm`; `--dry-run` previews the environment, destination, and tables without connecting to the database. Verify the preview before confirming. **Production resets are allowed and permanently delete the selected data.**

Clear development comics without deleting auth data:

```bash
npm run reset-comics-dev -- --dry-run
npm run reset-comics-dev -- --confirm
```

Clear development users, accounts, sessions, and verification records without deleting comics:

```bash
npm run reset-users-dev -- --dry-run
npm run reset-users-dev -- --confirm
```

The equivalent production commands are:

```bash
npm run reset-comics-prod -- --dry-run
npm run reset-comics-prod -- --confirm
npm run reset-users-prod -- --dry-run
npm run reset-users-prod -- --confirm
```

After a comics reset, repopulate using the existing insert script with the matching environment wrapper. Run only the command for the database you just reset:

```bash
npm run prisma-dev -- db execute --file prisma/insert-graded-comics.sql
npm run prisma-prod -- db execute --file prisma/insert-graded-comics.sql
```

The users reset deletes all login data and invalidates existing sessions. Auth-table deletes run in a single transaction. Stop the backend while resetting to avoid concurrent writes; sign up again afterward. If new related models or external session storage are added, update the reset workflow to include them.

## Start Both Databases From Scratch
Use this only when you intentionally want to discard all development and production data. Back up anything you may need and stop both backends while resetting. Verify the local URLs: development should use port `3307`, production port `3306`, for the current Docker mappings.

The committed `prisma/migrations/0_init/migration.sql` creates the comics and four auth tables; `migration_lock.toml` identifies the MySQL provider. Review the migration before running these commands. Keep these files: do not delete migration history or regenerate the initial migration as part of a reset.

From `backend`, reset development and repopulate comics:

```bash
npm run prisma-dev -- migrate reset
npm run prisma-dev -- generate
npm run prisma-dev -- db execute --file prisma/insert-graded-comics.sql
```

For your explicitly disposable production database, reset and repopulate separately:

```bash
npm run prisma-prod -- migrate reset
npm run prisma-prod -- generate
npm run prisma-prod -- db execute --file prisma/insert-graded-comics.sql
```

**Warning:** `migrate reset` is normally a development-only operation. Here its production use is an intentional destructive exception: it deletes all tables and data in the selected database, including users, sessions, and migration metadata, then applies the migration files and records them as applied. Each command prompts for confirmation; do not add `--force` casually. The scoped reset scripts' `--confirm` guard does not apply to Prisma commands.

After a successful migration reset, no baseline or `migrate resolve` is needed. Check both histories:

```bash
npm run prisma-dev -- migrate status
npm run prisma-prod -- migrate status
```

Rebuild/restart the backends after seeding; users must sign up again. Stop if a reset or seed fails. Resetting application tables does not repair MariaDB system tables: resolve any `mysql.proc`/`mariadb-upgrade` error first. Avoid `db push --force-reset` for this workflow because it recreates tables without applying migration history.

## Production Schema Changes
For normal schema changes, use versioned migrations rather than full-database resets. Databases created with `db push` already contain tables but do not have migration history. `migrate deploy` refuses to adopt that nonempty schema automatically. Choose the clean-start workflow above if discarding data, or the baseline below if preserving it. Do not run both initialization workflows on the same database.

### One-Time Migration Baseline
Run from `backend`. Back up production first. This alternative preserves existing application data and assumes there are no applied migrations. The repository now includes `0_init`; use it as the baseline only if it matches the existing database. Do not replace established migration history.

Only if an initial migration does not already exist, generate one from the current Prisma schema. This step creates a local SQL file without connecting to or modifying the database. Do not overwrite the committed `0_init`:

```bash
mkdir -p prisma/migrations/0_init
npm run prisma-dev -- migrate diff --from-empty --to-schema prisma/schema.prisma --script --output prisma/migrations/0_init/migration.sql
```

Review the SQL, then verify production already matches the schema represented by the baseline:

```bash
npm run prisma-prod -- migrate diff --from-config-datasource --to-schema prisma/schema.prisma --exit-code
```

This comparison reads the database without modifying it. Exit code `0` means no differences; `2` means differences were found; other errors must be resolved before continuing. **Do not mark the baseline applied if there are differences**, including missing Better Auth tables. In that case, build the baseline from the actual existing schema and introduce the desired changes in a subsequent migration instead. Do not run `db pull` against the main schema as a shortcut.

Only after the comparison succeeds, record the initial migration as already applied:

```bash
npm run prisma-prod -- migrate resolve --applied 0_init
npm run prisma-prod -- migrate deploy
```

`migrate resolve` writes Prisma migration metadata; it does not run the baseline SQL or delete existing application data. `migrate deploy` then applies any pending migrations. Baseline an existing development database the same way using the `prisma-dev` wrapper and the same comparison first, before running `migrate dev`. An empty development database can instead apply the initial migration with `npm run prisma-dev -- migrate deploy`.

Keep the migration directory and Prisma's migration lock file in version control. Once baselined, avoid `db push` for ongoing schema changes; use migrations so development and production share the same history.

### Subsequent Schema Changes
Edit the Prisma schema, then create and apply a migration against development:

```bash
npm run prisma-dev -- migrate dev --name describe_change
npm run prisma-dev -- generate
```

Review the generated SQL before applying it to production; migrations can contain destructive changes. `migrate dev` requires a disposable shadow database and permission to create it, or a separately configured shadow database. Do not use production as the shadow database.

```bash
npm run prisma-prod -- migrate deploy
npm run prisma-prod -- generate
```

Rebuild the backend image to include the updated Prisma client. `migrate deploy` does not generate it. The scoped reset commands clear data only and leave tables and migration history intact. For a full destructive reset, use the migration-based clean-start workflow above so the migration history is recreated along with the tables.

## Enter collection db container for querying
- docker exec -it db-dev mariadb -uroot -p
- use collection
