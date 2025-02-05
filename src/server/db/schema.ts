import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";

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

export const workflowExecutions = sqliteTable("workflow_executions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("userId").notNull(),
  workflowId: text("workflowId")
    .notNull()
    .references(() => workflows.id, { onDelete: "cascade" }),
  trigger: text("trigger").notNull(),
  status: text("status").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  startedAt: integer("started_at", { mode: "timestamp_ms" }),
  completedAt: integer("completed_at", { mode: "timestamp_ms" }),
});

export const executionPhases = sqliteTable("workflow_phases", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("userId").notNull(),
  status: text("status").notNull(),
  number: integer("number").notNull(),
  node: text("mode").notNull(),
  name: text("name").notNull(),
  startedAt: integer("started_at", { mode: "timestamp_ms" }),
  completedAt: integer("completed_at", { mode: "timestamp_ms" }),
  inputs: text("inputs"),
  outputs: text("outputs"),
  creditsCost: integer("credits_costs"),
  workflowExecutionId: text("workflow_execution_id")
    .notNull()
    .references(() => workflowExecutions.id, { onDelete: "cascade" }),
});

export const workflowRelations = relations(workflows, ({ many }) => ({
  executions: many(workflowExecutions),
}));

export const workflowExecutionsRelations = relations(
  workflowExecutions,
  ({ one, many }) => ({
    workflow: one(workflows, {
      fields: [workflowExecutions.workflowId],
      references: [workflows.id],
    }),
    phases: many(executionPhases),
  })
);

export const executionPhasesRelaions = relations(
  executionPhases,
  ({ one }) => ({
    workflowExecution: one(workflowExecutions, {
      fields: [executionPhases.workflowExecutionId],
      references: [workflowExecutions.id],
    }),
  })
);
