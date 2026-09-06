# Component Categories

How components are organized under `src/components/`.

```
src/components/
├── ai/
├── atoms/
├── base/
├── charts/
├── micro-interactions/
├── molecules/
├── organisms/
├── primitives/
├── screens/
└── templates/
```

## `ai/`

Components designed for AI-powered interfaces — chat inputs, thinking states, streaming content.

## `atoms/`

The smallest, most primitive components. Single-purpose building blocks that do one thing.

## `base/`

Foundation UI components — ready-to-use interactive and decorative primitives. These are the core library components that most users reach for.

## `charts/`

Data visualization components — charts, graphs and sparklines, along with the axes, legends and tooltips that go with them. They browse on their own page at `/charts`.

## `primitives/`

The plain interface furniture — switches, tabs, lists, dialogs, alerts. Compound components
built from parts you rearrange, deliberately quiet so they can be styled into any app.
They browse on their own page at `/primitives`.

## `micro-interactions/`

Small, focused animated interactions. A single-purpose motion effect or animated control, meant to be dropped in for a moment of delight.

## `molecules/`

Composite components that combine multiple atoms or base elements into a coherent, reusable unit. More opinionated than base components but still generic.

## `organisms/`

Complex, self-contained sections that often combine multiple molecules and base components into a feature-rich unit. May involve state management or animation orchestration.

## `screens/`

Full-screen compositions. A complete view ready to be used as an Expo Router screen or modal.

## `templates/`

Reusable page layouts and patterns. Opinionated arrangements of organisms and molecules for common use cases like sign-up flows, settings pages, and detail views.
