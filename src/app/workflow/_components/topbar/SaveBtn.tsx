"use client";

import { UpdateWorkflow } from "@/actions/workflows/updateWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";

const SaveBtn = ({ workflowId }: { workflowId: string }) => {
  const { toObject } = useReactFlow();

  const saveMutation = useMutation({
    mutationFn: UpdateWorkflow,
    onSuccess: () => {
      toast.success("Workflow saved successfully", { id: "save-workflow" });
    },
    onError: () => {
      toast.error("Something went wrong", { id: "save-workflow" });
    },
  });

  const handleSave = () => {
    const workflowDefinition = JSON.stringify(toObject());
    toast.loading("Saving workflow...", { id: "save-workflow" });
    saveMutation.mutate({ id: workflowId, definition: workflowDefinition });
  };
  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2"
      onClick={handleSave}
    >
      <CheckIcon size={16} className="stroke-primary" />
      Save
    </Button>
  );
};

export default SaveBtn;
