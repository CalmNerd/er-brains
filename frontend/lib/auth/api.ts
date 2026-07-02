import { apiRequest } from "@/lib/api/client"
import { endpoints } from "@/lib/api/endpoints"
import type { LoginInput, SignupInput } from "@/lib/auth/schema"
import type { AuthResponse, AuthUser } from "@/lib/auth/types"

export async function login(input: LoginInput): Promise<AuthResponse> {
  return apiRequest<AuthResponse>(endpoints.auth.login, {
    method: "POST",
    data: input,
  })
}

export async function signup(input: SignupInput): Promise<AuthResponse> {
  return apiRequest<AuthResponse>(endpoints.auth.signup, {
    method: "POST",
    data: input,
  })
}

export async function getCurrentUser(): Promise<AuthUser> {
  return apiRequest<AuthUser>(endpoints.auth.me)
}
