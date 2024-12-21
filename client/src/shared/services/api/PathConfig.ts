const Environment = {
  baseUrl: import.meta.env.VITE_API_BASE_URL,
};

const Config = {
  base: {
    admin: Environment.baseUrl,
  },
  api: {
    auth: {
      login: `${Environment.baseUrl}auth/login`,
      signup: `${Environment.baseUrl}auth/signup`,
      users: `${Environment.baseUrl}auth/users`,
    },
    task: {
      createTask: `${Environment.baseUrl}tasks`,
      getallTasks: `${Environment.baseUrl}tasks`,
      updateTask: (taskId: number) => `${Environment.baseUrl}tasks/${taskId}`,
      updateStatusTask: (taskId: number) =>
        `${Environment.baseUrl}tasks/${taskId}/status`,
      deleteTask: (taskId: number) => `${Environment.baseUrl}tasks/${taskId}`,
    },
  },
};

export default Config;
