import * as Http from "@effect/platform/HttpServer"

export const health = Http.router.get(
    "/health",
    Http.response.text("ok").pipe(
        Http.middleware.withLoggerDisabled
    )
)
export const test = Http.router.get(
    "/",
    Http.response.text("ok")
)

