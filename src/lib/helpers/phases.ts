import { executionPhases } from "@/server/db/schema";

type Phase = Pick<typeof executionPhases.$inferSelect, 'creditsConsumed'>

export function GetPhasesTotalCost(phases: Phase[]) {
    return phases.reduce((acc, phase) => acc + (phase.creditsConsumed || 0), 0)
}