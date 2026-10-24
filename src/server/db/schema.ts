import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Fase 0 tracer table: proves D1 reads on Workers.
export const health = sqliteTable("health", {
  id: integer("id").primaryKey(),
  note: text("note").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});
