import {Config, Effect, Layer, Match, pipe} from "effect"
import {NodeRuntime} from "@effect/platform-node"
import * as Sql from "@effect/sql-pg"
import * as Secret from "effect/Secret";
import {InitTaskRepository} from "./src/repositories/task.repository.ts";
import {InsertTaskSchema, TaskInsert, TaskSchema} from "./src/domain/task.schema.ts";
import {NoSuchElementException} from "effect/Cause";
import {undefined} from "effect/Match";


const insert = Effect.gen(function* (_) {
    const repository = yield* InitTaskRepository
    const task: TaskInsert = {
        task_name: "test1",
        task_description: "la description",
        status: "open"
    }
    return yield* repository.insert(task)
})


const getById = Effect.gen(function* (_) {
    const repository = yield* InitTaskRepository
    return yield* repository.getById("26f3edba-88ca-4d3b-a94f-e725e3ea8a2a")
})

const SqlLive = Sql.client.layer({
    database: Config.succeed("gdg"),
    username: Config.succeed("user"),
    port: Config.succeed(5432),
    password: Config.succeed(Secret.fromString("password")),
})


//pipe(insert, Effect.provide(SqlLive), Effect.runPromise).then(r => console.log(r))
pipe(getById, Effect.provide(SqlLive), Effect.runPromise).then(r => Match.value(r
).pipe(Match.when(
    {"_tag": "Some"},
    (task) => task.value,
), Match.orElse(() => "Oh, not John"))).then(x => console.log(x))