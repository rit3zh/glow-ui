export function defineComponentName(component: React.FC) {
  return component.displayName || component.name || "Component";
}
