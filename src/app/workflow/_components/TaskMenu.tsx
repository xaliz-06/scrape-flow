"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { TaskType } from "@/types/task";
import React from "react";

export const TaskMenu = () => {
  return (
    <aside className="w-[20rem] min-w-[20rem] max-w-[20rem] border-r-2 border-separate p-2 px-4 overflow-auto">
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={["extraction"]}
      >
        <AccordionItem value="extraction">
          <AccordionTrigger className="font-bold">
            Data extraction
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn taskType={TaskType.PAGE_TO_HTML} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
};

export const TaskMenuBtn = ({ taskType }: { taskType: TaskType }) => {
  const task = TaskRegistry[taskType];
  const onDragStart = (e: React.DragEvent, type: TaskType) => {
    e.dataTransfer.setData("application/reactflow", type);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <Button
      className="flex justify-between items-center gap-2 border w-full"
      draggable
      variant={"secondary"}
      onDragStart={(e) => onDragStart(e, taskType)}
    >
      <div className="flex gap-2">
        <task.icon size={20} />
        {task.label}
      </div>
    </Button>
  );
};
