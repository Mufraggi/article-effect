import {Effect, Option} from "effect";
import {InitTaskRepository} from "../../repositories/task.repository.ts";
import * as Http from "@effect/platform/HttpServer"
import {TaskId, TaskSchema} from "../../domain/task.schema.ts";
import {ServerResponse} from "@effect/platform/Http/ServerResponse";
import {HttpServer} from "@effect/platform";

export const getTaskById = Http.router.get(
    "/tasks/:id",
    Effect.gen(function* (_) {
            const repository = yield* InitTaskRepository
            const params = yield* Http.router.params
            if (params.id === undefined) {
                return HttpServer.response.unsafeJson(
                    {message: "id not found"},
                    {status: 400})
            }
            const effect = repository.getById(params.id)
            const res = Effect.match(effect, {
                onFailure(e): ServerResponse {
                    if (e._tag === "SqlError") {
                        return HttpServer.response.unsafeJson(
                            {message: "sql error"},
                            {status: 500})
                    } else if (e._tag === "ParseError") {
                        return HttpServer.response.unsafeJson(
                            {message: "parse error"},
                            {status: 500}
                        )
                    }
                    return HttpServer.response.unsafeJson(
                        {message: e},
                        {status: 500}
                    )
                },
                onSuccess(value): ServerResponse {
                    return Option.match(value, {
                        onNone: () => HttpServer.response.unsafeJson(
                            {message: "Task not found"},
                            {status: 404},
                        ),
                        onSome: (task: TaskSchema) => HttpServer.response.unsafeJson(
                            task,
                            {status: 200},
                        )
                    })
                }

            });
            return yield* res;
        }
    )
)
