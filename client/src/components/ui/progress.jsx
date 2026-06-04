import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "../../lib/utils"

const Progress = React.forwardRef(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-3 w-full overflow-hidden rounded-full bg-zinc-800/80 border border-white/5",
      className
    )}
    {...props}>
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }} />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
