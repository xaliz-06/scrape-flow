"use server";

import { db } from "@/server/db";
import { workflows } from "@/server/db/schema";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function UpdateWorkflow({
  id,
  definition,
}: {
  id: string;
  definition: string;
}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const workflow = await db.query.workflows.findFirst({
    where: (model, { eq }) => eq(model.userId, userId) && eq(model.id, id),
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error("Workflow is not in draft state");
  }

  await db
    .update(workflows)
    .set({
      definition: definition,
    })
    .where(eq(workflows.id, id) && eq(workflows.userId, userId));

  revalidatePath("/workflows");
}
