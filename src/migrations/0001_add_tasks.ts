import * as Effect from "effect/Effect";
import * as Sql from "@effect/sql-pg"

export default Effect.flatMap(
    Sql.client.PgClient,
    (sql) => sql`
    CREATE TABLE tasks (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      task_name VARCHAR(255) NOT NULL,
      task_description TEXT,
      status VARCHAR(50) DEFAULT 'Todo',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `
)
