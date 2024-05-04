
import * as S from "@effect/schema/Schema"


export const Task = S.Struct({
    id: S.UUID,
    task_name: S.String,
    task_description: S.String,
    status: S.String,
    created_at: S.DateFromSelf,
    updated_at: S.DateFromSelf
})
export const InsertTaskSchema = Task.pipe(S.omit("id", "created_at", "updated_at"))
export type TaskInsert = S.Schema.Type<typeof InsertTaskSchema>
export type TaskSchema = S.Schema.Type<typeof Task>
