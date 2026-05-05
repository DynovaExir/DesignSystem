"use client"

import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-md",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success:
            "group-[.toaster]:bg-[hsl(145,60%,95%)] group-[.toaster]:text-[hsl(145,79%,26%)] group-[.toaster]:border-[hsl(145,79%,26%)]",
          error:
            "group-[.toaster]:bg-[hsl(344,100%,96%)] group-[.toaster]:text-[hsl(344,73%,45%)] group-[.toaster]:border-[hsl(344,73%,45%)]",
          warning:
            "group-[.toaster]:bg-[hsl(37,95%,94%)] group-[.toaster]:text-[hsl(37,76%,40%)] group-[.toaster]:border-[hsl(37,76%,40%)]",
          info:
            "group-[.toaster]:bg-[hsl(262,87%,96%)] group-[.toaster]:text-[hsl(262,73%,45%)] group-[.toaster]:border-[hsl(262,73%,45%)]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
