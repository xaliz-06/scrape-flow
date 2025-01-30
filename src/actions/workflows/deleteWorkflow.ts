"use server";

import { db } from "@/server/db";
import { workflows } from "@/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteWorkflowById(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  await db
    .delete(workflows)
    .where(eq(workflows.userId, userId) && eq(workflows.id, id));

  revalidatePath("/workflows");
}
