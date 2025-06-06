import * as React from "react";
import { cn } from "../../lib/utils";

export function Section({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section className={cn("w-full max-w-3xl mx-auto px-4 py-8", className)} {...props} />
  );
} 