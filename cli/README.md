# Glow UI CLI

✨ Add UI components to your project with style

## Installation

```bash
npm install -g glow-ui
```

Or use npx:

```bash
npx glow-ui <command>
```

## Usage

### Add a component

```bash
glow-ui add <componentName>
```

Options:

- `--outdir <path>`: Specify output directory (default: "components")

### Configuration

You can configure the CLI using a `component.config.json` file in your project root or in your home directory (`~/.component.config.json`).

Example config:

```json
{
  "outDir": "src/components"
}
```

## Available Components

- Button
- Dialog
- Segmented Control
- And more...

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Lint
npm run lint
```

## License

MIT
