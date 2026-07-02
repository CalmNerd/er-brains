export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  teams: {
    all: ["teams"] as const,
  },
  tasks: {
    all: ["tasks"] as const,
    byTeam: (teamId: number) => ["tasks", teamId] as const,
  },
} as const
