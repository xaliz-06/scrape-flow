"use server"

import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";

export async function GetWorkflowPhaseDetails(phaseId: string) {
    const {userId} = await auth();

    if (!userId) {
        throw new Error("Unauthenticated")
    }

    return db.query.executionPhases.findFirst({
        where: (model, { eq }) => eq(model.userId, userId) && eq(model.id, phaseId),
    });
}