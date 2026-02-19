# Service Timeline Animation (Beginner KISS Guide)

This file explains the current service timeline implementation for `#serviceOverview`.

Current behavior:
1. Mobile (`< 600px`) uses a larger vertical timeline.
2. Tablet/Desktop (`>= 600px`) uses horizontal timeline.
3. The section is pinned while scroll fills timeline progress.
4. Circle numbers are interactive too (`.service-circle-number`).

Goal in plain words:
Scroll controls timeline progress from `0` to `1`, and each milestone activates in order.

---

## 1) Files Involved

1. `public/templates/services.html`
2. `css/main.css`
3. `js/animations.js`

---

## 2) HTML Structure (Current Static Skeleton)

Timeline lives inside:
1. `<section id="serviceOverview">`
2. `<div class="service-overview__cont">`
3. `<svg class="service-overview__svg">`
4. `#lineDeactivated` and `#lineActivated`
5. `.service-circle` (4 circles)
6. `.service-circle-number` (4 numbers)
7. `.service-text` (4 labels)

Current static mobile defaults in `services.html`:
1. `viewBox="0 0 360 560"`
2. circle `cy`: `70`, `200`, `330`, `460`
3. line starts at `y1: 55` and ends at `y2: 482`

Why this matters:
Static SVG values prevent visual flash before JS runs, but JS still overwrites values at runtime using layout configs.

---

## 3) CSS Behavior (Pinned Section + Responsive Styling)

Main timeline CSS is in `css/main.css`.

### 3.1 Pinned/parallax section

`#serviceOverview` uses:
1. `--service-pin-distance`
2. `min-height: calc(100svh + var(--service-pin-distance))`
3. sticky inner container: `#serviceOverview > .section__text { position: sticky; top: 0; }`

KISS model:
The section is taller than the viewport, and sticky content stays in place while scroll is consumed by timeline progress.

### 3.2 Core timeline styles

1. `.service-overview__cont` centers timeline
2. `.service-overview__svg` keeps responsive width
3. `.service-circle`, `.service-text` have fill transitions
4. `.service-circle-number` base style:
   - `fill: #ffffff00` (hidden by default)
   - transition on fill
   - centered anchor/baseline

### 3.3 Mobile/desktop responsive blocks

1. `@media (max-width: 599px)`:
   - bigger fallback font sizes for numbers/text
2. `@media (min-width: 600px)`:
   - spacing and max-width tuning for timeline container/SVG

### 3.4 Horizontal mode class

JS toggles:
`#serviceOverview.service-overview--horizontal`

This class applies horizontal layout sizing behavior.

---

## 4) JavaScript Engine (`js/animations.js`)

All service timeline logic runs inside `DOMContentLoaded`.

## 4.1 Guard checks (important contract)

Code exits early if missing:
1. `#serviceOverview`
2. `.service-overview__svg`
3. `#lineActivated`
4. `#lineDeactivated`
5. mismatched counts across:
   - `.service-circle`
   - `.service-text`
   - `.service-circle-number`

KISS warning:
If counts do not match, animation is skipped safely.

## 4.2 Layout config objects

Two configs define geometry and size:
1. `verticalLayout` (mobile)
2. `horizontalLayout` (tablet/desktop)

Each config includes:
1. `viewBox`
2. `line` coordinates
3. `circles` coordinates
4. `texts` coordinates
5. `axis` (`'y'` or `'x'`)
6. `activeStart`
7. `circleRadius`
8. `lineStrokeWidth`
9. `numberFontSize`
10. `labelFontSize`

## 4.3 Breakpoint switch

`horizontalBreakpoint = 600`

1. `< 600` -> use `verticalLayout`
2. `>= 600` -> use `horizontalLayout`

Function: `applySvgLayout()`.

## 4.4 What `applySvgLayout()` updates at runtime

It applies layout values to SVG elements:
1. line coordinates and `stroke-width`
2. circle coordinates and `r`
3. number coordinates and number `font-size`
4. text coordinates, anchor/baseline, and text `font-size`
5. toggles `.service-overview--horizontal`

This is why one SVG can support two orientations cleanly.

## 4.5 Progress geometry

`recalculateTimelineGeometry()` reads coordinates from active axis:
1. vertical uses `cy`
2. horizontal uses `cx`

Then computes:
1. `minY`
2. `maxY`
3. `range`

Note:
`minY/maxY` names are reused for both axes.

## 4.6 Pin distance formula

`setPinDistance()`:
1. `stepCount = circles.length - 1`
2. `stepDistance = max(180, window.innerHeight * 0.28)`
3. `pinDistance = stepCount * stepDistance + window.innerHeight * 0.35`

Then writes CSS variable:
`--service-pin-distance`.

## 4.7 Scroll-to-progress formula

`updateServiceTimeline()`:
1. `pinStart = serviceOverviewSection.offsetTop`
2. `pinEnd = pinStart + pinDistance`
3. `progress = clamp((window.scrollY - pinStart) / (pinEnd - pinStart), 0, 1)`

Result:
progress moves from `0` to `1` while section is pinned.

## 4.8 Applying progress state

`applyProgress(progress)` does:
1. fills active line:
   - horizontal: updates `x2`
   - vertical: updates `y2`
2. updates milestone state:
   - active circle/text: `#84dbff`
   - inactive circle/text: `#ffffff00`
3. updates number state:
   - active number: `#ffffff`
   - inactive number: `#ffffff00`
   - set via inline JS style (`numbers[index].style.fill`)

Why inline style:
It avoids CSS fill priority conflicts with `.service-circle-number`.

## 4.9 Reduced motion behavior

If `prefers-reduced-motion: reduce`:
1. set `--service-pin-distance: 0px`
2. call `applyProgress(1)` (fully active immediately)
3. still reapply layout on resize

## 4.10 Performance

Uses `requestAnimationFrame` throttling:
1. `scrollTicking`
2. `resizeTicking`

This prevents excessive updates per frame.

---

## 5) Current Values Reference

| Item | Current Value |
|---|---|
| Orientation breakpoint | `600` |
| Pin coefficient A | `0.28` |
| Pin coefficient B | `0.35` |
| Pin minimum step | `180` |
| Active circle/text fill | `#84dbff` |
| Inactive circle/text fill | `#ffffff00` |
| Active number fill | `#ffffff` |
| Inactive number fill | `#ffffff00` |

Vertical layout (mobile):
| Key | Value |
|---|---|
| `viewBox` | `0 0 360 560` |
| line | `x1:100, y1:55, x2:100, y2:482` |
| circles | `(100,70) (100,200) (100,330) (100,460)` |
| texts | `(170,70) (170,200) (170,330) (170,460)` |
| `activeStart` | `55` |
| `circleRadius` | `22` |
| `lineStrokeWidth` | `5` |
| `numberFontSize` | `16` |
| `labelFontSize` | `20` |

Horizontal layout (tablet/desktop):
| Key | Value |
|---|---|
| `viewBox` | `0 0 520 220` |
| line | `x1:70, y1:110, x2:460, y2:110` |
| circles | `(70,110) (200,110) (330,110) (460,110)` |
| texts | `(70,165) (200,165) (330,165) (460,165)` |
| `activeStart` | `70` |
| `circleRadius` | `15` |
| `lineStrokeWidth` | `3` |
| `numberFontSize` | `12` |
| `labelFontSize` | `14` |

---

## 6) Troubleshooting (Recent Issues)

1. Numbers visible when they should be hidden:
Cause: CSS fill overriding SVG attribute updates.
Fix: use inline JS style for number fill (`numbers[index].style.fill`).

2. Changes not showing after edits:
Cause: stale dev server/cache.
Fix: hard refresh and/or restart server.

3. Wrong alignment after adding/removing milestones:
Cause: mismatched counts or incomplete layout updates.
Fix: keep circles, numbers, and labels one-to-one in HTML and both layout configs.

---

## 7) Safe Customization Checklist

1. Change breakpoint:
- edit `horizontalBreakpoint` in `js/animations.js`.

2. Adjust mobile visual scale:
- edit `verticalLayout` tokens:
  - `circleRadius`, `lineStrokeWidth`, `numberFontSize`, `labelFontSize`

3. Add/remove milestones:
- update all three lists in both layouts:
  - `circles`, `texts`, and corresponding SVG nodes in HTML
- keep counts equal for circles/numbers/texts.

4. Tune scroll feel:
- edit `setPinDistance()` coefficients (`0.28`, `0.35`, `180`).

---

## 8) Quick Test Checklist

1. Mobile: vertical layout is large and fills more whitespace.
2. Tablet/Desktop: horizontal layout still renders correctly.
3. Scroll down/up: states activate/deactivate in correct order.
4. Resize across `600px`: orientation and sizes switch correctly.
5. Reduced motion: timeline is immediately complete and stable.
