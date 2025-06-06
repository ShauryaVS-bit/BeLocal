import * as React from "react";
import { cn } from "../../lib/utils";

export function Heading({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn("text-2xl md:text-3xl font-bold text-indigo-700 mb-6 text-center", className)} {...props} />
  );
} 