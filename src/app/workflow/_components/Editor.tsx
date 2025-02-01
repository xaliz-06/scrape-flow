"use client";

import { Workflow } from "@/actions/workflows/getWorkflowsUser";
import React from "react";

import { ReactFlowProvider } from "@xyflow/react";
import WorkflowEditor from "./WorkflowEditor";
import Topbar from "./topbar/Topbar";
import { TaskMenu } from "./TaskMenu";

const Editor = ({ workflow }: { workflow: Workflow }) => {
  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-full w-full overflow-hidden">
        <Topbar
          title="Workflow Editor"
          subTitle={workflow.name}
          workflowId={workflow.id}
        />
        <section className="flex h-full overflow-auto">
          <TaskMenu />
          <WorkflowEditor workflow={workflow} />
        </section>
      </div>
    </ReactFlowProvider>
  );
};

export default Editor;
