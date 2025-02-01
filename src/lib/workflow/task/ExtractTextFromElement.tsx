import { TaskParamType, TaskType } from "@/types/task";
import { LucideProps, TextIcon } from "lucide-react";

export const ExtractTextFromElement = {
  type: TaskType.PAGE_TO_HTML,
  label: "Extract Text from Element",
  icon: (props: LucideProps) => (
    <TextIcon className="stroke-rose-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "HTML",
      type: TaskParamType.STRING,
      required: true,
      variant: "textarea",
    },
    {
      name: "Selector",
      type: TaskParamType.STRING,
      required: true,
    },
  ],
  outputs: [
    {
      name: "Extracted Text",
      type: TaskParamType.STRING,
    },
  ],
};
