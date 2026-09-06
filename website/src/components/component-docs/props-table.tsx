import { extractProps, type ParsedProp } from "#/lib/parse-props";
import {
  CODEBASE_FOLDERS,
  fetchCodebaseFile,
  resolveCodebaseKey,
} from "@/lib/codebase";
import { docsSurface } from "@/components/component-docs/surface";
import { cn } from "@/components/workspace-ui/lib/utils";

const row =
  "grid grid-cols-[minmax(0,11rem)_minmax(0,1fr)] gap-x-10 border-b-[0.5px] border-border/60 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] sm:gap-x-14";

/**
 * The props of one exported type, read from `types/<component>/index.ts` in the
 * codebase bucket.
 *
 * This replaces the MDX `AutoTypeTable` tag the pages were authored against.
 * Those tags named a file under `react-native-types/`; the component slug is
 * enough now that the bucket holds one types entry per component, so the pages
 * no longer carry a path that has to be kept in step with the library layout.
 */
async function loadProps(name: string, slug?: string) {
  if (!slug) return [];

  const key = await resolveCodebaseKey(CODEBASE_FOLDERS.types, slug, "index.ts");
  const source = key ? await fetchCodebaseFile(key) : null;

  return source ? extractProps(source, name) : [];
}

export async function PropsTable({
  name,
  slug,
}: {
  name: string;
  /** The component the page documents — the bucket lookup key. */
  slug?: string;
}) {
  const props = await loadProps(name, slug);

  if (props.length === 0) {
    return (
      <div
        className={cn(
          docsSurface,
          "not-prose px-5 py-4 text-[14px] text-muted-foreground",
        )}
      >
        No props found for <code className="font-mono">{name}</code>.
      </div>
    );
  }

  return (
    // The 20px inset matches the code panels, so the first glyph of a prop
    // name sits on the same vertical line as the first glyph of a command.
    <div className={cn(docsSurface, "not-prose px-5 py-1")}>
      <div
        className={cn(
          row,
          "items-center py-3 text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground",
        )}
      >
        <div>Prop</div>
        <div>Description</div>
      </div>

      {props.map((prop, index) => (
        <div
          className={cn(
            row,
            "items-start py-4",
            index === props.length - 1 && "border-b-0",
          )}
          key={prop.name}
        >
          <div className="min-w-0">
            <code className="inline-block max-w-full wrap-break-word rounded-md bg-accent px-2.5 py-1 font-mono text-[13px] text-foreground/80">
              {prop.name}
              {prop.required ? "" : "?"}
            </code>
          </div>

          <PropDescription prop={prop} />
        </div>
      ))}
    </div>
  );
}

/**
 * The prose sits on top and the machine-readable facts — type, default — sit
 * under it as one quiet line, rather than each claiming a column of its own.
 */
function PropDescription({ prop }: { prop: ParsedProp }) {
  return (
    <div className="min-w-0 space-y-1">
      {prop.description ? (
        <p className="text-[14px] leading-6 text-foreground/80">
          {prop.description}
        </p>
      ) : null}

      <p className="text-[12.5px] leading-5 text-muted-foreground/80">
        <span>
          Type <code className="font-mono text-muted-foreground">{prop.type}</code>
        </span>
        {prop.defaultValue ? (
          <>
            <span className="px-1.5">·</span>
            <span>
              Default{" "}
              <code className="font-mono text-muted-foreground">
                {prop.defaultValue}
              </code>
            </span>
          </>
        ) : null}
      </p>
    </div>
  );
}
