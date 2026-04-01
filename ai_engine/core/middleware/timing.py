import logging
import time
from typing import Awaitable, Callable

from fastapi import Request, Response

logger = logging.getLogger("performance")


async def timing_middleware(
    request: Request, call_next: Callable[[Request], Awaitable[Response]]
) -> Response:
    if request.url.path == "/health":
        return await call_next(request)
    start = time.perf_counter()

    response: Response = await call_next(request)

    process_time = time.perf_counter() - start

    logger.info(
        f"{request.method} {request.url.path} " f"completed_in={process_time:.3f}s"
    )
    response.headers["X-Process-Time"] = str(process_time)

    return response
