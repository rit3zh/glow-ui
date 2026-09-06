/**
 * Facts the split layout needs that live in the page body rather than in
 * frontmatter.
 *
 * The pages were authored as one linear column, so the recording and the
 * install path are written inline. Reading them back out is what lets the
 * preview move to its own column without editing a hundred files.
 */

const VIDEO_SRC = /<video[^>]*\ssrc=["']([^"']+)["']/;
const INSTALL_PATH = /component\/([\w-]+)\/([\w.-]+\.tsx)/;
const SOURCE_NAME = /<ComponentSource\s+name=["']([\w.-]+)["']/;

export interface ComponentPageMeta {
  /**
   * The recorded preview shown in the preview column. Read from the
   * `previewVideo` frontmatter field, falling back to the pre-split `video`
   * key and then to an inline `<video>` for pages that still carry one.
   */
  videoSrc?: string;
  /** Where the CLI writes the file, e.g. `components/molecules/accordion.tsx`. */
  installPath: string;
  /** The synced source file the page documents, e.g. `accordion`. */
  sourceName: string;
}

export function getComponentPageMeta(
  content: string,
  slug: string,
  /**
   * `previewVideo` from frontmatter, which owns the recording and wins when
   * set. Falls back to the pre-split `video` key so pages the sync has not
   * migrated yet keep working.
   */
  frontmatterVideo?: string,
): ComponentPageMeta {
  const video = frontmatterVideo ?? VIDEO_SRC.exec(content)?.[1];
  const install = INSTALL_PATH.exec(content);

  return {
    // Some pages were authored with a stray space inside the URL.
    videoSrc: video?.trim() || undefined,
    sourceName: SOURCE_NAME.exec(content)?.[1] ?? slug,
    installPath: install
      ? `components/${install[1]}/${install[2]}`
      : `components/${slug}.tsx`,
  };
}
