"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { AuthLayout } from "@/components/auth/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ApiError } from "@/lib/api/client"
import { login as loginRequest } from "@/lib/auth/api"
import { loginSchema, type LoginInput } from "@/lib/auth/schema"
import { setAuthToken } from "@/lib/auth/storage"

const initialValues: LoginInput = {
  email: "",
  password: "",
}

export function LoginForm() {
  const router = useRouter()
  const [values, setValues] = useState<LoginInput>(initialValues)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginInput, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField<K extends keyof LoginInput>(key: K, value: LoginInput[K]) {
    setValues((current) => ({ ...current, [key]: value }))
    setFieldErrors((current) => ({ ...current, [key]: undefined }))
  }

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const parsed = loginSchema.safeParse(values)
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      setFieldErrors({
        email: errors.email?.[0],
        password: errors.password?.[0],
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await loginRequest(parsed.data)
      setAuthToken(result.token)
      toast.success("Welcome back!")
      router.push("/dashboard")
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Unable to sign in right now."
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Organize work effortlessly."
      description="Sign in to manage tasks, track priorities, and collaborate with your team across boards and lists."
      quote="ER Brains keeps our sprint board and backlog in one place. We ship faster because nothing gets lost."
      quoteAuthor="product team lead"
    >
      <div className="mx-auto w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center justify-center space-y-1 text-center lg:items-start lg:text-left">
          <h1 className="text-2xl font-medium">Welcome back</h1>
          <p className="text-muted-foreground text-xs font-light">
            Sign in with your email to continue to your workspace.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={values.email}
              aria-invalid={Boolean(fieldErrors.email)}
              onChange={(event) => updateField("email", event.target.value)}
            />
            {fieldErrors.email ? (
              <p className="text-destructive text-xs">{fieldErrors.email}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={values.password}
              aria-invalid={Boolean(fieldErrors.password)}
              onChange={(event) => updateField("password", event.target.value)}
            />
            {fieldErrors.password ? (
              <p className="text-destructive text-xs">{fieldErrors.password}</p>
            ) : null}
          </div>

          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in with email"}
          </Button>
        </form>

        <p className="text-muted-foreground text-center text-xs">
          Don&apos;t have an account?{" "}
          <Link className="text-foreground hover:text-primary underline underline-offset-4" href="/signup">
            Create one
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
