"use server";

import { flowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { db } from "@/server/db";
import { executionPhases, workflowExecutions } from "@/server/db/schema";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionPlan,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
} from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function RunWorkflow(form: {
  workflowId: string;
  flowDefinition?: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("unauthenticated");
  }

  const { workflowId, flowDefinition } = form;

  if (!workflowId) {
    throw new Error("workflowId is required");
  }

  const workflow = await db.query.workflows.findFirst({
    where: (model, { eq }) =>
      eq(model.userId, userId) && eq(model.id, workflowId),
  });

  if (!workflow) {
    throw new Error("workflow is undefined");
  }

  let executionPlan: WorkflowExecutionPlan;

  if (!flowDefinition) {
    throw new Error("flow definition is not defined");
  }

  const flow = JSON.parse(flowDefinition);
  const result = flowToExecutionPlan(flow.nodes, flow.edges);

  if (result.error) {
    throw new Error("flow definition is not valid");
  }

  if (!result.executionPlan) {
    throw new Error("no execution plan generated");
  }
  executionPlan = result.executionPlan;

  const [execution] = await db
    .insert(workflowExecutions)
    .values({
      workflowId,
      userId,
      status: WorkflowExecutionStatus.PENDING,
      startedAt: new Date(),
      trigger: WorkflowExecutionTrigger.MANUAL,
    })
    .returning();

  if (!execution) {
    throw new Error("failed to create workflow execution");
  }

  const phases = await db.insert(executionPhases).values(
    executionPlan.flatMap((phase) => {
      return phase.nodes.map((node) => {
        return {
          userId,
          status: ExecutionPhaseStatus.CREATED,
          number: phase.phase,
          node: JSON.stringify(node),
          name: TaskRegistry[node.data.type].label,
          workflowExecutionId: execution.id,
          startedAt: new Date(),
        };
      });
    })
  );

  if (!phases) {
    throw new Error("failed to create phases");
  }

  redirect(`/workflow/runs/${workflow.id}/${execution.id}`);
}
