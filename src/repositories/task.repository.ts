import { Effect } from "effect"
import * as Sql from "@effect/sql-pg"
import {InsertTaskSchema, Task} from "../domain/task.schema.ts";
import {Schema} from "@effect/schema";

export const InitTaskRepository = Effect.gen(function* (_) {
    const sql = yield* _(Sql.client.PgClient)

    const InsertPerson = yield* _(
        Sql.resolver.ordered("InsertTask", {
            Request: InsertTaskSchema,
            Result: Task,
            execute: (requests) =>
                sql`
        INSERT INTO tasks ${sql.insert(requests)} RETURNING tasks.*
      `
        })
    )

    const GetById = yield* _(
        Sql.resolver.findById("GetPersonById", {
            Id: Schema.UUID,
            Result: Task,
            ResultId: (_) => _.id,
            execute: (ids) => sql`SELECT * FROM tasks WHERE ${sql.in("id", ids)}`
        })
    )
    //todo change the type of the
    const getById = (id: string) =>
        Effect.withRequestCaching(true)(GetById.execute(id))

    const insert = InsertPerson.execute

    return { insert, getById }
})