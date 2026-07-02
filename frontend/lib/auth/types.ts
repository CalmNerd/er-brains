export type AuthUser = {
  id: number
  email: string
  name: string | null
  createdAt: string
}

export type AuthResponse = {
  user: AuthUser
  token: string
}
