"use server"
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server"


export async function GetWorkflowExecutionWithPhases(executionId: string) {
    const {userId} = await auth()
    if (!userId) {
        throw new Error("Unauthenticated")
    }

    return db.query.workflowExecutions.findFirst({
        where: (model, { eq }) => eq(model.userId, userId) && eq(model.id, executionId),
        with: {
            phases: true
        }
    });
}