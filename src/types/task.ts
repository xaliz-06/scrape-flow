import { LucideIcon, LucideProps } from "lucide-react";

export enum TaskType {
  LAUNCH_BROWSER,
}

export enum TaskParamType {
  STRING = "STRING",
}

export interface ParamProps {
  param: TaskParam;
  value: string;
  updateNodeParamValue: (newValue: string) => void;
}

export interface TaskParam {
  name: string;
  type: TaskParamType;
  helperText?: string;
  required?: boolean;
  hideHandle?: boolean;
  [key: string]: any;
}
export interface TaskConfig {
  type: TaskType;
  label: string;
  icon: (props: LucideProps) => React.JSX.Element;
  isEntryPoint: boolean;
  inputs: TaskParam[];
}
