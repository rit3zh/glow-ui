/**
 * Pixel dimensions of a media file, read from the file's own headers.
 *
 * The website's gallery lays its cards out in justified rows weighted by each
 * clip's aspect, so every card in a row lands on the same media height with
 * nothing cropped. That needs the real aspect at build time — measuring in the
 * browser means a page that reflows as clips load.
 *
 * This used to shell out to `ffprobe`, which meant the layout silently degraded
 * on any machine without ffmpeg installed: no aspect, no justified row, a
 * default guess instead. Every format here keeps its dimensions in a fixed
 * place near the front of the file, so reading them directly costs one small
 * read and no dependency at all. ffprobe is still the fallback for anything
 * this does not recognise.
 */
import { open } from "node:fs/promises";
import { spawn } from "node:child_process";
import { extname } from "node:path";

export interface Dimensions {
  width: number;
  height: number;
}

/** Enough for every header this parses, including a leading MP4 `moov`. */
const PROBE_BYTES = 512 * 1024;

async function readHead(filePath: string, bytes = PROBE_BYTES) {
  const handle = await open(filePath, "r");
  try {
    const { size } = await handle.stat();
    const length = Math.min(bytes, size);
    const buffer = Buffer.alloc(length);
    await handle.read(buffer, 0, length, 0);
    return buffer;
  } finally {
    await handle.close();
  }
}

/* -------------------------------------------------------------------------- */
/* Images                                                                      */
/* -------------------------------------------------------------------------- */

function png(buffer: Buffer): Dimensions | undefined {
  // 8-byte signature, then the IHDR chunk: length, type, width, height.
  if (buffer.length < 24) return undefined;
  if (buffer.readUInt32BE(0) !== 0x89504e47) return undefined;
  if (buffer.toString("ascii", 12, 16) !== "IHDR") return undefined;

  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function gif(buffer: Buffer): Dimensions | undefined {
  if (buffer.length < 10) return undefined;
  if (buffer.toString("ascii", 0, 3) !== "GIF") return undefined;

  return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) };
}

function jpeg(buffer: Buffer): Dimensions | undefined {
  if (buffer.length < 4 || buffer.readUInt16BE(0) !== 0xffd8) return undefined;

  let offset = 2;

  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1]!;
    const length = buffer.readUInt16BE(offset + 2);

    // SOF0–SOF15 carry the frame size; SOF4 / SOF8 / SOF12 are not frame headers.
    const isFrameHeader =
      marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;

    if (isFrameHeader) {
      return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
    }

    offset += 2 + length;
  }

  return undefined;
}

function webp(buffer: Buffer): Dimensions | undefined {
  if (buffer.length < 30) return undefined;
  if (buffer.toString("ascii", 0, 4) !== "RIFF") return undefined;
  if (buffer.toString("ascii", 8, 12) !== "WEBP") return undefined;

  const format = buffer.toString("ascii", 12, 16);

  // Lossy: a VP8 keyframe header, 14 bytes in, dimensions masked to 14 bits.
  if (format === "VP8 ") {
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    };
  }

  // Lossless: 14 bits each, packed across four bytes.
  if (format === "VP8L") {
    const bits = buffer.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }

  // Extended: 24-bit little-endian, stored as size − 1.
  if (format === "VP8X") {
    const width = buffer.readUIntLE(24, 3) + 1;
    const height = buffer.readUIntLE(27, 3) + 1;
    return { width, height };
  }

  return undefined;
}

/* -------------------------------------------------------------------------- */
/* ISO base media — .mp4, .mov, .m4v                                           */
/* -------------------------------------------------------------------------- */

/**
 * The display size of the largest video track.
 *
 * `tkhd` carries the track's presentation size as 16.16 fixed point, which is
 * what should drive layout — it already accounts for non-square pixels, unlike
 * the coded size in `stsd`. The transform matrix right before it is what a
 * phone recording uses to rotate portrait video, so a track rotated a quarter
 * turn has its stored width and height the wrong way round for display.
 */
function isoBmff(buffer: Buffer): Dimensions | undefined {
  let best: Dimensions | undefined;

  const walk = (start: number, end: number, depth: number) => {
    if (depth > 6) return;

    let offset = start;

    while (offset + 8 <= end) {
      let size = buffer.readUInt32BE(offset);
      const type = buffer.toString("ascii", offset + 4, offset + 8);
      let headerSize = 8;

      if (size === 1) {
        if (offset + 16 > end) return;
        // 64-bit size. Anything past 2^53 is not a file we are looking at.
        size = Number(buffer.readBigUInt64BE(offset + 8));
        headerSize = 16;
      } else if (size === 0) {
        size = end - offset;
      }

      if (size < headerSize || offset + size > end) return;

      if (type === "moov" || type === "trak" || type === "mdia") {
        walk(offset + headerSize, offset + size, depth + 1);
      } else if (type === "tkhd") {
        const body = offset + headerSize;
        const version = buffer[body]!;
        // version 1 widens creation/modification/duration to 64 bits.
        const matrixStart = body + (version === 1 ? 32 + 12 : 20 + 12) + 8;

        if (matrixStart + 36 + 8 <= end) {
          const a = buffer.readInt32BE(matrixStart);
          const d = buffer.readInt32BE(matrixStart + 16);

          const width = buffer.readUInt32BE(matrixStart + 36) / 65536;
          const height = buffer.readUInt32BE(matrixStart + 40) / 65536;

          if (width >= 1 && height >= 1) {
            // A quarter-turn matrix zeroes the diagonal and fills b/c instead.
            const rotated = a === 0 && d === 0;
            const size = rotated
              ? { width: Math.round(height), height: Math.round(width) }
              : { width: Math.round(width), height: Math.round(height) };

            // A file can hold several tracks; the video one is the biggest.
            if (!best || size.width * size.height > best.width * best.height) best = size;
          }
        }
      }

      offset += size;
    }
  };

  walk(0, buffer.length, 0);
  return best;
}

/* -------------------------------------------------------------------------- */
/* ffprobe fallback                                                            */
/* -------------------------------------------------------------------------- */

function ffprobe(filePath: string): Promise<Dimensions | undefined> {
  return new Promise((resolve) => {
    const child = spawn(
      "ffprobe",
      [
        "-v",
        "error",
        "-select_streams",
        "v:0",
        "-show_entries",
        "stream=width,height",
        "-of",
        "csv=s=x:p=0",
        filePath,
      ],
      { stdio: ["ignore", "pipe", "ignore"] },
    );

    let output = "";
    child.stdout.on("data", (chunk) => (output += chunk));
    child.on("error", () => resolve(undefined));
    child.on("close", (code) => {
      if (code !== 0) return resolve(undefined);

      const [width, height] = output.trim().split("x").map(Number);
      if (!width || !height) return resolve(undefined);

      resolve({ width, height });
    });
  });
}

/* -------------------------------------------------------------------------- */

const ISO_EXTENSIONS = new Set([".mp4", ".mov", ".m4v"]);

/**
 * Returns undefined when nothing can read the file, which callers treat as
 * "fall back to a default aspect" rather than an error — the sync's job is
 * uploading, and it should not fail over a layout hint.
 */
export async function probeDimensions(filePath: string): Promise<Dimensions | undefined> {
  const extension = extname(filePath).toLowerCase();

  try {
    const head = await readHead(filePath);

    const parsed =
      extension === ".png"
        ? png(head)
        : extension === ".gif"
          ? gif(head)
          : extension === ".jpg" || extension === ".jpeg"
            ? jpeg(head)
            : extension === ".webp"
              ? webp(head)
              : ISO_EXTENSIONS.has(extension)
                ? isoBmff(head)
                : undefined;

    if (parsed) return parsed;
  } catch {
    // Unreadable file, or a header shape this does not know — try ffprobe.
  }

  return ffprobe(filePath);
}
