# @grayprint/db

DrizzleORM database package for the Grayprint template marketplace.

## Setup

### 1. Start PostgreSQL

```bash
# From repo root
docker-compose up -d
```

### 2. Configure environment

Copy `.env.example` to `.env` in your app and set `DATABASE_URL`:

```
DATABASE_URL=postgresql://grayprint:grayprint@localhost:5432/grayprint
```

### 3. Install dependencies

```bash
cd packages/db
pnpm install
```

### 4. Generate & run migrations

```bash
# Generate SQL migration files from schema
pnpm run generate

# Apply migrations to database
pnpm run migrate
```

### 5. Seed sample data (optional)

```bash
pnpm run seed
```

### 6. Build the package

```bash
pnpm run build
```

## Usage

```ts
import { createDb } from '@grayprint/db'

const db = createDb(process.env.DATABASE_URL!)

// Query examples
const allTemplates = await db.query.templates.findMany({
  where: (t, { eq }) => eq(t.isPublished, true),
  with: { author: true },
})
```

## Schema overview

| Table | Description |
|---|---|
| `users` | Platform users (user / creator / admin roles) |
| `sessions` | better-auth sessions |
| `accounts` | better-auth OAuth provider accounts |
| `verifications` | better-auth email verifications |
| `templates` | UI templates / components / blocks |
| `template_versions` | Versioned releases of a template |
| `registry_items` | shadcn-compatible registry entries |
| `purchases` | Paid template purchases |
| `organizations` | Teams / enterprise registries |
| `org_members` | Organisation membership |
| `reviews` | User ratings and comments |
| `collections` | User-curated template lists |
| `template_stars` | Template starring/bookmarking |
