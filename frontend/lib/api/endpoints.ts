export const endpoints = {
  auth: {
    login: "/api/auth/login",
    signup: "/api/auth/signup",
    me: "/api/auth/me",
  },
  teams: {
    list: "/api/teams",
    byId: (id: number) => `/api/teams/${id}`,
  },
  tasks: {
    list: "/api/tasks",
    byId: (id: number) => `/api/tasks/${id}`,
  },
  ai: {
    suggest: "/api/ai/suggest",
  },
} as const
