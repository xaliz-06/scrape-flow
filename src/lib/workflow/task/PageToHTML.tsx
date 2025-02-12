import { TaskConfig, TaskParamType, TaskType } from "@/types/task";
import { CodeIcon, LucideProps } from "lucide-react";

export const PageToHTMLTask = {
  type: TaskType.PAGE_TO_HTML,
  label: "Get HTML from webpage",
  icon: (props: LucideProps) => (
    <CodeIcon className="stroke-rose-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Webpage",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
  ],
  outputs: [
    {
      name: "HTML",
      type: TaskParamType.STRING,
    },
    {
      name: "Webpage",
      type: TaskParamType.BROWSER_INSTANCE,
    },
  ],
  credits: 2,
} satisfies TaskConfig;
