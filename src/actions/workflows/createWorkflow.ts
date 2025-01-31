"use server";

import {
  createWorkflowSchema,
  CreateWorkflowSchemaType,
} from "@/schema/workflow";
import { db } from "@/server/db";
import { workflows } from "@/server/db/schema";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function createWorkflow(form: CreateWorkflowSchemaType) {
  const { success, data } = createWorkflowSchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const [result] = await db
    .insert(workflows)
    .values({
      userId,
      status: WorkflowStatus.DRAFT,
      definition: "TODO",
      ...data,
    })
    .returning();

  if (!result) {
    throw new Error("Failed to create workflow");
  }

  redirect(`/workflow/editor/${result.id}`);
}
