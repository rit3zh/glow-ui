import { useMemo } from "react";
import { useSegments } from "expo-router";
import { COMPONENT_ROUTES } from "../../../../app/components/routes.generated";

export type ComponentLink = {
  name: string;
  title: string;
  category: string;
  href: string;
};

export function useComponents() {
  const segments = useSegments();

  return useMemo(() => {
    const components: ComponentLink[] = COMPONENT_ROUTES.filter(
      (r) => r.hasScreen,
    ).map((r) => ({
      name: r.component,
      title: r.title,
      category: r.category,
      href: `/${r.name}`,
    }));

    const currentPath = segments.join("/");
    const current =
      components.find((c) => c.href === `/${currentPath}`) ?? null;
    const isComponentScreen = current !== null;

    return { components, current, isComponentScreen } as const;
  }, [segments]);
}
