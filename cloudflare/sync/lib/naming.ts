import { config } from "../config";

/**
 * `bouncy-accordion-landing-page-asset.mp4` -> `bouncy-accordion`
 * `squricle-landing-asset.jpg`              -> `squricle`
 */
export function toComponentName(fileName: string) {
  let base = fileName.replace(/\.[a-z0-9]+$/i, "").toLowerCase();

  for (const suffix of config.nameSuffixes) {
    if (base.endsWith(suffix)) {
      base = base.slice(0, -suffix.length);
      break;
    }
  }

  return base.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

/**
 * `bouncy-accordion` -> `Bouncy Accordion`, with a few acronyms kept upper case.
 */
const ACRONYMS = new Set(["ui", "ios", "qr", "otp", "3d", "ai", "svg", "api"]);

export function toTitle(name: string) {
  return name
    .split("-")
    .map((word) => {
      if (ACRONYMS.has(word)) return word.toUpperCase();
      if (/^\d+$/.test(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

/** `bouncy-accordion` -> `bouncyAccordion`, safe as an object key / import name. */
export function toCamelCase(name: string) {
  return name.replace(/-([a-z0-9])/g, (_, char: string) => char.toUpperCase());
}

/** The object key inside the bucket. Kept identical to the file name. */
export function toObjectKey(fileName: string) {
  return fileName;
}

export function toPublicUrl(objectKey: string) {
  return `${config.publicOrigin}/${encodeURIComponent(objectKey)}`;
}
