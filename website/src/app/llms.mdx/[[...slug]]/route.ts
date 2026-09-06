import { notFound } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";

import { getLLMText } from "#/lib/get-llm-text";
import { resolveDocsSlug, source } from "#/lib/source";

interface RouteContext {
  params: Promise<{ slug?: string[] }>;
}

/**
 * Markdown source for any docs page. The slug is the browser path minus the
 * leading slash, so `/docs/usage.mdx` and `/llms.mdx/docs/usage` address the
 * same page.
 */
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const resolved = resolveDocsSlug((await params).slug);
  if (!resolved) notFound();

  return new NextResponse(getLLMText(resolved.section, resolved.page), {
    headers: {
      "Content-Type": "text/markdown",
    },
  });
}

export function generateStaticParams() {
  return source.generateParams();
}
