import {BunHttpServer, BunRuntime} from "@effect/platform-bun";
import * as Http from "@effect/platform/HttpServer"
import {health, test} from "./src/api/health/health.route.ts";
import {Config, Effect, Layer} from "effect";
import {insertTask} from "./src/api/tasks/insetTask.ts";
import * as Sql from "@effect/sql-pg";
import * as Secret from "effect/Secret";
import {getTaskById} from "./src/api/tasks/getById.ts";


const SqlLive = Sql.client.layer({
    database: Config.succeed("gdg"),
    username: Config.succeed("user"),
    port: Config.succeed(5432),
    password: Config.succeed(Secret.fromString("password")),
})

const a = Layer.mergeAll(SqlLive)

const ServerLive = BunHttpServer.server.layer({port: 3000})
const HttpLive = Http.router.empty.pipe(
    health,
    insertTask,
    getTaskById,
    Effect.catchTag("RouteNotFound", () => Http.response.empty({status: 404})),
    Http.server.serve(Http.middleware.logger),
    Http.server.withLogAddress,
    Layer.provide(a),
    Layer.provide(ServerLive),
)

BunRuntime.runMain(Layer.launch(HttpLive))
