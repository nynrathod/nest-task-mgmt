export interface User {
  firstName: string;
  email: string;
  id: number;
}

export interface Task {
  id?: number;
  title: string;
  reminder: string | null;
  status: boolean;
  processing?: true;
  assignee?: User;
  tempId?: number;
}
