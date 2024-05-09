import {Effect, pipe} from "effect";
import {InitTaskRepository} from "../../repositories/task.repository.ts";
import * as Http from "@effect/platform/HttpServer"
import {InsertTaskSchema, TaskInsert, TaskSchema} from "../../domain/task.schema.ts";
import {ResultLengthMismatch, SqlError} from "@effect/sql/Error";
import {ParseError} from "@effect/schema/ParseResult";
import {ServerResponse} from "@effect/platform/Http/ServerResponse";
import {HttpServer} from "@effect/platform";

export const insertTask = Http.router.post(
    "/tasks",
    Effect.gen(function* (_) {
            const repository = yield* InitTaskRepository
            const data: { [K in keyof TaskInsert]: TaskInsert[K] } = yield* Http.request.schemaBodyJson(InsertTaskSchema)
            const effect = repository.insert(data)
            const res = Effect.match(effect, {
                onFailure(e: ResultLengthMismatch | SqlError | ParseError): ServerResponse {
                    return HttpServer.response.unsafeJson(
                        {message: e},
                        {status: 404},
                    )
                }, onSuccess(value: TaskSchema): ServerResponse {
                    return HttpServer.response.unsafeJson(
                        value,
                        {status: 201},
                    )
                },
            });
            return yield* res;
        }
    )
)