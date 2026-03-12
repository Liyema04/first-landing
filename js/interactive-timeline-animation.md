# K.I.S.S. Guide: Overview Timelines  
*(used by both **#serviceOverview** and **#solutionsOverview** on services.html)*  

## What runs
- One shared engine: `initOverviewTimeline(config)` in `js/animations.js`.
- Called twice on `DOMContentLoaded` with two configs:
  - `serviceOverviewConfig`
  - `solutionsOverviewConfig`

## How it works (5 steps)
1) **Find elements** inside the target section (SVG, base/active lines, markers, numbers, labels). If any are missing or counts differ, it aborts safely.  
2) **Pick a layout**: vertical for screens under 600px, horizontal otherwise. Layout data supplies viewBox, line coords, marker coords, font sizes, etc.  
3) **Apply layout**: writes SVG positions/sizes, toggles a horizontal class, and caches marker positions.  
4) **Set pin distance**: computes how tall the scroll “runway” should be and stores it in a CSS variable (`--service-pin-distance` or `--solutions-pin-distance`).  
5) **Scroll → progress**: as you scroll, progress goes 0→1, the active line extends, and markers/text/numbers switch from transparent to colored. Reduced-motion users get the timeline fully lit immediately.

## Per-section specifics
- **Services (#serviceOverview)**
  - Markers: circles.  
  - Classes/vars: `service-overview--horizontal`, `--service-pin-distance`.  
  - Layouts: vertical viewBox `0 0 360 560`; horizontal `0 0 520 220`.

- **Solutions (#solutionsOverview)**
  - Markers: diamonds. Labels can wrap.  
  - Classes/vars: `solutions-overview--horizontal`, `--solutions-pin-distance`.  
  - Layouts: vertical viewBox `0 0 360 430`; horizontal `0 0 740 230`.

## K.I.S.S. tweaks
- **Add/remove steps**: keep counts aligned (markers, numbers, labels) in HTML *and* both layout arrays.  
- **Change breakpoint**: edit `horizontalBreakpoint` in the relevant config.  
- **Adjust spacing/size**: edit layout numbers (viewBox, line coords, marker radius, font sizes). Do it in both vertical and horizontal layouts.  
- **Motion sensitivity**: engine already honors `prefers-reduced-motion` by skipping scroll progress.

## Quick test checklist
- Mobile: vertical layout shows; markers/labels align.  
- Desktop: horizontal layout shows after 600px; markers/labels align.  
- Scroll: markers light up in order; active line grows with scroll.  
- Reduced motion: timeline is fully active without scrolling.
