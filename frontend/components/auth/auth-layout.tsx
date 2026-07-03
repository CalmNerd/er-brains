import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeftIcon } from "@hugeicons/core-free-icons"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"

type AuthLayoutProps = {
  children: React.ReactNode
  title: string
  description: string
  quote: string
  quoteAuthor: string
}

export function AuthLayout({
  children,
  title,
  description,
  quote,
  quoteAuthor,
}: AuthLayoutProps) {
  return (
    <main
      className={cn(
        "relative mx-auto min-h-svh max-w-6xl lg:grid lg:min-h-svh lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]",
        "bg-muted/10",
        "before:absolute before:-inset-y-0 before:-left-px before:w-px before:bg-border",
        "after:absolute after:-inset-y-0 after:-right-px after:w-px after:bg-border"
      )}
    >
      <div className="relative hidden min-h-svh flex-col border-r bg-secondary p-8 lg:flex lg:p-10 dark:bg-secondary/20">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background" />

        <Link
          href="/"
          className={cn(buttonVariants({ variant: "ghost" }), "relative z-10 w-fit")}
        >
          <HugeiconsIcon icon={ArrowLeftIcon} strokeWidth={2} className="size-3.5" />
          Home
        </Link>

        <div className="relative z-10 flex flex-1 flex-col justify-center py-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-medium xl:text-3xl">{title}</h2>
            <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <blockquote className="relative z-10 space-y-1">
          <p className="text-foreground/90 text-sm leading-relaxed">
            &ldquo;{quote}&rdquo;
          </p>
          <footer className="text-muted-foreground text-sm">
            <span className="text-muted-foreground text-xs font-light">
              {quoteAuthor}
            </span>
          </footer>
        </blockquote>
      </div>

      <div className="relative flex min-h-svh flex-col">
        <div
          aria-hidden
          className="absolute inset-0 isolate -z-10 opacity-30 contain-strict"
        >
          <div className="absolute top-0 right-0 h-320 w-full -translate-y-87.5 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)]" />
          <div className="absolute top-0 right-0 h-320 w-full rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="absolute top-0 right-0 h-320 w-full -translate-y-87.5 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)]" />
        </div>

        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute top-6 left-5 lg:hidden"
          )}
        >
          <HugeiconsIcon icon={ArrowLeftIcon} strokeWidth={2} className="size-3.5" />
          Home
        </Link>

        <div className="flex items-center justify-center gap-1.5 px-8 pt-10 pb-6 text-lg font-medium lg:pt-12">
          <Image src="/assets/erbrains-logo.png" alt="ER Brains" width={100} height={100} />
        </div>

        <div className="flex flex-1 flex-col justify-center px-8">{children}</div>

        <p className="text-muted-foreground px-8 pb-8 text-center text-xs">
          By continuing, you agree to ER Brains&apos;s{" "}
          <a
            className="hover:text-primary underline underline-offset-4"
            href="#"
          >
            Terms of Service
          </a>{" "}
          &amp;{" "}
          <a
            className="hover:text-primary underline underline-offset-4"
            href="#"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </main>
  )
}
