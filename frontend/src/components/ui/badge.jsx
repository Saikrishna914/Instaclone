import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border border-slate-200 px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-slate-950 focus-visible:ring-slate-950/50 focus-visible:ring-[3px] aria-invalid:ring-red-500/20  aria-invalid:border-red-500 transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-slate-900 text-slate-50 [a&]:hover:bg-slate-900/90 ",
        secondary:
          "border-transparent bg-slate-100 text-slate-900 [a&]:hover:bg-slate-100/90 ",
        destructive:
          "border-transparent bg-red-500 text-white [a&]:hover:bg-red-500/90 focus-visible:ring-red-500/20 ",
        outline:
          "text-slate-950 [a&]:hover:bg-slate-100 [a&]:hover:text-slate-900 ",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props} />
  );
}

export { Badge, badgeVariants }
