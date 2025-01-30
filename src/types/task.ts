import { LucideIcon, LucideProps } from "lucide-react";

export enum TaskType {
  LAUNCH_BROWSER,
}

export interface TaskConfig {
  type: TaskType;
  label: string;
  icon: (props: LucideProps) => React.JSX.Element;
  isEntryPoint: boolean;
}
