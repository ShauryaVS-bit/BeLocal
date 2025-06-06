import * as React from "react";
import { cn } from "../../lib/utils";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-white/90 rounded-3xl shadow-2xl p-8 md:p-10 backdrop-blur-xl border border-white/30",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card"; 