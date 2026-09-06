export type Structure = "category" | "flat" | "mirror";

export type PackageManager = "bun" | "pnpm" | "yarn" | "npm";
export type PackageManagerSetting = PackageManager | "auto";

export type InstallPolicy = "auto" | "prompt" | "never";

export interface RegistryConfig {
  origin: string;
  index: string;
  registry: string;
  cache: number | false;
}

export interface AliasConfig {
  components: string;
  utils: string;
  hooks: string;
}

export interface PathConfig {
  utils: string;
  hooks: string;
  types: string;
  examples: string;
}

export interface IncludeConfig {
  types: boolean;
  examples: boolean;
  dependencies: boolean;
}

export interface ComponentConfig {
  $schema?: string;
  outDir: string;
  structure: Structure;
  typescript: boolean;
  aliases: AliasConfig;
  paths: PathConfig;
  include: IncludeConfig;
  overwrite: boolean;
  packageManager: PackageManagerSetting;
  installDependencies: InstallPolicy;
  registry: RegistryConfig;
}

export type UserConfig = {
  [K in keyof ComponentConfig]?: ComponentConfig[K] extends object
    ? Partial<ComponentConfig[K]>
    : ComponentConfig[K];
};

export interface BucketFile {
  path: string;
  key: string;
  size: number;
  hash: string;
  contentType: string;
}

export interface BucketFolder {
  prefix: string;
  source: string;
  files: BucketFile[];
}

export interface BucketIndex {
  bucket: string;
  generatedAt: string;
  total: number;
  folders: Record<string, BucketFolder>;
}

export interface FolderEntry {
  name: string;
  files: string[];
}

export interface ComponentInfo {
  name: string;
  category: string;
  path: string;
  files: string[];
  folders: FolderEntry[];
}

export interface Registry {
  version: string;
  totalComponents: number;
  categories: string[];
  components: Record<string, ComponentInfo>;
}

export type PlanKind = "component" | "types" | "example" | "shared";
