"use server";

import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { workflows } from "@/server/db/schema";

export async function getUserWorkflows() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  return db.query.workflows.findMany({
    where: (model, { eq }) => eq(model.userId, userId),
    orderBy: (model, { asc }) => asc(model.createdAt),
  });
}

export type Workflow = typeof workflows.$inferSelect;
