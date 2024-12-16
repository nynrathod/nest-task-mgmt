export interface User {
  name: string;
  email: string;
}

export interface Task {
  id?: string;
  title: string;
  due: string | null;
  done: boolean;
  assignee?: User;
}
