"use client";

import { deleteWorkflowById } from "@/actions/workflows/deleteWorkflow";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  workflowName: string;
  workflowId: string;
}

export function DeleteWorkflowDialog({
  isOpen,
  setIsOpen,
  workflowName,
  workflowId,
}: Props) {
  const [confirmText, setConfirmText] = React.useState("");

  const deleteMutation = useMutation({
    mutationFn: deleteWorkflowById,
    onSuccess: () => {
      toast.success("Workflow deleted successfully", { id: workflowId });
      setConfirmText("");
    },
    onError: () => {
      toast.error("Something went wrong", { id: workflowId });
    },
  });
  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={() => {
        setConfirmText("");
        setIsOpen(!isOpen);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          Are you sure you want to delete this workflow?
          <AlertDialogDescription>
            If you delete this workflow, it will be permanently removed from
            your account.
            <div className="flex flex-col py-4 gap-4">
              <p>
                If you are sure, enter <b>{workflowName}</b> to confirm:
              </p>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={confirmText !== workflowName || deleteMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={(e) => {
              e.stopPropagation();
              toast.loading("Deleting workflow...", { id: workflowId });
              deleteMutation.mutate(workflowId);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
