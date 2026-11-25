import pytest
from datetime import timedelta
from httpx import AsyncClient
from app.core.security import create_access_token


@pytest.mark.asyncio
async def test_login_success(client: AsyncClient) -> None:
    response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": "alex@conversaiq.internal",
            "password": "validpassword123",
            "tenant_id": "tenant_enterprise_01",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "access_token" in data["data"]
    assert data["data"]["tenant_id"] == "tenant_enterprise_01"
    assert data["data"]["role"] == "admin"


@pytest.mark.asyncio
async def test_unauthenticated_request_rejected(client: AsyncClient) -> None:
    # Attempting to access /api/v1/auth/me without Bearer token must return 401
    response = await client.get("/api/v1/auth/me")
    assert response.status_code == 401
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "HTTP_401"
    assert "Missing or malformed" in data["error"]["message"]


@pytest.mark.asyncio
async def test_tampered_token_rejected(client: AsyncClient) -> None:
    valid_token = create_access_token(
        subject="user_123",
        tenant_id="tenant_01",
        role="agent",
        email="agent@test.com",
    )
    # Tamper with the payload signature
    tampered_token = valid_token[:-4] + "XXXX"

    response = await client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {tampered_token}"},
    )
    assert response.status_code == 401
    data = response.json()
    assert data["success"] is False
    assert "Invalid, signature-tampered" in data["error"]["message"]


@pytest.mark.asyncio
async def test_expired_token_rejected(client: AsyncClient) -> None:
    expired_token = create_access_token(
        subject="user_123",
        tenant_id="tenant_01",
        role="agent",
        email="agent@test.com",
        expires_delta=timedelta(seconds=-10),  # Expired in past
    )
    response = await client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {expired_token}"},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_rbac_admin_vs_agent_permissions(client: AsyncClient) -> None:
    # 1. Agent token attempting admin action
    agent_token = create_access_token(
        subject="agent_001",
        tenant_id="tenant_alpha",
        role="agent",
        email="agent@alpha.com",
    )
    response = await client.post(
        "/api/v1/auth/users",
        headers={"Authorization": f"Bearer {agent_token}"},
        json={
            "email": "newbie@alpha.com",
            "password": "securepassword123",
            "full_name": "New Staff Member",
            "role": "agent",
        },
    )
    assert response.status_code == 403
    data = response.json()
    assert data["success"] is False
    assert "lacks required permissions" in data["error"]["message"]

    # 2. Admin token attempting same action
    admin_token = create_access_token(
        subject="admin_001",
        tenant_id="tenant_alpha",
        role="admin",
        email="admin@alpha.com",
    )
    response_admin = await client.post(
        "/api/v1/auth/users",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={
            "email": "newbie@alpha.com",
            "password": "securepassword123",
            "full_name": "New Staff Member",
            "role": "agent",
        },
    )
    assert response_admin.status_code == 200
    assert response_admin.json()["success"] is True
    assert response_admin.json()["data"]["email"] == "newbie@alpha.com"


@pytest.mark.asyncio
async def test_strict_multi_tenant_isolation(client: AsyncClient) -> None:
    admin_alpha = create_access_token(
        subject="admin_alpha",
        tenant_id="tenant_company_a",
        role="admin",
        email="admin@company-a.com",
    )
    admin_beta = create_access_token(
        subject="admin_beta",
        tenant_id="tenant_company_b",
        role="admin",
        email="admin@company-b.com",
    )

    # 1. Company A admin creates a user in Company A
    await client.post(
        "/api/v1/auth/users",
        headers={"Authorization": f"Bearer {admin_alpha}"},
        json={
            "email": "secret_agent@company-a.com",
            "password": "password12345",
            "full_name": "Company A Staff",
            "role": "agent",
        },
    )

    # 2. Company B queries /users with their token
    res_b = await client.get(
        "/api/v1/auth/users",
        headers={"Authorization": f"Bearer {admin_beta}"},
    )
    assert res_b.status_code == 200
    users_in_b = res_b.json()["data"]

    # CRITICAL INVARIANT: Zero Company A users visible to Company B
    emails_in_b = [u["email"] for u in users_in_b]
    assert "secret_agent@company-a.com" not in emails_in_b

    # 3. Company A queries /users with their token
    res_a = await client.get(
        "/api/v1/auth/users",
        headers={"Authorization": f"Bearer {admin_alpha}"},
    )
    assert res_a.status_code == 200
    users_in_a = res_a.json()["data"]
    emails_in_a = [u["email"] for u in users_in_a]
    assert "secret_agent@company-a.com" in emails_in_a
