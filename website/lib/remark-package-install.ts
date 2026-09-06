interface Node {
  type: string;
  lang?: string | null;
  value?: string;
  name?: string;
  attributes?: unknown[];
  children?: Node[];
}

/**
 * Rewrite ```package-install fences into a `<PackageInstall>` tag.
 *
 * The fence is a fumadocs convention rather than a real language, so it has to
 * be taken out of the tree before the syntax highlighter sees it — a lang it
 * cannot load would otherwise fail the build.
 */
export function remarkPackageInstall() {
  return (tree: Node) => {
    const walk = (node: Node) => {
      if (!node.children) return;

      for (let index = 0; index < node.children.length; index += 1) {
        const child = node.children[index];

        if (child.type === "code" && child.lang === "package-install") {
          node.children[index] = {
            type: "mdxJsxFlowElement",
            name: "PackageInstall",
            attributes: [
              {
                type: "mdxJsxAttribute",
                name: "packages",
                value: (child.value ?? "").trim(),
              },
            ],
            children: [],
          };
          continue;
        }

        walk(child);
      }
    };

    walk(tree);
  };
}
