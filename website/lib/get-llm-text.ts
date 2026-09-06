import type { DocsSection } from "./source";

type AnyPage = {
  url: string;
  path: string;
  data: {
    title: string;
    description?: string;
    content: string;
  };
};

const CATEGORIES: Record<DocsSection, string> = {
  docs: "Reacticx Docs",
  components: "Reacticx Components",
  primitives: "Reacticx Primitives",
};

export function getLLMText(section: DocsSection, page: AnyPage): string {
  return `# ${CATEGORIES[section]}: ${page.data.title}
URL: https://www.reacticx.com${page.url}
Source: https://raw.githubusercontent.com/rit3zh/reacticx/main/website/content/${page.path}

${page.data.description ?? ""}

${page.data.content}`;
}
