import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";

export const workflows = sqliteTable(
  "workflows",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text("userId").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    definition: text("definition").notNull(),
    status: text("status").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date()),
  },
  (table) => [
    // Composite unique constraint on userId and name
    unique("name_user_id_unique").on(table.userId, table.name),
  ]
);
