<div className="flex justify-center items-center my-10">
  <img
    src="./images/glow/components.png"
    alt="Glow UI Components"
  >
</div>

<div className="text-center my-12">
  <h2 className="text-3xl font-semibold">Getting Started</h2>
  <div className="w-16 h-1 bg-indigo-500 mt-2 mx-auto rounded-full" />
</div>

## 🚀 Adding components

To start using Glow UI in your React Native project, sinply run the following command

```bash
npx rn-glow add <"component-name">
```

## 🛠️ CLI Commands

Glow UI ships with a powerful and user-friendly CLI to help you easily explore and integrate beautiful components into your React Native projects.

### ✨ Getting Started

```bash
npx rn-glow <command>
```

---

### 📋 Available Commands

<div className="overflow-x-auto rounded-xl border border-zinc-700 mt-4">
  <table className="w-full table-auto text-left border-collapse text-sm md:text-base">
    <thead className="bg-zinc-800 text-white">
      <tr>
        <th className="py-3 px-4 border-b border-zinc-700">🔧 Command</th>
        <th className="py-3 px-4 border-b border-zinc-700">📝 Description</th>
        <th className="py-3 px-4 border-b border-zinc-700">⚙️ Example</th>
      </tr>
    </thead>
    <tbody className="bg-zinc-900 text-zinc-200">
      <tr className="hover:bg-zinc-800 transition">
        <td className="py-3 px-4 border-b border-zinc-700 font-mono">add</td>
        <td className="py-3 px-4 border-b border-zinc-700">
          Installs a component by name into your project. Also supports a custom
          output path.
        </td>
        <td className="py-3 px-4 border-b border-zinc-700 font-mono">
          npx rn-glow add button
        </td>
      </tr>
      <tr className="hover:bg-zinc-800 transition">
        <td className="py-3 px-4 border-b border-zinc-700 font-mono">list</td>
        <td className="py-3 px-4 border-b border-zinc-700">
          Displays all available components grouped by category.
        </td>
        <td className="py-3 px-4 border-b border-zinc-700 font-mono">
          npx rn-glow list
        </td>
      </tr>
    </tbody>
  </table>
</div>

---

### 📦 `add` Command

Adds a component to your project.

```bash
npx rn-glow add <"component-name">
```

**Options**:

- `--outdir <path>` – Custom output directory (default: `components/`)

**Example**:

```bash
npx rn-glow add card --outdir src/ui
```

During the install process, you’ll see a progress bar like:

```
📦 ████████--------- 40% | 4/10 files
```

✅ If the component exists, it's copied to your chosen folder.
🚫 If it already exists, the CLI warns and exits to prevent overwrites.

---

### 📚 `list` Command

Prints all the components you can install — neatly grouped by category:

```bash
npx rn-glow list
```

Example output:

```bash
📦 Available Components:
----------------------

TEMPLATES:
  • whats-new
  • sheet
  • media-list
  • headers

ATOMS:
  • stacks
  • divider

💡 Use 'rn-glow add <component-name>' to add a component
```

---

### ⚙️ Custom Configuration (Optional)

You can customize `rn-glow` behavior with a config file.

#### ✅ Supported Config File Locations:

- Project root: `component.config.json`
- User home: `~/.component.config.json`

#### 🧠 Supported Options

```json
{
  "outDir": "src/components/ui"
}
```

- `outDir`: Sets a default output folder for all components you add.

#### 📁 Example Setup

Create a `component.config.json` in your project root:

```json
{
  "outDir": "src/shared/ui"
}
```

Now, running:

```bash
npx rn-glow add badge
```

Will place the component into `src/shared/ui/badge/` automatically.

---

<div className="my-8 text-center">
  <p className="text-lg text-zinc-300">
    🧩 More commands & customization coming soon!
  </p>
</div>
