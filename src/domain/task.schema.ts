
import * as S from "@effect/schema/Schema"


const Task = S.Struct({
    id: S.UUID,
    taskName: S.String,
    taskDescription: S.String,
    status: S.String,
    createdAt: S.DateFromSelf,
    updatedAt: S.DateFromSelf
})
export type TaskSchema = S.Schema.Type<typeof Task>

