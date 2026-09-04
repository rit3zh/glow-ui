const supportsColor = process.stdout.isTTY && process.env.NO_COLOR === undefined;

const wrap = (code: string) => (text: string) =>
  supportsColor ? `\x1b[${code}m${text}\x1b[0m` : text;

export const c = {
  dim: wrap("2"),
  bold: wrap("1"),
  red: wrap("31"),
  green: wrap("32"),
  yellow: wrap("33"),
  blue: wrap("34"),
  magenta: wrap("35"),
  cyan: wrap("36"),
};

export const log = {
  title(text: string) {
    console.log(`\n${c.bold(c.magenta("◆"))} ${c.bold(text)}`);
  },
  step(text: string) {
    console.log(`${c.dim("│")} ${text}`);
  },
  info(text: string) {
    console.log(`${c.dim("│")} ${c.blue("i")} ${text}`);
  },
  success(text: string) {
    console.log(`${c.dim("│")} ${c.green("✔")} ${text}`);
  },
  skip(text: string) {
    console.log(`${c.dim("│")} ${c.dim("•")} ${c.dim(text)}`);
  },
  warn(text: string) {
    console.log(`${c.dim("│")} ${c.yellow("!")} ${text}`);
  },
  error(text: string) {
    console.log(`${c.dim("│")} ${c.red("✘")} ${text}`);
  },
  blank() {
    console.log(c.dim("│"));
  },
  end(text: string) {
    console.log(`${c.dim("╰─")} ${text}\n`);
  },
};

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unit]}`;
}

export function formatDuration(ms: number) {
  return ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(1)}s`;
}
