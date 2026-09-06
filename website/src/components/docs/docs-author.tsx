import { cn } from "@/components/workspace-ui/lib/utils";

interface Person {
  name: string;
  url?: string;
}

interface DocsAuthorProps {
  name: string;
  url?: string;
  credits?: Person;
}

const nameClassName =
  "text-foreground underline underline-offset-2 decoration-primary font-medium";

const PersonLink = ({ name, url }: Person) =>
  url ? (
    <a
      className={cn(nameClassName, "cursor-pointer hover:decoration-foreground")}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {name}
    </a>
  ) : (
    <span className={nameClassName}>{name}</span>
  );

export const DocsAuthor = ({ name, url, credits }: DocsAuthorProps) => {
  return (
    <span className="mb-2.5 text-sm italic text-fd-muted-foreground">
      Made by <PersonLink name={name} url={url} />
      {credits && (
        <>
          {" · "}
          Credits: <PersonLink name={credits.name} url={credits.url} />
        </>
      )}
    </span>
  );
};
