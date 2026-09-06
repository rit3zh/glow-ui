import { useMemo } from "react";
import { useSegments } from "expo-router";
import COMPONENT_ROUTES from "../../app/components/routes.generated";
import type { IComponentLink } from "./interface";

const useComponents = () => {
  const segments = useSegments();
  return useMemo(() => {
    const components: IComponentLink[] = COMPONENT_ROUTES.filter(
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
};

export { useComponents };
