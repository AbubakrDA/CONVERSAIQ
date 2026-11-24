from fastapi import APIRouter
from app.api.v1.endpoints import health, tenants, auth, business_data, chat

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(tenants.router, prefix="/tenants", tags=["Tenants"])
api_router.include_router(auth.router, prefix="/auth", tags=["Auth & RBAC"])
api_router.include_router(business_data.router, prefix="/business", tags=["Business Data Hub"])
api_router.include_router(chat.router, prefix="/chat", tags=["Chat & Agent"])
