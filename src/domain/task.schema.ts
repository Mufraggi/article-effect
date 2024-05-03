
import * as S from "@effect/schema/Schema"


export const Task = S.Struct({
    id: S.UUID,
    taskName: S.String,
    taskDescription: S.String,
    status: S.String,
    createdAt: S.DateFromSelf,
    updatedAt: S.DateFromSelf
})
export const InsertTaskSchema = Task.pipe(S.omit("id", "createdAt", "updatedAt"))
export type TaskInsert = S.Schema.Type<typeof InsertTaskSchema>
export type TaskSchema = S.Schema.Type<typeof Task>
