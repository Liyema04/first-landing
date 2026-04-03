# 📱 Mobile Web Design Protocol
> **For AI / Codex** — Styling & UX guidelines for mobile-first web interfaces.  
> Grounded in Toptal's Mobile UX Design Principles, Google Material Design, and Apple HIG.

---

## Table of Contents

1. [Core Philosophy](#1-core-philosophy)
2. [Layout & Spacing](#2-layout--spacing)
3. [Typography](#3-typography)
4. [Color System](#4-color-system)
5. [Touch Targets & Interaction Design](#5-touch-targets--interaction-design)
6. [Navigation Patterns](#6-navigation-patterns)
7. [Forms & Input](#7-forms--input)
8. [Feedback & System Status](#8-feedback--system-status)
9. [Performance & Loading](#9-performance--loading)
10. [Accessibility (a11y)](#10-accessibility-a11y)
11. [Gestures & Motion](#11-gestures--motion)
12. [Content Strategy](#12-content-strategy)
13. [Empty, Error & Edge States](#13-empty-error--edge-states)
14. [Component Cheatsheet](#14-component-cheatsheet)
15. [Anti-Patterns to Avoid](#15-anti-patterns-to-avoid)

---

## 1. Core Philosophy

> **Mobile is not a reduced desktop. It is its own medium.**

Every styling and structural decision must pass this filter:

| Question | Required Answer |
|---|---|
| Can a thumb reach it comfortably? | Yes |
| Does it work on a 375px screen? | Yes |
| Does it load in < 3 seconds on 4G? | Yes |
| Can it be understood in 1 glance? | Yes |
| Does it respect the user's attention? | Yes |

### Design Mindset Priorities (in order)
1. **Clarity** — the user always knows where they are and what to do next
2. **Speed** — perceived and real load performance
3. **Reachability** — all primary actions live in the thumb zone
4. **Feedback** — every action receives an immediate, visible/tactile response
5. **Accessibility** — design for the full spectrum of users by default

---

## 2. Layout & Spacing

### Viewport & Container

```css
/* Base reset */
*, *::before, *::after {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

html {
  font-size: 16px;           /* Never go below 16px base */
  -webkit-text-size-adjust: 100%;
  scroll-behavior: smooth;
}

body {
  min-height: 100dvh;        /* Use dvh, not vh — avoids mobile browser bar issues */
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

.container {
  width: 100%;
  max-width: 480px;          /* Sweet spot for mobile-first layouts */
  margin-inline: auto;
  padding-inline: 16px;      /* Minimum 16px side gutters */
}
```

### Spacing Scale (8pt Grid System)

```
4px   — Micro gaps (icon ↔ label, badge offsets)
8px   — Tight spacing (list item internal padding)
12px  — Compact elements
16px  — Base unit — default padding, gaps, margins
24px  — Section separation, card padding
32px  — Large section gaps
48px  — Hero/header breathing room
64px  — Page-level vertical rhythm
```

**Rule:** All spacing values must be multiples of **4px**. Prefer multiples of **8px** for major layout decisions.

### Breakpoints

```css
/* Mobile-first — add complexity upward */
/* Default styles: 0px – 479px (small phones) */

@media (min-width: 480px)  { /* Large phones, phablets */ }
@media (min-width: 768px)  { /* Tablets portrait */ }
@media (min-width: 1024px) { /* Tablets landscape, small laptops */ }
```

> **Codex instruction:** Always write base styles for the smallest screen first. Enhance upward with `min-width` queries only.

### Safe Areas (Notch / Dynamic Island / Home Indicator)

```css
.screen {
  padding-top:    env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left:   env(safe-area-inset-left);
  padding-right:  env(safe-area-inset-right);
}

/* Bottom nav bars need extra care */
.bottom-nav {
  padding-bottom: max(16px, env(safe-area-inset-bottom));
}
```

---

## 3. Typography

### Scale

| Token | Size | Line Height | Use |
|---|---|---|---|
| `--text-xs`   | 11px | 1.4 | Captions, badges, legal |
| `--text-sm`   | 13px | 1.5 | Secondary labels, metadata |
| `--text-base` | 16px | 1.6 | Body copy (minimum readable) |
| `--text-md`   | 18px | 1.5 | Lead text, subheadings |
| `--text-lg`   | 22px | 1.4 | Section titles |
| `--text-xl`   | 28px | 1.3 | Page headings |
| `--text-2xl`  | 36px | 1.2 | Hero headings |

```css
:root {
  --text-xs:   0.6875rem;   /* 11px */
  --text-sm:   0.8125rem;   /* 13px */
  --text-base: 1rem;        /* 16px */
  --text-md:   1.125rem;    /* 18px */
  --text-lg:   1.375rem;    /* 22px */
  --text-xl:   1.75rem;     /* 28px */
  --text-2xl:  2.25rem;     /* 36px */
}
```

### Font Rules

```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
               Helvetica, Arial, sans-serif;
  font-size: var(--text-base);
  line-height: 1.6;
  color: var(--color-text-primary);
}

/* Headings */
h1 { font-size: var(--text-xl);  font-weight: 700; line-height: 1.2; }
h2 { font-size: var(--text-lg);  font-weight: 600; line-height: 1.3; }
h3 { font-size: var(--text-md);  font-weight: 600; line-height: 1.4; }

/* Body */
p  { font-size: var(--text-base); line-height: 1.6; max-width: 65ch; }

/* Never go below 11px for any visible text */
```

### Typography Rules
- **No justified text** on mobile — causes uneven letter spacing on narrow columns
- **Line length:** 45–75 characters max (`max-width: 65ch`)
- **Letter spacing:** `-0.01em` to `-0.02em` on large headings; `0` or `+0.01em` on small labels
- **Weight contrast:** Use 400 (regular) and 600–700 (semibold/bold) — avoid mid-weights (500) on small text

---

## 4. Color System

### Semantic Tokens

```css
:root {
  /* Backgrounds */
  --color-bg-primary:    #FFFFFF;
  --color-bg-secondary:  #F5F5F7;
  --color-bg-tertiary:   #EBEBED;
  --color-bg-inverse:    #1C1C1E;

  /* Text */
  --color-text-primary:   #1C1C1E;   /* WCAG AA ≥ 4.5:1 on bg-primary */
  --color-text-secondary: #6E6E73;   /* Supporting info, placeholders */
  --color-text-tertiary:  #AEAEB2;   /* Disabled, hints */
  --color-text-inverse:   #FFFFFF;

  /* Brand / Interactive */
  --color-accent:         #007AFF;   /* Primary CTA, links */
  --color-accent-hover:   #0062CC;
  --color-accent-muted:   #E5F0FF;   /* Backgrounds, chips */

  /* Semantic */
  --color-success:        #34C759;
  --color-warning:        #FF9F0A;
  --color-error:          #FF3B30;
  --color-info:           #5AC8FA;

  /* Borders */
  --color-border:         rgba(0, 0, 0, 0.08);
  --color-border-strong:  rgba(0, 0, 0, 0.18);

  /* Dark mode */
  @media (prefers-color-scheme: dark) {
    --color-bg-primary:    #000000;
    --color-bg-secondary:  #1C1C1E;
    --color-bg-tertiary:   #2C2C2E;
    --color-text-primary:  #F2F2F7;
    --color-text-secondary:#8E8E93;
    --color-border:        rgba(255, 255, 255, 0.08);
  }
}
```

### Contrast Requirements

| Use Case | Minimum Contrast Ratio |
|---|---|
| Body text (< 18px) | 4.5 : 1 (WCAG AA) |
| Large text (≥ 18px bold) | 3 : 1 |
| Interactive focus rings | 3 : 1 against adjacent color |
| Decorative / disabled | No requirement |

> **Codex instruction:** Always validate color pairings against WCAG AA. Aim for AAA (7:1) on critical body text.

---

## 5. Touch Targets & Interaction Design

### Minimum Sizes

```css
/* ALL interactive elements */
.touchable {
  min-width:  44px;    /* Apple HIG minimum */
  min-height: 44px;
  /* Google Material: 48dp × 48dp for Android */
}

/* Extend hit area without affecting visual size */
.icon-button {
  position: relative;
  width: 24px;
  height: 24px;
}
.icon-button::after {
  content: '';
  position: absolute;
  inset: -12px;        /* Extends tap area to 48×48px */
}
```

### Spacing Between Targets

```css
/* Minimum 8px between any two tappable elements */
.button-group {
  display: flex;
  gap: 8px;
}
```

### Thumb Zone Strategy

```
┌─────────────────────┐  ← Status bar
│  🔴 Hard to reach   │
│  ─────────────────  │
│  🟡 Reachable       │  ← Headers, secondary nav
│  ─────────────────  │
│                     │
│  🟢 Natural thumb   │  ← Primary CTAs, main nav
│     zone            │
│  ─────────────────  │
│  🟢 Easy thumb      │  ← Bottom navigation bar
└─────────────────────┘  ← Home indicator
```

**Rules:**
- Primary CTA buttons → **lower half** of screen
- Destructive actions → **top half or behind confirmation** — never in thumb-zone by default
- Navigation → **bottom bar** preferred over hamburger menus

### Button Anatomy

```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  min-height: 52px;             /* Generous, comfortable tap target */
  padding: 14px 24px;
  border-radius: 14px;          /* Rounded, modern */
  border: none;

  font-size: var(--text-base);
  font-weight: 600;
  letter-spacing: -0.01em;

  background: var(--color-accent);
  color: var(--color-text-inverse);

  /* Touch feedback */
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  transition: transform 80ms ease, opacity 80ms ease;
  touch-action: manipulation;   /* Prevents 300ms click delay */
}

.btn-primary:active {
  transform: scale(0.97);
  opacity: 0.85;
}

/* Full-width on mobile by default */
.btn-primary {
  width: 100%;
}
@media (min-width: 480px) {
  .btn-primary {
    width: auto;
  }
}
```

---

## 6. Navigation Patterns

### Bottom Navigation Bar (Preferred)

```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;

  display: flex;
  align-items: stretch;

  background: var(--color-bg-primary);
  border-top: 1px solid var(--color-border);
  padding-bottom: env(safe-area-inset-bottom);

  /* Frosted glass effect (modern mobile feel) */
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  background: rgba(255, 255, 255, 0.85);
}

.bottom-nav__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 10px 4px;
  min-height: 56px;

  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-text-secondary);
  text-decoration: none;
  border: none;
  background: none;
  cursor: pointer;
  transition: color 150ms ease;
}

.bottom-nav__item[aria-current="page"] {
  color: var(--color-accent);
}

/* Max 5 items in bottom nav */
```

### Top App Bar

```css
.app-bar {
  position: sticky;
  top: 0;
  z-index: 90;

  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  height: 56px;

  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  background: rgba(255, 255, 255, 0.88);
  border-bottom: 1px solid var(--color-border);
}

.app-bar__title {
  flex: 1;
  font-size: var(--text-md);
  font-weight: 600;
  text-align: center;
  letter-spacing: -0.01em;
}
```

### Navigation Rules
- **≤ 5 destinations** in bottom nav — never more
- Avoid hamburger menus for primary navigation — they hide options and hurt discoverability
- Back navigation must always be reachable (system back gesture + UI affordance)
- Active state must be obvious: color + icon change (never rely on color alone)
- Tab bars should not scroll horizontally unless content warrants it (e.g., categories)

---

## 7. Forms & Input

### Input Field

```css
.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
}

.input-field {
  width: 100%;
  min-height: 52px;
  padding: 14px 16px;

  font-size: 16px;              /* CRITICAL: Prevents iOS auto-zoom on focus */
  font-family: inherit;
  color: var(--color-text-primary);

  background: var(--color-bg-secondary);
  border: 1.5px solid var(--color-border);
  border-radius: 12px;
  outline: none;
  appearance: none;
  -webkit-appearance: none;

  transition: border-color 150ms ease, box-shadow 150ms ease;
}

.input-field:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-muted);
}

.input-field:invalid:not(:placeholder-shown) {
  border-color: var(--color-error);
}

.input-hint {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

.input-error {
  font-size: var(--text-xs);
  color: var(--color-error);
}
```

### Input Type Optimization

```html
<!-- Always use the correct type to trigger native keyboards -->
<input type="email"    inputmode="email"   autocomplete="email">
<input type="tel"      inputmode="tel"     autocomplete="tel">
<input type="number"   inputmode="numeric" pattern="[0-9]*">
<input type="search"   inputmode="search">
<input type="url"      inputmode="url">
<input type="text"     inputmode="text"    autocomplete="name">
```

### Form UX Rules
- **Label above field** — never use placeholder as the only label (it disappears on focus)
- **Single-column forms** on mobile — never side-by-side fields
- **Inline validation** — show errors as the user finishes a field, not only on submit
- **autofill friendly** — always use `autocomplete` attributes
- **Font size ≥ 16px** on inputs — prevents iOS Safari from zooming in on focus
- **Large tap areas on checkboxes/radios** — wrap in `<label>` with padding
- Keyboard type should be dismissed when user taps outside or completes the form

---

## 8. Feedback & System Status

> Every action must have an immediate, perceivable response. Silence = broken.

### Loading States

```css
/* Skeleton loader — preferred over spinners for content */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-bg-secondary) 25%,
    var(--color-bg-tertiary)  50%,
    var(--color-bg-secondary) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes skeleton-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Spinner — for short operations (< 2 seconds) */
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-bg-tertiary);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### Toast / Snackbar

```css
.toast {
  position: fixed;
  bottom: calc(80px + env(safe-area-inset-bottom)); /* above bottom nav */
  left: 16px;
  right: 16px;
  z-index: 200;

  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;

  background: var(--color-bg-inverse);
  color: var(--color-text-inverse);
  border-radius: 14px;
  font-size: var(--text-sm);
  font-weight: 500;

  box-shadow: 0 8px 32px rgba(0,0,0,0.24);

  animation: toast-in 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes toast-in {
  from { transform: translateY(20px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
```

### Feedback Rules
- **Instant visual feedback** on tap: scale, color change, or ripple — within **100ms**
- **Button disabled state** during async operations — add `aria-busy="true"`
- **Progress bars** for operations > 2 seconds (show progress, not just a spinner)
- **Toasts** auto-dismiss after 4 seconds; include an optional action button (e.g., "Undo")
- **Never use alert()** — use custom modals or toast notifications
- **Haptic feedback** via `navigator.vibrate()` for destructive confirmations (where supported)

---

## 9. Performance & Loading

### Core Performance Budget

| Metric | Target |
|---|---|
| First Contentful Paint (FCP) | < 1.5s |
| Largest Contentful Paint (LCP) | < 2.5s |
| Time to Interactive (TTI) | < 3.5s |
| Cumulative Layout Shift (CLS) | < 0.1 |
| First Input Delay (FID) / INP | < 100ms |
| Total JS (gzipped) | < 150KB |
| Total CSS (gzipped) | < 30KB |

### Image Optimization

```html
<!-- Always define dimensions to prevent CLS -->
<img
  src="image.webp"
  alt="Descriptive alt text"
  width="375"
  height="200"
  loading="lazy"         <!-- lazy for below-fold -->
  decoding="async"
  fetchpriority="low"   <!-- "high" for LCP hero image -->
/>

<!-- Responsive images -->
<picture>
  <source srcset="img.avif" type="image/avif">
  <source srcset="img.webp" type="image/webp">
  <img src="img.jpg" alt="..." width="375" height="200">
</picture>
```

### CSS Performance Rules

```css
/* Use transform/opacity for animations — GPU-accelerated */
/* ✅ Good */
.animated { transition: transform 200ms ease, opacity 200ms ease; }

/* ❌ Bad — causes layout reflow */
.animated { transition: width 200ms ease, top 200ms ease; }

/* Avoid expensive properties on scroll */
/* Use will-change sparingly — only on elements that WILL animate */
.modal { will-change: transform; }

/* Contain layout impact of components */
.card { contain: layout; }
```

### Codex Performance Instructions
- Lazy load all images below the fold
- Inline critical CSS; defer non-critical stylesheets
- Use `font-display: swap` for web fonts
- Avoid layout shifts: always set `width` and `height` on images and video embeds
- Prefer `CSS transforms` over `top/left/width/height` for animations
- Use `preconnect` for third-party origins

---

## 10. Accessibility (a11y)

### Required Baseline

```html
<!-- Semantic HTML first -->
<main>
  <nav aria-label="Primary navigation">...</nav>
  <section aria-labelledby="section-heading">
    <h2 id="section-heading">Section Title</h2>
    ...
  </section>
</main>

<!-- Buttons vs links -->
<button type="button">Performs an action</button>
<a href="/page">Navigates somewhere</a>

<!-- Icon-only buttons need labels -->
<button type="button" aria-label="Close dialog">
  <svg aria-hidden="true" focusable="false">...</svg>
</button>

<!-- Images -->
<img src="..." alt="Meaningful description of content">
<img src="decorative.png" alt="" role="presentation">
```

### Focus Styles (Never Remove — Customize Instead)

```css
/* Custom focus ring — visible, beautiful */
:focus-visible {
  outline: 2.5px solid var(--color-accent);
  outline-offset: 3px;
  border-radius: 6px;
}

/* Remove default only when providing custom */
:focus:not(:focus-visible) {
  outline: none;
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Accessibility Rules
- **Color is never the sole indicator** of meaning (always pair with text, icon, or pattern)
- **Touch targets** meet minimum 44×44px for all interactive elements
- **ARIA roles** only when semantic HTML is insufficient — do not replace semantics with ARIA
- **Live regions** (`aria-live`) for dynamic content updates (toasts, status changes)
- **Tab order** must follow logical reading/interaction order
- **Forms** must have associated `<label>` elements (not just `placeholder`)
- **Modals** must trap focus and return focus on close

---

## 11. Gestures & Motion

### Supported Gestures

| Gesture | Use Case |
|---|---|
| Tap | Primary action, selection |
| Long press | Contextual menu, secondary actions |
| Swipe left/right | Delete item (with undo), navigate between views |
| Pull-to-refresh | Refresh list content |
| Pinch | Zoom into maps, images |
| Scroll | Vertical content navigation (default behavior) |

### Animation Timing

```css
:root {
  /* Duration */
  --duration-instant:  80ms;   /* Button press feedback */
  --duration-fast:    150ms;   /* Hover states, small transitions */
  --duration-normal:  250ms;   /* Standard UI transitions */
  --duration-slow:    400ms;   /* Modals, page transitions */
  --duration-enter:   300ms;   /* Elements entering the screen */
  --duration-exit:    200ms;   /* Elements leaving (exits are faster) */

  /* Easing */
  --ease-standard:  cubic-bezier(0.2, 0.0, 0, 1.0);     /* Material standard */
  --ease-decel:     cubic-bezier(0.0, 0.0, 0.2, 1.0);   /* Enter screen */
  --ease-accel:     cubic-bezier(0.4, 0.0, 1.0, 1.0);   /* Exit screen */
  --ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1);  /* Playful bounce */
}
```

### Page Transitions

```css
/* Slide-in from right (push navigation) */
.page-enter {
  transform: translateX(100%);
  opacity: 0;
}
.page-enter-active {
  transform: translateX(0);
  opacity: 1;
  transition: transform var(--duration-enter) var(--ease-decel),
              opacity   var(--duration-enter) var(--ease-decel);
}

/* Slide-out to left */
.page-exit-active {
  transform: translateX(-30%);
  opacity: 0;
  transition: transform var(--duration-exit) var(--ease-accel),
              opacity   var(--duration-exit) var(--ease-accel);
}
```

### Motion Rules
- **Exits are faster than entrances** — users don't need to watch things leave
- **No animations > 500ms** in the main UI thread
- **Avoid bouncy animations** on large structural elements — save spring easing for small, playful elements
- **Always implement** `prefers-reduced-motion` fallbacks
- **Do not autoplay** videos or animations that are purely decorative

---

## 12. Content Strategy

### Hierarchy Rules
- **One primary action per screen** — do not compete for attention
- **Progressive disclosure** — show details only when needed (accordions, "See more")
- **Truncation** — use ellipsis (`text-overflow: ellipsis`) for labels; show full text on expand
- **Prioritize above the fold** — key content visible without scrolling

### Text Patterns

```css
/* Truncation — single line */
.truncate {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* Clamp — multi-line truncation */
.clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.clamp-3 { -webkit-line-clamp: 3; }
```

### Writing Guidelines for Mobile
- **Headlines:** 5 words or fewer — punchy, scannable
- **Body text:** Short paragraphs (2–3 sentences max on mobile)
- **CTAs:** Action verbs — "Add to Cart", "Get Started", "Save Changes"
- **Errors:** Human, specific, actionable — "Your password needs at least 8 characters" not "Invalid input"
- **Labels:** Sentence case, not ALL CAPS (improves readability + accessibility)

---

## 13. Empty, Error & Edge States

### Every list/data view must handle all 5 states:

```
1. Loading  →  Skeleton screens
2. Empty    →  Friendly illustration + CTA
3. Error    →  Clear message + retry action
4. Success  →  Confirmation feedback (toast or inline)
5. Partial  →  Show what exists + "load more"
```

### Empty State Pattern

```html
<div class="empty-state" role="status">
  <img src="/icons/empty-inbox.svg" alt="" aria-hidden="true" width="96" height="96">
  <h3 class="empty-state__title">Nothing here yet</h3>
  <p class="empty-state__desc">Once you add items, they'll appear here.</p>
  <button class="btn-primary" type="button">Get started</button>
</div>
```

```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 48px 24px;
  gap: 16px;
  min-height: 240px;
}
```

### Error State Pattern

```html
<div class="error-state" role="alert">
  <p class="error-state__message">Couldn't load your data. Check your connection.</p>
  <button class="btn-secondary" type="button" onclick="retry()">Try again</button>
</div>
```

---

## 14. Component Cheatsheet

### Card

```css
.card {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: 20px;
  overflow: hidden;

  /* Subtle shadow */
  box-shadow: 0 1px 4px rgba(0,0,0,0.04), 
              0 4px 16px rgba(0,0,0,0.04);
}

/* Tappable card */
.card--interactive {
  cursor: pointer;
  transition: transform 150ms ease, box-shadow 150ms ease;
}
.card--interactive:active {
  transform: scale(0.98);
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}
```

### Modal / Bottom Sheet

```css
.bottom-sheet {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  z-index: 300;

  background: var(--color-bg-primary);
  border-radius: 24px 24px 0 0;
  padding: 8px 20px calc(20px + env(safe-area-inset-bottom));
  max-height: 90dvh;
  overflow-y: auto;
  overscroll-behavior: contain;

  box-shadow: 0 -8px 40px rgba(0,0,0,0.12);

  /* Drag indicator */
}
.bottom-sheet::before {
  content: '';
  display: block;
  width: 36px;
  height: 5px;
  background: var(--color-bg-tertiary);
  border-radius: 3px;
  margin: 0 auto 20px;
}
```

### List Item

```css
.list-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  min-height: 60px;

  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: background 100ms ease;
}
.list-item:active {
  background: var(--color-bg-secondary);
}
.list-item:last-child {
  border-bottom: none;
}
```

### Badge / Chip

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 100px;
  font-size: var(--text-xs);
  font-weight: 600;
  white-space: nowrap;
}
.badge--success { background: #E8FAF0; color: #1A7A3A; }
.badge--warning { background: #FFF5E5; color: #9A5700; }
.badge--error   { background: #FFECEB; color: #C0392B; }
.badge--info    { background: #EAF4FE; color: #0B5EA8; }
```

---

## 15. Anti-Patterns to Avoid

| ❌ Anti-Pattern | ✅ Correct Approach |
|---|---|
| Using `100vh` for full-screen height | Use `100dvh` to account for mobile browser UI |
| Font size < 16px on input fields | Always 16px minimum — prevents iOS zoom |
| Relying on hover states for mobile UI | Hover doesn't exist on touch — use tap/focus states |
| Hamburger menus for primary navigation | Bottom navigation bar with ≤ 5 items |
| Placeholder as the only label | Always use visible `<label>` elements |
| Autoplay video/audio | Respect user agency — require explicit play |
| Long loading without feedback | Show skeletons or progress indicators immediately |
| Color as sole meaning indicator | Pair with text, icon, or pattern |
| Touch targets < 44px | Minimum 44×44px for all interactive elements |
| `position: fixed` without safe area padding | Always add `env(safe-area-inset-*)` |
| Disabling pinch-to-zoom in meta viewport | Never use `user-scalable=no` — violates accessibility |
| `alert()`, `confirm()`, `prompt()` | Use custom modals with proper ARIA |
| Animating `width`, `height`, `top`, `left` | Animate `transform` and `opacity` only |
| Inline styles for theming | Use CSS custom properties (design tokens) |
| Non-semantic HTML with ARIA overrides | Use semantic HTML; ARIA only to fill gaps |

---

## Meta Viewport (Required on Every Page)

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- Never add: user-scalable=no or maximum-scale=1 — accessibility violation -->
```

---

## Quick Reference Card

```
Spacing grid:     4px base, 8px preferred unit
Min tap target:   44×44px (Apple) / 48×48px (Google)
Min font size:    16px on inputs, 11px on captions
Line length:      45–75 chars (max-width: 65ch)
Bottom nav:       Max 5 items
LCP target:       < 2.5s
CLS target:       < 0.1
FID/INP target:   < 100ms
Animation max:    500ms (UI) — exits shorter than entrances
Contrast AA:      4.5:1 for normal text, 3:1 for large text
```

---

*Protocol version 1.0 — Mobile-first web. Aligned with Toptal Mobile UX Principles, Apple HIG, Google Material Design 3, and WCAG 2.2.*
