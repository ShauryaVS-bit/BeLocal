import * as React from "react";

export function HeroIcon({ Icon, className = "w-10 h-10 text-indigo-600", ...props }: { Icon: React.ElementType, className?: string }) {
  return <Icon className={className} {...props} />;
} 