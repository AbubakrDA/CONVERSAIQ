# ConversaIQ

**Enterprise AI Customer Support & Business Intelligence Platform**

ConversaIQ is an intelligent, secure, multi-tenant customer-support and business-intelligence platform enabling organizations to automate customer support using AI agents, manage customer memory, integrate with business data hubs (Google Sheets, databases, CRM/ERP), and generate actionable management intelligence.

---

## Architecture Overview

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Recharts
- **Backend:** Python 3.12, FastAPI, Pydantic v2, SQLAlchemy 2.0, Alembic
- **Database & Storage:** PostgreSQL 16 with pgvector, Redis 7, MinIO / S3 object storage
- **Background Processing:** Celery with Redis broker
- **Authentication:** Keycloak OIDC with RBAC & multi-tenant row-level security
- **AI & RAG:** Controlled Agent Orchestration, pgvector vector indexing, vision models, OCR
- **Integrations:** Tool Gateway with MCP proxy & Google Sheets API connectors

---

## Engineering Control: Harness Engineering

ConversaIQ strictly follows the **Harness Engineering** methodology.
Every task proceeds under the mandatory protocol:
`READ` → `PLAN` → `IMPLEMENT` → `TEST` → `INSPECT` → `REPAIR` → `RETEST` → `REPORT`

See [engineering/harness/README.md](file:///D:/CONVERSAIQ/engineering/harness/README.md) for full protocol specifications.

---

## Documentation Index

- [PROJECT_AUDIT.md](file:///D:/CONVERSAIQ/PROJECT_AUDIT.md) — Baseline workspace audit
- [TARGET_ARCHITECTURE.md](file:///D:/CONVERSAIQ/TARGET_ARCHITECTURE.md) — Target system architecture
- [PHASE_ROADMAP.md](file:///D:/CONVERSAIQ/PHASE_ROADMAP.md) — 16-phase implementation roadmap
- [SECURITY_ASSESSMENT.md](file:///D:/CONVERSAIQ/SECURITY_ASSESSMENT.md) — Security threat model and controls
- [HARNESS_IMPLEMENTATION_PLAN.md](file:///D:/CONVERSAIQ/HARNESS_IMPLEMENTATION_PLAN.md) — Harness design
- [PHASE_0_COMPLETION_REPORT.md](file:///D:/CONVERSAIQ/PHASE_0_COMPLETION_REPORT.md) — Phase 0 sign-off
