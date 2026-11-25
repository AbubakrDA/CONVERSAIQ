# Item 1 Plan — Tool Approval Gate Role & Self-Approval Hardening

## Plan
- **Change:** Enforce `require_roles(["owner", "admin"])` on `/tools/executions/{id}/approve` and `/reject`, add `requested_by_user_id` & `requested_by_role` to `ToolExecution` (with Alembic migration `012`), and reject self-approval/self-rejection with HTTP 403 (`SELF_APPROVAL_FORBIDDEN`).
- **Files:** `backend/app/models/tool.py`, `backend/alembic/versions/012_tool_requester_tracking.py`, `backend/app/schemas/tool.py`, `backend/app/services/tools/gateway.py`, `backend/app/api/v1/endpoints/tools.py`, `backend/tests/test_tools_mcp_gateway.py`.
- **Tests:** Add `test_non_admin_cannot_approve_or_reject_tool` and `test_self_approval_rejected_with_403`.
- **Risk:** Low; new columns are nullable for backward compatibility with existing rows.
