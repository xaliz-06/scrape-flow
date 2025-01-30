"use client";

import { Workflow } from "@/actions/workflows/getWorkflowsUser";
import React from "react";

import { ReactFlowProvider } from "@xyflow/react";
import WorkflowEditor from "./WorkflowEditor";

const Editor = ({ workflow }: { workflow: Workflow }) => {
  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-full w-full overflow-hidden">
        <section className="flex h-full overflow-auto">
          <WorkflowEditor workflow={workflow} />
        </section>
      </div>
    </ReactFlowProvider>
  );
};

export default Editor;
