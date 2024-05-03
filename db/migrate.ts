import { Config, Effect, Layer, pipe } from "effect"
import { NodeContext, NodeRuntime } from "@effect/platform-node"
import * as Sql from "@effect/sql-pg"
import { fileURLToPath } from "node:url"
import * as Secret from "effect/Secret";


const program = Effect.gen(function* (_) {
    // ...
})

const SqlLive = Sql.client.layer({
    database: Config.succeed("gdg"),
    username: Config.succeed("user"),
    port: Config.succeed(5432),
    password: Config.succeed( Secret.fromString("password")),
})

const MigratorLive = Sql.migrator
    .layer({
        loader: Sql.migrator.fromFileSystem(
            fileURLToPath(new URL("migrations", import.meta.url))
        ),
        schemaDirectory: "migrations"
    })
    .pipe(Layer.provide(SqlLive))

const EnvLive = Layer.mergeAll(SqlLive, MigratorLive).pipe(
    Layer.provide(NodeContext.layer)
)

pipe(program, Effect.provide(EnvLive), NodeRuntime.runMain)