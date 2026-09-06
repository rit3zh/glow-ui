# Build a TypeScript File System Automation CLI

I want to build a **TypeScript CLI tool** that continuously watches one or more directories and automatically updates files throughout my project whenever files are created, renamed, moved, or deleted.

The goal is to completely automate the boilerplate required whenever I add a new component, screen, hook, utility, or any other module.

This should be designed as a **generic, extensible automation framework**, not as a one-off script.

---

# High Level Goal

The CLI should:

- Watch one or more folders recursively.
- Detect:
  - file creation
  - file deletion
  - file rename
  - file move
  - folder creation
  - folder deletion

- Understand what changed.
- Trigger one or more "actions" depending on the configured rules.
- Update project files safely using AST parsing instead of string replacement whenever possible.
- Be completely configurable.
- Be modular so adding new automations is simple.

Think of this as a lightweight code generation + synchronization engine.

---

# Tech Stack

Use:

- TypeScript
- Node.js
- tsx (for development)
- chokidar (watching)
- fast-glob
- ts-morph
- prettier
- fs-extra
- zod
- picomatch
- commander (optional CLI)
- consola (logging)

If another library is significantly better, explain why.

---

# Folder Structure

I don't want everything inside one file.

I want a clean architecture.

Example:

```
automation/
│
├── src/
│   ├── cli.ts
│   ├── watcher.ts
│   ├── config.ts
│   ├── events/
│   │      file-created.ts
│   │      file-deleted.ts
│   │      file-renamed.ts
│   │      file-moved.ts
│   │
│   ├── actions/
│   │      update-layout.ts
│   │      update-config.ts
│   │      generate-component.ts
│   │      format.ts
│   │
│   ├── generators/
│   │      component.ts
│   │      screen.ts
│   │
│   ├── ast/
│   │      add-array-item.ts
│   │      add-jsx-element.ts
│   │      remove-array-item.ts
│   │
│   ├── utils/
│   │      paths.ts
│   │      naming.ts
│   │      logger.ts
│   │      prettier.ts
│   │
│   └── types/
│
├── automation.config.ts
└── package.json
```

I want something that scales well to many automations.

---

# Configuration

Instead of hardcoding paths, I want a configuration-driven system.

Example:

```ts
export default defineAutomation({
  watchers: [
    {
      source: "packages/ui/src/components",

      include: ["**/*.tsx"],

      ignore: ["**/*.stories.tsx", "**/*.test.tsx", "**/index.ts"],

      actions: [
        updateExpoRouter(),
        generateExampleScreen(),
        updateComponentConfig(),
      ],
    },
  ],
});
```

Every watcher should be able to register multiple actions.

---

# Event System

Every action should receive an event object.

Example:

```ts
{
    type: "create",

    absolutePath,

    relativePath,

    filename,

    extension,

    directory,

    basename,

    previousPath,

    isDirectory,

    timestamp,
}
```

Supported events:

- create
- delete
- rename
- move
- change

---

# Example Automation #1

## Updating Expo Router Layout

Suppose I have

```
app/components/_layout.tsx
```

Inside:

```tsx
<Stack.Screen name="index" />
<Stack.Screen name="modal" />
<Stack.Screen name="dialog" />
```

Whenever a new component file appears:

```
button.tsx
```

I want it to automatically become

```tsx
<Stack.Screen name="index" />
<Stack.Screen name="modal" />
<Stack.Screen name="dialog" />
<Stack.Screen name="button" />
```

If

```
button.tsx
```

is deleted

remove

```tsx
<Stack.Screen name="button" />
```

If renamed

```
button.tsx

↓

icon-button.tsx
```

Automatically change

```tsx
name = "button";
```

↓

```tsx
name = "icon-button";
```

This should be done using **AST**, not string replacement.

It should preserve formatting and comments.

---

# Example Automation #2

Generate Example Screen

When

```
button.tsx
```

is created

Automatically generate

```
apps/website/native/components/button.tsx
```

using a template.

Example template:

```tsx
export default function ButtonScreen() {
  return (
    <View>
      <Button />
    </View>
  );
}
```

Template should support variables.

Example:

```
{{componentName}}

{{pascalCase}}

{{kebabCase}}

{{camelCase}}
```

---

# Example Automation #3

Update Config File

Suppose I have

```ts
export const COMPONENTS = [
    ...
]
```

Instead of manually editing the array, automatically synchronize it.

When

```
button.tsx
```

exists

insert

```ts
{
    title: "Button",
    icon: "square",
    path: "components/button",
}
```

When removed

remove the object.

When renamed

update the object.

---

# Better Approach

Instead of manually maintaining arrays, propose a better architecture.

For example:

- scan folders
- generate arrays
- regenerate config file
- export generated data

Example:

```
components.generated.ts
```

that is regenerated every time.

This may be much cleaner than modifying existing files.

Compare both approaches:

- AST editing
- generated source files

Discuss pros and cons.

---

# AST Requirements

Show how to use ts-morph to

- parse a file
- find exported arrays
- insert objects
- remove objects
- update object properties
- find JSX elements
- insert JSX elements
- delete JSX elements
- preserve formatting

Avoid regex whenever possible.

---

# Naming Utilities

Implement utilities such as:

```
button.tsx

↓

Button

button

button

ButtonScreen

components/button

Button Component
```

Support

- PascalCase
- camelCase
- kebab-case
- Start Case
- Title Case

---

# Watching

Explain how chokidar should be configured.

Discuss:

- debounce
- awaitWriteFinish
- atomic writes
- recursive watching
- symlinks
- ignored files
- batching events

Large repositories should not trigger unnecessary rebuilds.

---

# Action Pipeline

Instead of:

```
watch()

↓

edit layout

↓

edit config
```

Design an action pipeline.

Example:

```
Watcher

↓

Event

↓

Action Manager

↓

Action 1

↓

Action 2

↓

Action 3

↓

Prettier

↓

Done
```

Each action should be independently reusable.

---

# Generator System

Design a reusable generator API.

Example:

```ts
generate({
  template,
  destination,
  variables,
});
```

Support multiple template engines if useful.

---

# Prettier

Every modified file should automatically be formatted after changes.

Explain the best approach.

---

# Logging

Use structured logs.

Example:

```
✔ button.tsx created

✔ updated layout

✔ updated config

✔ generated screen

Done in 45ms
```

---

# Error Handling

The CLI should never crash because one action failed.

If one action throws:

- log the error
- continue executing remaining actions
- show summary

---

# Performance

Explain how to avoid repeatedly parsing the same files.

Discuss:

- AST caching
- file caching
- incremental updates
- batching
- debouncing

---

# Extensibility

I want to be able to add future automations like:

- auto update exports
- auto update barrel files
- generate documentation
- update Storybook
- update navigation
- update README
- generate MDX docs
- sync website examples
- sync playgrounds
- sync package exports

without changing the watcher.

---

# Deliverables

Produce a production-quality implementation guide that includes:

1. Overall architecture and design decisions.
2. Dependency selection with justification.
3. Complete folder structure.
4. Configuration API design.
5. Event pipeline architecture.
6. Action interface and lifecycle.
7. AST utilities using ts-morph.
8. File generation system.
9. Watcher implementation using chokidar.
10. Template system.
11. Naming utility implementation.
12. Logging strategy.
13. Error handling.
14. Performance optimizations.
15. Example implementations for:
    - updating Expo Router `_layout.tsx`
    - generating example screens
    - synchronizing component configuration

16. Comparison between AST mutation and generated source files, with recommendations for when to use each.
17. Suggestions for making this tool reusable as an internal automation framework that can support many future project automation tasks.
