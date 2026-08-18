# Darnell Naidu — Portfolio (React + Tailwind)

React + TypeScript + Tailwind CSS v4 rebuild of the portfolio, built with Vite.
Uses genuine shadcn/21st.dev components (`Button`, `InfiniteSlider`,
`ProgressiveBlur`) plus two hand-built primitives in the same convention
(`ShimmerButton`, `SpotlightCard`) -- Tailwind utility classes, a `cn()`
class-merge helper, `forwardRef`, cursor-tracked spotlight and
magnetic-hover interactions.

## Develop locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Build

```bash
npm run build
```

Outputs a static site to `dist/` -- this is genuinely static (relative asset
paths), so `dist/` can be deployed anywhere, including a drag-and-drop onto
Netlify's dashboard, exactly like the earlier single-file version.

## Deploy from source instead (recommended for ongoing changes)

Push this project to a GitHub repo, then in Netlify: **Add new site -> Import
from Git**, pick the repo, and set:

- Build command: `npm run build`
- Publish directory: `dist`

Netlify will rebuild automatically on every push.

## Project structure

```
src/
  components/        Section components (Hero, About, Work, Stack, Contact, Nav...)
  components/ui/     button, infinite-slider, progressive-blur (real shadcn/21st.dev
                      components) + ShimmerButton, SpotlightCard (hand-built, same convention)
  data/projects.ts   Project content
  lib/               cn() helper, useReveal / useReducedMotion / useFinePointer hooks
  assets/headshot.jpg
```

## Notes

- Every animated/pointer-driven effect (tilt, magnetic buttons, custom
  cursor, the routing diagram) checks `prefers-reduced-motion` and
  `pointer: fine` before running, matching the original build.
- The background is now an infinite tech-stack marquee (`StackMarquee.tsx`,
  built on the real `InfiniteSlider` + `ProgressiveBlur` components) instead
  of the earlier rocket-launch scroll scene.
- `src/index.css` defines both the site's own design tokens (`--color-red`,
  `--color-bg-card`, etc.) and the standard shadcn semantic tokens
  (`--color-primary`, `--color-background`, ...) mapped onto that same
  palette -- so any further shadcn/21st.dev component can be dropped into
  `components/ui/` and it'll pick up the site's colors automatically.
- Update contact links in `src/components/Contact.tsx` and project content in
  `src/data/projects.ts`.
