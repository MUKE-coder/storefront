"use client"

import * as React from "react"
import type { FieldError } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: FieldError
  containerClassName?: string
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, containerClassName, className, id, ...props }, ref) => {
    const fieldId = id ?? label.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    return (
      <div className={cn("space-y-1.5", containerClassName)}>
        <Label htmlFor={fieldId}>{label}</Label>
        <Input
          id={fieldId}
          ref={ref}
          aria-invalid={!!error}
          className={cn(error && "border-destructive focus-visible:ring-destructive", className)}
          {...props}
        />
        {error && <p className="text-xs text-destructive">{error.message}</p>}
      </div>
    )
  }
)
FormField.displayName = "FormField"
