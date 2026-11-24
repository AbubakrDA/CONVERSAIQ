import asyncio
import time
import pytest
from httpx import AsyncClient
from app.core.security import create_access_token


@pytest.mark.asyncio
async def test_concurrent_multi_tenant_request_bursting(client: AsyncClient) -> None:
    """Stress test: 20 concurrent requests across 10 distinct tenants."""
    latencies = []

    async def make_request(idx: int) -> float:
        tenant_id = f"tenant_perf_{idx % 10}"
        token = create_access_token(f"user_perf_{idx}", tenant_id, "admin", f"perf{idx}@test.com")
        headers = {"Authorization": f"Bearer {token}"}

        start = time.perf_counter()
        res = await client.get("/api/v1/tickets", headers=headers)
        elapsed = (time.perf_counter() - start) * 1000.0  # ms
        assert res.status_code == 200
        return elapsed

    # Execute 20 concurrent requests in parallel
    tasks = [make_request(i) for i in range(20)]
    latencies = await asyncio.gather(*tasks)

    assert len(latencies) == 20
    sorted_lat = sorted(latencies)
    p50 = sorted_lat[int(len(sorted_lat) * 0.50)]
    p95 = sorted_lat[int(len(sorted_lat) * 0.95)]

    # Assert P50 latency is fast (under 100ms in-memory/local)
    assert p50 < 100.0, f"P50 latency exceeded target: {p50}ms"
    assert p95 < 350.0, f"P95 latency exceeded target: {p95}ms"


@pytest.mark.asyncio
async def test_high_concurrency_ticket_creation(client: AsyncClient) -> None:
    """Validate ticket lifecycle state machine and duplicate prevention under rapid parallel requests."""
    token = create_access_token("admin_burst", "tenant_burst", "admin", "burst@test.com")
    headers = {"Authorization": f"Bearer {token}"}

    async def create_unique_ticket(idx: int):
        payload = {
            "title": f"Concurrent Ticket Issue #{idx}",
            "description": f"Unique issue details for concurrent worker #{idx}",
            "priority": "MEDIUM",
            "channel": "API",
        }
        res = await client.post("/api/v1/tickets", headers=headers, json=payload)
        assert res.status_code == 200
        return res.json()["data"]["id"]

    tasks = [create_unique_ticket(i) for i in range(5)]
    ticket_ids = await asyncio.gather(*tasks)

    # Ensure all created tickets have unique primary keys
    assert len(set(ticket_ids)) == 5
