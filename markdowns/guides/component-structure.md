# Component File Structure

How components are organized at the file level. Using `molecules/aurora` as reference.

---

## Typical Layout

```
src/components/<category>/<component>/
├── index.tsx       # Main component — implementation + export
├── types.ts        # TypeScript interfaces for props
├── const.ts        # Default values, colors, dimensions
├── helper.ts       # Pure utility functions
├── conf.ts         # Configuration (shaders, animation configs, etc.)
```

Not every component needs all files — only include what the component requires.

### `index.tsx`

The component implementation. Does two things:

- **Named export** for the component:
  ```ts
  export const Aurora: React.FC<IAurora> = ({ ... }) => { ... };
  ```
- **Default export** wrapped in `memo`:
  ```ts
  export default memo(Aurora);
  ```

### `types.ts`

Defines the component's props interface. One interface per component, consistently named `I<PascalName>`:

```ts
interface IAurora {
  width?: number;
  height?: number;
  auroraColors?: string[];
  skyColors?: [string, string];
  speed?: number;
  intensity?: number;
  waveDirection?: [number, number];
}
```

### `const.ts`

Default values used by the component. Keeps magic numbers out of the implementation:

```ts
export const DEFAULT_AURORA_COLORS = ["#00FF87", "#60EFFF", "#B967FF"];
export const DEFAULT_SKY_COLORS = ["#020308", "#0D1B2A"];
```

### `helper.ts`

Pure utility functions extracted from the component for testability:

```ts
export function hexToRgb(hex: string): [number, number, number] { ... }
```

### `conf.ts`

Static configuration — shader source, animation parameters, layout presets:

```ts
export const AURORA_VERTEX_SHADER = `...`; // GLSL shader string
```

---

## Other Files You May See

| File | Purpose |
|------|---------|
| `context.tsx` | React context for multi-part components |
| `hooks.ts` | Custom hooks extracted from the component |
| `presets.ts` | Pre-configured variants or style presets |
| `<name>.tsx` | Alternative entrypoint (same as `index.tsx`) |

---

## Exports Chain

```
src/components/<category>/<component>/index.tsx
  ↓  named + default export
src/components/<category>/index.ts         (category barrel)
  ↓  export * from "./<component>/index"
src/components/index.ts                    (top-level barrel)
  ↓  export * from "./<category>/index"
```

Each category folder has an `index.ts` that re-exports all its components. The top-level `src/components/index.ts` re-exports all categories. This is how `import { Aurora } from "@/components"` reaches the component.

---

## The Registry

`src/components/registry.json` tracks every component and its files:

```json
"aurora": {
  "name": "aurora",
  "category": "molecules",
  "path": "src/components/molecules/aurora",
  "files": ["conf.ts", "const.ts", "helper.ts", "index.tsx", "types.ts"]
}
```

Run `bun generate-registry` to regenerate it.
