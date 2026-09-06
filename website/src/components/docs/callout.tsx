import { CircleCheck, CircleX, Info, TriangleAlert } from "lucide-react";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

import { cn } from "@/components/workspace-ui/lib/utils";

type NormalizedCalloutType = "info" | "warning" | "error" | "success";

type CalloutProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "title" | "type" | "icon"
> & {
  title?: ReactNode;
  type?: "info" | "warn" | "error" | "success" | "warning";
  icon?: ReactNode;
};

const typeConfig: Record<
  NormalizedCalloutType,
  {
    wrapper: string;
    iconColor: string;
    Icon: React.ComponentType<{ className?: string }>;
  }
> = {
  info: {
    wrapper:
      "border-blue-200/70 bg-blue-50/60 dark:border-blue-800/40 dark:bg-blue-950/20",
    iconColor: "text-blue-500 dark:text-blue-400",
    Icon: Info,
  },
  warning: {
    wrapper:
      "border-amber-200/70 bg-amber-50/60 dark:border-amber-800/40 dark:bg-amber-950/20",
    iconColor: "text-amber-500 dark:text-amber-400",
    Icon: TriangleAlert,
  },
  error: {
    wrapper:
      "border-red-200/70 bg-red-50/60 dark:border-red-800/40 dark:bg-red-950/20",
    iconColor: "text-red-500 dark:text-red-400",
    Icon: CircleX,
  },
  success: {
    wrapper:
      "border-emerald-200/70 bg-emerald-50/60 dark:border-emerald-800/40 dark:bg-emerald-950/20",
    iconColor: "text-emerald-500 dark:text-emerald-400",
    Icon: CircleCheck,
  },
};

export const Callout = forwardRef<HTMLDivElement, CalloutProps>(
  ({ className, children, title, type = "info", icon, ...props }, ref) => {
    if (type === "warn") type = "warning";
    if ((type as unknown) === "tip") type = "info";

    const normalized = type as NormalizedCalloutType;
    const config = typeConfig[normalized] ?? typeConfig.info;
    const { Icon } = config;

    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-3 my-4 rounded-xl border p-4 text-sm",
          config.wrapper,
          className,
        )}
        {...props}
      >
        <div className={cn("mt-0.5 shrink-0", config.iconColor)}>
          {icon ?? <Icon className="size-4" />}
        </div>
        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          {title && (
            <p className="font-semibold text-foreground !my-0 leading-tight">
              {title}
            </p>
          )}
          <div className="text-muted-foreground prose-no-margin empty:hidden leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    );
  },
);

Callout.displayName = "Callout";
