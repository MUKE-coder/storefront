"use client"

import * as React from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** Pulls a displayable message off whatever React Query handed back. */
export function errorMessage(error: unknown): string | null {
  if (!error) return null
  if (error instanceof Error) return error.message
  if (typeof error === "string") return error
  return null
}

export type ErrorStateSize = "inline" | "section" | "page"
/** `inverted` is for the ink surfaces — the hero, a category banner. */
export type ErrorStateTone = "default" | "inverted"

const sizeStyles: Record<ErrorStateSize, string> = {
  // Sits inside a small panel — a summary box, a sidebar card.
  inline: "gap-2 px-4 py-6",
  // Stands in for a whole page section, so it holds roughly a section's height.
  section: "gap-3 px-6 py-20",
  // Owns the viewport when the page's primary fetch is the one that failed.
  page: "gap-3 px-6 py-24 min-h-[60vh] justify-center",
}

const titleStyles: Record<ErrorStateSize, string> = {
  inline: "font-display text-base",
  section: "font-display text-xl",
  page: "font-display text-3xl",
}

export interface ErrorStateProps {
  /** Headline. Say what did not load, not "Error". */
  title?: string
  /** One line on what the reader can do about it. */
  description?: string
  /** Wire to React Query's `refetch`. The retry button is hidden without it. */
  onRetry?: () => void
  retryLabel?: string
  /** The thrown error. Its message is surfaced in development only. */
  error?: unknown
  icon?: React.ComponentType<{ className?: string }>
  size?: ErrorStateSize
  tone?: ErrorStateTone
  /** Rendered beside the retry button — a "Back to shop" link, say. */
  action?: React.ReactNode
  className?: string
}

/**
 * The shape every failed fetch renders. Deliberately the mirror image of a
 * skeleton: same footprint, same dashed-border language as the empty states
 * already in the shop view, so a section that fails does not collapse the
 * layout around it.
 */
export function ErrorState({
  title = "Something went wrong",
  description = "We could not load this right now. Check your connection and try again.",
  onRetry,
  retryLabel = "Try again",
  error,
  icon: Icon = AlertTriangle,
  size = "section",
  tone = "default",
  action,
  className,
}: ErrorStateProps) {
  const detail = process.env.NODE_ENV === "production" ? null : errorMessage(error)
  const inverted = tone === "inverted"

  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center border border-dashed text-center",
        inverted ? "border-background/25 text-background" : "border-border",
        sizeStyles[size],
        className
      )}
    >
      <span
        className={cn(
          "mb-1 flex h-12 w-12 items-center justify-center rounded-full",
          inverted ? "bg-background/10 text-background" : "bg-destructive/10 text-destructive"
        )}
      >
        <Icon className="h-5 w-5" />
      </span>

      <h2 className={titleStyles[size]}>{title}</h2>
      <p
        className={cn(
          "max-w-sm text-sm",
          inverted ? "text-background/70" : "text-muted-foreground"
        )}
      >
        {description}
      </p>

      {detail && (
        <p
          className={cn(
            "mt-1 max-w-md break-words font-mono text-xs",
            inverted ? "text-background/50" : "text-muted-foreground/70"
          )}
        >
          {detail}
        </p>
      )}

      {(onRetry || action) && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {onRetry && (
            <Button
              // `outline` is ink-on-transparent, which disappears against an ink
              // background. Brass is the only filled variant that reads on both.
              variant={inverted ? "brass" : "outline"}
              size={size === "page" ? "default" : "sm"}
              onClick={onRetry}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              {retryLabel}
            </Button>
          )}
          {action}
        </div>
      )}
    </div>
  )
}
