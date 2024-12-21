import Network from "../network";
import Config from "./PathConfig.ts";
import { Task } from "../../types.tsx";

export const createTask = async (task: Task) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { processing, ...taskWithoutProcessing } = task;
  const taskForApi = {
    ...taskWithoutProcessing,
    assignee: {
      firstName: task.assignee?.firstName,
      email: task.assignee?.email,
      id: task.assignee?.id,
    },
  };

  return await Network.post({
    url: Config.api.task.createTask,
    body: taskForApi,
  });
};

export const updatetask = async (task: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { processing, ...taskWithoutProcessing } = task;
  return await Network.put({
    url: Config.api.task.updateTask(task.id),
    body: taskWithoutProcessing,
  });
};

export const deleteTask = async (task: any) => {
  return await Network.delete({
    url: Config.api.task.deleteTask(task),
  });
};

export const updateTaskStatus = async ({
  id,
  status,
}: {
  id: number;
  status: boolean;
}) => {
  return await Network.put({
    url: Config.api.task.updateStatusTask(id),
    body: {
      status: status,
    },
  });
};

export const getAllTask = async () => {
  return await Network.get({
    url: Config.api.task.getallTasks,
  });
};
