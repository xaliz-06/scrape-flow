import { getUserWorkflowById } from "@/actions/workflows/getWorkflowById";
import { auth } from "@clerk/nextjs/server";
import React from "react";
import Editor from "../../_components/Editor";

const page = async ({ params }: { params: { workflowId: string } }) => {
  const { workflowId } = params;

  const { userId } = await auth();
  if (!userId) return <div>Not authenticated</div>;

  const workflow = await getUserWorkflowById(workflowId);
  if (!workflow) {
    return <div>Workflow not found</div>;
  }

  return <Editor workflow={workflow} />;
};

export default page;
