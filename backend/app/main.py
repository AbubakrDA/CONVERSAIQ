from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.core.logging import setup_logging
from app.core.middleware import TenantAndLoggingMiddleware
from app.schemas.envelope import APIResponse
from app.api.v1.api import api_router


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    setup_logging()
    yield


def create_application() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version="0.1.0",
        description="ConversaIQ Enterprise AI Customer Support & Business Intelligence Platform",
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        docs_url=f"{settings.API_V1_STR}/docs",
        redoc_url=f"{settings.API_V1_STR}/redoc",
        lifespan=lifespan,
    )

    # 1. Custom Tenant & Correlation Logging Middleware
    app.add_middleware(TenantAndLoggingMiddleware)

    # 2. CORS Middleware
    if settings.BACKEND_CORS_ORIGINS:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=settings.BACKEND_CORS_ORIGINS,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    # 3. Include API Router
    app.include_router(api_router, prefix=settings.API_V1_STR)

    # 4. Standard Exception Handlers with Typed Envelope
    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
        error_resp = APIResponse.fail(
            code=f"HTTP_{exc.status_code}",
            message=str(exc.detail),
            request_id=getattr(request.state, "request_id", None),
            tenant_id=getattr(request.state, "tenant_id", None),
        )
        return JSONResponse(status_code=exc.status_code, content=error_resp.model_dump())

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
        error_resp = APIResponse.fail(
            code="VALIDATION_ERROR",
            message="Request body or query parameter validation failed",
            details={"errors": exc.errors()},
            request_id=getattr(request.state, "request_id", None),
            tenant_id=getattr(request.state, "tenant_id", None),
        )
        return JSONResponse(status_code=422, content=error_resp.model_dump())

    return app


app = create_application()
