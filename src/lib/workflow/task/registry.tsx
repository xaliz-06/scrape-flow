import { TaskConfig, TaskType } from "@/types/task";
import { LaunchBrowserTask } from "./LaunchBrowser";
import { PageToHTMLTask } from "./PageToHTML";

export type TaskRegistryType = {
  [K in TaskType]: TaskConfig;
};

export const TaskRegistry: TaskRegistryType = {
  [TaskType.LAUNCH_BROWSER]: LaunchBrowserTask,
  [TaskType.PAGE_TO_HTML]: PageToHTMLTask,
};
