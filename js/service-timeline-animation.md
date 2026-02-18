# Service Timeline Explained (Beginner Friendly)

## 1) HTML Structure (What each part does)

### Section wrapper
- We use one section to hold the whole timeline.
- Give it an ID: `id="serviceOverview"` so JavaScript can find it.

### SVG timeline
- SVG is used because lines and circles are easy to animate.
- We place:
1. A gray base line (`lineDeactivated`) = full path.
2. A colored line (`lineActivated`) = progress line.
3. 4 circles = milestones.
4. 4 text labels = names of milestones.

### Why keep labels outside SVG too?
- Backup/fallback for layout consistency.
- If SVG fails, you still have readable labels.

## 2) CSS Styling (How it looks)

### Container
- `.service-overview__container` centers the timeline.
- Mobile-first: full width, comfortable spacing.

### SVG sizing
- `.service-overview__svg` uses responsive width and max width.
- Keeps timeline stable on small screens.

### Animated parts
- `.service-circle` and `.service-text` get `transition` so color changes look smooth.

### Fallback labels rule
- Important: do NOT hide labels for all devices by default.
- Better:
1. Show labels by default.
2. Hide only when SVG is active (or in a specific breakpoint).

## 3) JavaScript Logic (How animation works)

### Step 1: Find elements
- Get section: `#serviceOverview`
- Get circles/texts
- Get active line (`#lineActivated`)

### Step 2: Read progress from scroll
- On scroll, calculate how far user has moved through this section.
- Convert that to a value from `0` to `1`.

### Step 3: Update line
- Move active line `y2` from top circle toward last circle using progress.

### Step 4: Activate milestones
- For each circle:
1. If scroll passed that circle threshold -> make it active color.
2. Else -> keep default gray.

### Step 5: Performance
- Use `requestAnimationFrame` throttling (good).
- Also:
1. Cache circle Y positions.
2. Recalculate only on `resize`.
3. Use passive scroll listener.
4. Respect `prefers-reduced-motion`.

## 4) Simple Mental Model

- Gray line = full journey.
- Colored line = journey completed so far.
- Gray circles = upcoming.
- Cyan circles/text = completed.

## 5) Integration Checklist

1. Replace old `.service-overview__track` block with SVG block.
2. Add `id="serviceOverview"` on that section.
3. Add CSS timeline styles.
4. Add JS timeline function in `js/animations.js`.
5. Keep fallback labels visible unless intentionally hidden with a safe rule.
6. Test:
- Mobile width
- Desktop width
- Slow scroll
- Fast scroll
- Resize/rotate
- Reduced motion enabled
