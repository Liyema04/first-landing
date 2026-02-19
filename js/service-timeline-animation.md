# Service Timeline Animation (Beginner KISS Guide)

This document explains how the `#serviceOverview` timeline works after the latest updates:

1. Mobile uses a vertical timeline.
2. Tablet and desktop use a horizontal timeline.
3. The section is pinned (parallax style) while timeline progress fills.

The goal is simple: scroll drives the progress line and activates each milestone in order.

---

## 1) Files involved

1. `public/templates/services.html`
2. `css/main.css`
3. `js/animations.js`

---

## 2) HTML structure (the static skeleton)

In `public/templates/services.html`, the timeline lives inside:

1. `<section id="serviceOverview">`
2. `<svg class="service-overview__svg">`
3. Two lines:
   - `#lineDeactivated` (gray full path)
   - `#lineActivated` (cyan progress path)
4. Four circles: `.service-circle`
5. Four labels: `.service-text`

Important rule:
The HTML starts with default vertical coordinates, but JavaScript rewrites the SVG coordinates at runtime for the correct device layout.

---

## 3) CSS behavior (pinning + responsive display)

All key styles are in `css/main.css`.

### A) Pinned/parallax section

`#serviceOverview` gets a dynamic scroll track using `--service-pin-distance`:

1. `min-height` is `viewport height + pin distance`
2. inner `.section__text` is `position: sticky; top: 0;`
3. result: content stays visually fixed while user scroll progress updates the SVG

KISS mental model:
The section is intentionally taller than the screen, and sticky content sits on top while scroll distance is "spent" filling the timeline.

### B) Base timeline styles

1. `.service-overview__cont` centers the SVG
2. `.service-overview__svg` is responsive width
3. `.service-circle` and `.service-text` have smooth color transitions

### C) Horizontal mode class

When JS decides the layout is horizontal, it adds:

`#serviceOverview.service-overview--horizontal`

This class gives wider SVG sizing for tablet/desktop.

### D) Breakpoint

At `@media (min-width: 600px)`, spacing and max-width are tuned for larger screens.

---

## 4) JavaScript behavior (core animation engine)

All logic is in `js/animations.js` inside the `DOMContentLoaded` block for service overview.

## 4.1 Guard checks

The code exits early if required elements are missing:

1. `#serviceOverview`
2. `.service-overview__svg`
3. `#lineActivated`
4. `#lineDeactivated`
5. matching counts for circles and text labels

This prevents runtime errors on pages that do not include this section.

## 4.2 Two layout presets

Two config objects define geometry:

1. `verticalLayout`
2. `horizontalLayout`

Each preset includes:

1. `viewBox`
2. line start/end coordinates
3. circle positions
4. label positions
5. axis mode (`'y'` for vertical, `'x'` for horizontal)
6. active line starting point

KISS idea:
Instead of creating two SVGs, we use one SVG and swap coordinates.

## 4.3 Breakpoint switch

`horizontalBreakpoint = 600`

If `window.innerWidth >= 600`, timeline switches to horizontal mode.
If less than `600`, timeline stays vertical.

Function used:
`applySvgLayout()`

This function:

1. picks active layout (vertical or horizontal)
2. toggles `.service-overview--horizontal` class
3. updates SVG `viewBox`
4. rewrites both line coordinates
5. rewrites circle coordinates
6. rewrites text positions and anchors

## 4.4 Geometry extraction

`recalculateTimelineGeometry()` reads milestone coordinates from the active axis:

1. in vertical mode, uses `cy`
2. in horizontal mode, uses `cx`

Then it computes:

1. `minY` = first milestone coordinate
2. `maxY` = last milestone coordinate
3. `range` = `maxY - minY`

Note:
variable names stayed `minY/maxY` for compatibility, but in horizontal mode they represent x-axis values.

## 4.5 Pin distance formula

`setPinDistance()` calculates how much scroll distance is needed to complete timeline fill:

1. `stepCount = circles.length - 1`
2. `stepDistance = max(180, window.innerHeight * 0.28)`
3. `pinDistance = stepCount * stepDistance + window.innerHeight * 0.35`

Then it writes:

`serviceOverviewSection.style.setProperty('--service-pin-distance', pinDistance + 'px')`

This keeps progression natural across mobile/tablet/desktop heights.

## 4.6 Scroll-to-progress formula

`updateServiceTimeline()` computes normalized progress:

1. `pinStart = serviceOverviewSection.offsetTop`
2. `pinEnd = pinStart + pinDistance`
3. `progress = clamp((window.scrollY - pinStart) / (pinEnd - pinStart), 0, 1)`

So:

1. at section entry, progress is near `0`
2. during pin track, progress moves from `0` to `1`
3. at `1`, last milestone is active and section can release

## 4.7 Applying progress to line + milestones

`applyProgress(progress)` does two things:

1. Fills active line:
   - horizontal mode: update `x2`
   - vertical mode: update `y2`
2. Activates circles and labels when progress passes each milestone threshold:
   - active color: `#3cf0c5`
   - inactive circle: `#ddd`
   - inactive text: `#707070`

## 4.8 Performance strategy

Scroll and resize handlers are throttled with `requestAnimationFrame`:

1. one scroll update per animation frame (`scrollTicking`)
2. one resize update per animation frame (`resizeTicking`)

This avoids excessive DOM writes and keeps animation smoother.

## 4.9 Accessibility: reduced motion

If `prefers-reduced-motion: reduce` is true:

1. pin distance is set to `0px`
2. progress is forced to complete state (`applyProgress(1)`)
3. timeline remains readable without scroll-driven animation
4. on resize, layout is still recalculated for correct orientation

---

## 5) Device behavior summary

### Mobile (`< 600px`)

1. Vertical timeline
2. Progress grows downward along y-axis
3. Labels appear to the right of circles
4. Section still uses pinned scroll track

### Tablet/Desktop (`>= 600px`)

1. Horizontal timeline
2. Progress grows left-to-right along x-axis
3. Labels are centered below circles
4. Same pinned scroll logic, different geometry

---

## 6) Beginner KISS mental model

Think of timeline as a ruler with 4 checkpoints.

1. CSS creates the "stage" (sticky content + extra scroll track).
2. JS chooses ruler orientation (vertical or horizontal).
3. Scroll converts to a `0..1` progress number.
4. That number fills the cyan line and unlocks checkpoints one by one.

---

## 7) How to safely customize

## Change the orientation breakpoint

Edit `horizontalBreakpoint` in `js/animations.js`.

## Add or remove milestones

Update all of these together:

1. SVG circles and texts in `services.html`
2. `verticalLayout.circles` and `verticalLayout.texts`
3. `horizontalLayout.circles` and `horizontalLayout.texts`

Keep counts aligned, or the guard check will exit the animation.

## Make timeline fill faster/slower

Tune values in `setPinDistance()`:

1. `0.28` controls per-step scroll feel
2. `0.35` controls extra tail distance
3. `180` is the minimum step distance floor

---

## 8) Test checklist

1. Mobile width: timeline is vertical and pins correctly.
2. Tablet width: timeline switches horizontal and fills left-to-right.
3. Desktop width: same as tablet, with proper centering.
4. Slow and fast scroll: no jumpy state.
5. Scroll up/backward: circles deactivate in reverse.
6. Resize while in section: orientation and progress recalculate correctly.
7. Reduced motion enabled: fully active timeline, no pin-scroll animation.
