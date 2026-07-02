"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { AuthLayout } from "@/components/auth/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ApiError } from "@/lib/api/types"
import { signup as signupRequest } from "@/lib/auth/api"
import { signupSchema, type SignupInput } from "@/lib/auth/schema"
import { setAuthToken } from "@/lib/auth/storage"
import { useAuthStore } from "@/stores/auth-store"

const initialValues: SignupInput = {
  name: "",
  email: "",
  password: "",
}

export function SignupForm() {
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)
  const [values, setValues] = useState<SignupInput>(initialValues)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof SignupInput, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField<K extends keyof SignupInput>(key: K, value: SignupInput[K]) {
    setValues((current) => ({ ...current, [key]: value }))
    setFieldErrors((current) => ({ ...current, [key]: undefined }))
  }

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const parsed = signupSchema.safeParse(values)
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      setFieldErrors({
        name: errors.name?.[0],
        email: errors.email?.[0],
        password: errors.password?.[0],
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await signupRequest(parsed.data)
      setAuthToken(result.token)
      setUser(result.user)
      toast.success("Account created successfully!")
      router.push("/dashboard")
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Unable to create your account right now."
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Start shipping with clarity."
      description="Create your workspace, invite your team, and keep every task organized from day one."
      quote="We moved our backlog into ER Brains in an afternoon and finally stopped juggling spreadsheets."
      quoteAuthor="engineering manager"
    >
      <div className="mx-auto w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center justify-center space-y-1 text-center lg:items-start lg:text-left">
          <h1 className="text-2xl font-medium">Create your account</h1>
          <p className="text-muted-foreground text-xs font-light">
            Sign up with email to get your default team workspace instantly.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Jane Doe"
              value={values.name}
              aria-invalid={Boolean(fieldErrors.name)}
              onChange={(event) => updateField("name", event.target.value)}
            />
            {fieldErrors.name ? (
              <p className="text-destructive text-xs">{fieldErrors.name}</p>
            ) : null}
          </div>

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
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={values.password}
              aria-invalid={Boolean(fieldErrors.password)}
              onChange={(event) => updateField("password", event.target.value)}
            />
            {fieldErrors.password ? (
              <p className="text-destructive text-xs">{fieldErrors.password}</p>
            ) : null}
          </div>

          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Sign up with email"}
          </Button>
        </form>

        <p className="text-muted-foreground text-center text-xs">
          Already have an account?{" "}
          <Link className="text-foreground hover:text-primary underline underline-offset-4" href="/login">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
