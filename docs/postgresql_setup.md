# ConversaIQ — PostgreSQL 16 & pgvector Setup Guide (Windows & Staging)

## 1. Overview
ConversaIQ requires **PostgreSQL 16** with the **`pgvector`** extension for vector embeddings (`001_initial_multi_tenant_baseline.py`, `004_knowledge_base_rag.py`) and native **Row-Level Security (RLS)** (`scripts/deploy/verify_rls_postgres.sql`).

> [!IMPORTANT]
> SQLite (`sqlite+aiosqlite`) is used strictly for isolated in-memory unit tests and **never** substitutes for native PostgreSQL 16 RLS or `pgvector` verification.

---

## 2. Option A: Native Windows PostgreSQL 16 Installation (Docker-Free)
1. Download the official **PostgreSQL 16 Windows x86-64 installer** from EDB (`https://www.enterprisedb.com/downloads/postgres-postgresql-downloads`).
2. Add `C:\Program Files\PostgreSQL\16\bin` to System `PATH` and verify:
   ```powershell
   psql --version
   ```
3. Install **`pgvector`** for Windows PostgreSQL 16 (build from source with Visual Studio Build Tools or install prebuilt `vector.dll` / `vector.control` into `share\extension` and `lib`).
4. Create database and enable `pgvector`:
   ```sql
   CREATE DATABASE conversaiq_db;
   \c conversaiq_db
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

---

## 3. Option B: Authorized Remote PostgreSQL 16 / Amazon RDS
1. Provision or connect to an authorized PostgreSQL 16 + `pgvector` instance.
2. Export `DATABASE_URL` (never commit credentials):
   ```powershell
   $env:DATABASE_URL = "postgresql+asyncpg://<USER>:<PASSWORD>@<HOST>:5432/conversaiq_db"
   ```

---

## 4. Repeatable Verification Execution
Run the automated Stage B PostgreSQL integration script:
```powershell
.\scripts\deploy\Test-PostgresIntegration.ps1 -DatabaseUrl $env:DATABASE_URL
```
This script executes:
1. `alembic upgrade head` (validates all 11 migrations).
2. `psql -f scripts/deploy/verify_rls_postgres.sql` (validates `pgvector`, enables native RLS, and tests cross-tenant isolation).
3. Non-destructive `pg_dump` backup & isolated temporary database restore test.

