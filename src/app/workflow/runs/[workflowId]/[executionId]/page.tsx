import Topbar from "@/app/workflow/_components/topbar/Topbar";
import { Suspense } from "react";

export default function ExecutionViewerPage({
  params,
}: {
  params: {
    workflowId: string;
    executionId: string;
  };
}) {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Topbar
        workflowId={params.workflowId}
        title="Workflow run details"
        subTitle={`Run ID: ${params.executionId}`}
        hideButtons
      />
      <section className="flex h-full overflow-auto">
        <Suspense></Suspense>
      </section>
    </div>
  );
}
