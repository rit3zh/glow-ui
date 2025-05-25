export interface ComponentFile {
  name: string;
  path: string;
}

export interface Component {
  name: string;
  description: string;
  files: ComponentFile[];
}

export interface ComponentsRegistry {
  [key: string]: Component;
}
