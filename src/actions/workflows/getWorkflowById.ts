"use server";

import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";

export async function getUserWorkflowById(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  return db.query.workflows.findFirst({
    where: (model, { eq }) => eq(model.userId, userId) && eq(model.id, id),
  });
}
