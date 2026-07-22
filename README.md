**[✨ Preview here →](https://riufukazawa.com/koi-pond)**

# 🐟 Koi Pond

An interactive pixel-art koi pond, rendered entirely to a single HTML `<canvas>`. Koi wander with a
lazy wandering-AI, caustics shimmer across near-black water, lily pads and reeds drift at the edges,
and rain dimples the surface. Then you touch it.

- **Click / tap** the water to send out a ripple and scatter the nearby fish.
- **Hold and drag** to sprinkle food; the koi chase it down, and the more a fish eats the fatter it
  gets (feed one enough and it pops in a little puff, and a fresh koi swims in from the edge).
- **Swipe** quickly to make a wave that pushes the whole school away.

It is one dependency-free React component plus a small playground site where you can crank the fish
(up to 100), their speed and size, rain, lily pads, reeds, and sparkles live, start from a preset,
then download it and make it your own.

## Quick start

```bash
git clone https://github.com/Riu-F/koi-pond.git
cd koi-pond
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). Edit anything in `src/` and it hot-reloads.

```bash
npm run build     # type-check + production build into dist/
npm run preview   # preview the production build locally
```

## Embed it on your site (no code)

The live pond at [koi-pond-pixel.vercel.app](https://koi-pond-pixel.vercel.app) has a chromeless
**embed mode**, built for dropping it into another site as an `<iframe>` — no copying source, no
build step, and it never goes stale since it's the same deploy everyone else sees.

```html
<iframe
  src="https://koi-pond-pixel.vercel.app/?embed=1&fish=3&rain=0&reeds=0&lilypads=0.5&sparkles=12&height=180"
  loading="lazy"
  style="width: 100%; height: 100%; border: none;"
  title="Interactive koi pond"
></iframe>
```

`?embed=1` hides the control panel and the corner credit link; everything else is the normal,
fully pointer-interactive pond (click to ripple, hold to feed, swipe to scatter). Every playground
setting is overridable from the query string:

| Param | Maps to | Default |
| --- | --- | --- |
| `embed` | Chromeless mode — `1` to enable | off |
| `fish` | `fishCount` | `7` |
| `speed` | `fishSpeed` | `1` |
| `size` | `fishSize` | `1` |
| `rain` | `rainIntensity` | `1` |
| `lilypads` | `lilyPadDensity` | `1` |
| `reeds` | `reedDensity` | `1` |
| `sparkles` | `sparkleCount` | `48` |
| `pixel` | `pixelSize` | `1` |
| `text` | `underwaterText` | none |
| `height` | `baseHeight` — internal render resolution; lower is cheaper | `320` |
| `scale` | `scale` — inflates every entity's size without moving the camera, so nothing gets cropped (see [Props](#props)) | `1` |
| `nav` | `navigateUrl`, URL-encoded — if set, a tap navigates there instead of rippling, and gentle hover movement ripples in place of a fast swipe (see [Props](#props)) | none |

A small embed tends to look better a little zoomed in — e.g. `&scale=1.6` — since the default
density is tuned for a full-size pond.

**A clickable-tile pattern** (e.g. a bento-grid card that links to a full pond page): combine
`nav` with a lower `fish`/`sparkles`/`height` and `rain=0&reeds=0` for a light, glanceable embed —

```
?embed=1&fish=3&rain=0&reeds=0&lilypads=0.5&sparkles=12&height=180&scale=1.6
&nav=https%3A%2F%2Fyoursite.com%2Fkoi-pond
```

Note: a cross-origin `<iframe>` can always navigate the top-level page it's embedded in via
`window.top.location` — this is a standard browser allowance, not something that needs a special
permission or `sandbox` attribute on your `<iframe>`.

## Use it in your own project

The whole thing lives in one file, [`src/KoiPond.tsx`](src/KoiPond.tsx), and its **only dependency is
React** (18 or 19). There is no image, font, or library to bring along. To reuse it:

1. Copy `src/KoiPond.tsx` into your project.
2. Render it inside any sized container:

```tsx
import KoiPond from './KoiPond';

export default function Page() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <KoiPond fishCount={12} rainIntensity={1.5} underwaterText="404" />
    </div>
  );
}
```

It fills 100% of its parent, so give the parent a size. It works in Vite, Create React App, and
Next.js (it is a client component, so keep the `'use client';` line at the top when used in the
Next.js App Router). A great use is a **custom 404 page**, which is where this one started.

### Props

Every prop is optional; the defaults reproduce the original pond.

| Prop | Type | Default | What it does |
| --- | --- | --- | --- |
| `fishCount` | `number` | `7` | Number of koi (0 to 100 in the playground), distributed across size tiers (hero / medium / small). |
| `fishSpeed` | `number` | `1` | Global swim-speed multiplier (applies live, no scene rebuild). |
| `fishSize` | `number` | `1` | Global koi size multiplier (applies live). |
| `rainIntensity` | `number` | `1` | Ambient rain multiplier. `0` stops the rain; `2` roughly doubles it. |
| `lilyPadDensity` | `number` | `1` | Lily-pad density multiplier. `0` clears them; `2` roughly doubles them. |
| `reedDensity` | `number` | `1` | Edge-reed density multiplier. `0` clears them; `2` roughly doubles them. |
| `sparkleCount` | `number` | `48` | Number of twinkling sparkles on the water surface. |
| `pixelSize` | `number` | `1` | Extra pixelation over the whole scene: `1` = off, higher = chunkier blocks. |
| `underwaterText` | `string` | `undefined` | Faint text drawn on the pond floor, e.g. `"404"`. |
| `fillContainer` | `boolean` | `true` | Track the container's aspect ratio via `ResizeObserver`. |
| `baseHeight` | `number` | `320` | Internal pixel height; width is derived from the container aspect. Lower = chunkier pixels + cheaper. |
| `resolution` | `{ width, height }` | `undefined` | Fixed internal resolution (only used when `fillContainer` is `false`). |
| `scale` | `number` | `1` | Inflates every entity's size (fish, pads, reeds, ripples, caustics) without moving the camera — positions are unaffected, so nothing gets cropped out of frame. Useful at small sizes, where the default density reads too busy. |
| `navigateUrl` | `string` | `undefined` | When set, a quick tap navigates `window.top` here instead of spawning a ripple (hold-to-feed still works). Also lowers the hover-move ripple threshold, so casual mouse movement ripples instead of needing a fast swipe. |
| `waterInterval` | `number` | `5` | Frames between water-layer (caustics/sparkles) refreshes. Higher is cheaper and slightly choppier — worth raising for small/background embeds. |
| `className` | `string` | `undefined` | Class applied to the wrapper `<div>`. |
| `style` | `CSSProperties` | `undefined` | Inline style on the wrapper (handy for positioning). |

## How it works

Everything is drawn by hand to one 2D canvas each frame, back to front:

> water + caustics → sparkles → light patches → stems → rain ripples → fish → food → pads + flowers →
> reeds → user / swipe ripples

A few implementation notes, in case you want to poke at it:

- **The water is cached.** Caustics, sparkles, and the pond-floor text are redrawn to an off-screen
  canvas only every few frames and blitted in, so the per-frame cost is mostly just the fish.
- **The koi are little agents.** Each has a wander angle driven by smooth noise, edge-avoidance, a
  flee impulse (from your clicks and swipes), hunger, and a depth value that dims and slows the deeper
  ones for a sense of water thickness.
- **Resolution follows the container.** An internal pixel height (`baseHeight`) drives a chunky, fixed
  pixel grid; the canvas is CSS-scaled up with `image-rendering: pixelated`, so it stays crisp and
  cheap at any display size.
- **It idles politely.** The animation pauses while the browser tab is hidden.

The playground UI (the controls panel) lives in [`src/App.tsx`](src/App.tsx) and
[`src/Controls.tsx`](src/Controls.tsx); it is just React state wired to the props above.

## Deploy

It is a static site, so any static host works. It builds to `dist/`.

- **Vercel / Netlify:** import the repo and accept the defaults (build `npm run build`, output `dist`).
- **GitHub Pages:** run `npm run build` and publish `dist/` (set Vite's `base` to `'/koi-pond/'` in
  `vite.config.ts` if it is served from a project subpath).

If you deploy your own version, update the "Preview" link above and `REPO_URL` in `src/App.tsx`.

## Tech

React 19, TypeScript, and Vite. No canvas or animation libraries; the rendering, physics, and fish
behaviour are all hand-written vanilla code.

## License

[MIT](LICENSE). Use it, change it, ship it, however you like. A credit back to
[riufukazawa.com](https://riufukazawa.com) is appreciated but not required.

Built by [Riu Fukazawa](https://riufukazawa.com).
