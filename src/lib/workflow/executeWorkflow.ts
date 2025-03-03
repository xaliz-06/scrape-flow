import 'server-only'
import { db } from '@/server/db';
import { executionPhases, workflowExecutions, workflows } from '@/server/db/schema';
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from '@/types/workflow';
import { eq, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { AppNode } from '@/types/appNode';
import { TaskRegistry } from './task/registry';
import { waitFor } from '../helpers/waitFor';
import { ExecutorRegistry } from './executor/registry';

type ExecutionPhase = typeof executionPhases.$inferSelect

export async function ExecuteWorkflow(executionId: string) {
    const execution = await db.query.workflowExecutions.findFirst({
        where: (model, { eq }) => eq(model.id, executionId),
        with: {
            phases: true,
            workflow: true
        }
    });

    if (!execution) {
        throw new Error("Execution not found")
    }

    const environment = { phases: {} }

    await initializeWorkflowExecution(executionId, execution.workflowId);
    await initializePhaseStatuses(execution);

    let creditsConsumed = 0;
    let executionFailed = false;

    for (const phase of execution.phases) {
        const phaseExecution = await executeWorkflowPhase(phase)

        if (!phaseExecution.success) {
            executionFailed = true;
            break;
        }
    }

    await finalizeWorkflowExecution(executionId, execution.workflowId, executionFailed, creditsConsumed)

    revalidatePath("/workflows/runs")
}

async function initializeWorkflowExecution(executionId: string, workflowId: string) {
    await db
        .update(workflowExecutions)
        .set({
          startedAt: new Date(),
          status: WorkflowExecutionStatus.RUNNING
        })
        .where(eq(workflowExecutions.id, executionId));

    await db.update(workflows)
            .set({
                lastRunAt: new Date(),
                lastRunId: executionId,
                lastRunStatus: WorkflowExecutionStatus.RUNNING
            })
            .where(eq(workflows.id, workflowId))
    
}

async function initializePhaseStatuses(execution: any) {
    const phaseIds = execution.phases.map((phase: any) => phase.id)
    await db.update(executionPhases)
            .set({
                status: ExecutionPhaseStatus.PENDING
            })
            .where(inArray(executionPhases.id, phaseIds))
}

async function finalizeWorkflowExecution(
    executionId: string,
    workflowId: string,
    executionFailed: boolean,
    creditsConsumed: number
) {
    const finalStatus = executionFailed ? WorkflowExecutionStatus.FAILED : WorkflowExecutionStatus.COMPLETED

    await db.update(workflowExecutions)
            .set({
                status: finalStatus,
                completedAt: new Date(),
                creditsConsumed: creditsConsumed
            })
            .where(eq(workflowExecutions.workflowId, workflowId) && eq(workflowExecutions.id, executionId));

    await db.update(workflows)
            .set({
                lastRunStatus: finalStatus
            })
            .where(eq(workflows.id, workflowId) && eq(workflows.lastRunId, executionId)).catch((err) => {
                // IGNORE
                // this means that we have triggered other runs for this workflow
                // wile execution was running
            })
}

async function executeWorkflowPhase(phase: ExecutionPhase) {
    const startedAt = new Date()
    const node = JSON.parse(phase.node) as AppNode;

    await db.update(executionPhases)
            .set({
                status: ExecutionPhaseStatus.RUNNING,
                startedAt: startedAt
            })
            .where(eq(executionPhases.id, phase.id))
          
    const creditsRequired = TaskRegistry[node.data.type].credits
    console.log(
        `Execution phase ${phase.name} with ${creditsRequired} credits consumed`
    )

    const success = await executePhase(phase, node)

    await finalizePhase(phase.id, success)
    return {success};
}

async function finalizePhase(phaseId: string, success: boolean) {
    const finalStatus = success ? ExecutionPhaseStatus.COMPLETED : ExecutionPhaseStatus.FAILED

    await db.update(executionPhases)
            .set({
                status: finalStatus,
                completedAt: new Date()
            })
            .where(eq(executionPhases.id, phaseId))
}

async function executePhase(phase: ExecutionPhase, node: AppNode): Promise<boolean> {
    const runFn = ExecutorRegistry[node.data.type];
    if (!runFn) {
        return false;
    }

    return await runFn();
}