export function parseJson<T>(json: string): T {
  return JSON.parse(json) as T;
}
