import { TaskConfig, TaskType } from "@/types/task";
import { LaunchBrowserTask } from "./LaunchBrowser";

export type TaskRegistryType = {
  [K in TaskType]: TaskConfig;
};

export const TaskRegistry: TaskRegistryType = {
  [TaskType.LAUNCH_BROWSER]: LaunchBrowserTask,
};
