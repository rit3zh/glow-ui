import type { BaseOptions } from "fumadocs-core/source";
import {
  BookOpen,
  CodeXml,
  Compass,
  LifeBuoy,
  MessagesSquare,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

export const Separator = ({
  icon,
  name,
}: {
  icon?: React.ReactNode;
  name: React.ReactNode;
}) => {
  return (
    <span className="flex items-center gap-2">
      {icon && (
        <span className="relative flex items-center justify-center text-muted-foreground [&_svg]:size-[16px]">
          {icon}
        </span>
      )}
      <span className="text-sm font-medium tracking-tight text-foreground/50">
        {name}
      </span>
    </span>
  );
};

/**
 * Icons for the `---Name---` separators in `meta.json`.
 *
 * A separator carries nothing but its label, so the icon has to be looked up
 * by that label. Anything unlisted renders as plain text — the lookup failing
 * is a missing icon, not a broken heading.
 */
const SECTION_ICONS: Record<string, LucideIcon> = {
  Introduction: CodeXml,
  Reference: BookOpen,
  Project: Compass,
  Guides: BookOpen,
  Support: LifeBuoy,
  Community: Users,
  Contribute: MessagesSquare,
};

export const attachSeparator: NonNullable<BaseOptions["attachSeparator"]> = (
  node,
) => {
  const label = typeof node.name === "string" ? node.name : undefined;
  const Icon = label ? SECTION_ICONS[label] : undefined;

  node.name = (
    <Separator
      icon={Icon ? <Icon strokeWidth={1.5} /> : undefined}
      name={node.name}
    />
  );

  return node;
};
