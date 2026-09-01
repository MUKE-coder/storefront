import { cn } from "@/lib/utils"

/**
 * Wraps a skeleton tree so assistive tech announces the wait once instead of
 * reading out dozens of empty boxes. Every `Skeleton` inside is aria-hidden,
 * so the visually-hidden label here is the only thing a screen reader gets.
 */
export function SkeletonShell({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div role="status" aria-busy="true" aria-live="polite" className={cn(className)}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  )
}
