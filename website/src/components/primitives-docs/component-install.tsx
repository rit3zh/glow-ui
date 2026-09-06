import { PrimitiveFiles } from "@/components/primitives-docs/component-files";
import { PrimitiveInstall } from "@/components/primitives-docs/installation";

/**
 * A primitive's installation block.
 *
 * The files are loaded here, on the server, and handed to the client card as a
 * rendered tree — so the whole folder ships with the page and opening a file
 * costs nothing, while the CLI/Manual switch stays interactive.
 */
export async function ComponentInstall({
  name,
  deps,
}: {
  name: string;
  /** Space-separated packages the primitive needs. */
  deps?: string;
}) {
  return (
    <PrimitiveInstall
      dependencies={deps}
      files={<PrimitiveFiles name={name} />}
      name={name}
    />
  );
}
