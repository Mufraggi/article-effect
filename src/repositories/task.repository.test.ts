import {expect, test} from "bun:test";
import {Config, Effect, Option, pipe} from "effect";
import {InitTaskRepository} from "./task.repository.ts";
import {TaskInsert, TaskSchema} from "../domain/task.schema.ts";
import * as Sql from "@effect/sql-pg";
import * as Secret from "effect/Secret";
import {UUID} from "@effect/schema/Schema";
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
let id: UUID
type UUID = string;
const getById = Effect.gen(function* (_) {
    const repository = yield* InitTaskRepository
    return yield* repository.getById(id)
})

const SqlLive = Sql.client.layer({
    database: Config.succeed("gdg"),
    username: Config.succeed("user"),
    port: Config.succeed(5432),
    password: Config.succeed(Secret.fromString("password")),
})

test("insert", async () => {
    const insertP = await pipe(insert, Effect.provide(SqlLive), Effect.runPromise)
    expect(insertP).toEqual({
        id: expect.any(String),
        status: "open",
        task_description: "la description",
        task_name: "test1",
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
    })
})

test("getById", async () => {
    const res = await pipe(insert, Effect.provide(SqlLive), Effect.runPromise)
    id = res.id
    const a = await pipe(getById, Effect.provide(SqlLive), Effect.runPromise)
    const result = Option.match(a, {
        onNone: () => undefined,
        onSome: (value: TaskSchema) => value
    })
    if (result) {
        expect(result).toEqual(res)
    }

})