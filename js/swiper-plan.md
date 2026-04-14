### Preserve Current Testimonial Design While Converting Grid to Swiper Track

### Summary
Convert only the **track behavior** of `.clients-wrapper-grid` from Grid to Swiper’s required wrapper model, and keep your existing `.client-card` visual styling untouched.  
This avoids distortion by moving width/margin layout rules to a new outer Swiper container.

### Implementation Changes
1. **HTML structure update** in [why-apex.html:199](c:\Users\liyem\.vscode\WebDev\ProjectOneDemo\first-landing\public\templates\why-apex.html:199)
- Wrap testimonials with a Swiper container.
- Keep your current class names, but add Swiper classes:
```html
<div class="clients-centered-block anim-fade-up anim-stagger-2">
  <div class="clients-swiper swiper">
    <div class="clients-wrapper-grid swiper-wrapper">
      <div class="client-card swiper-slide" id="client-1">...</div>
      <div class="client-card swiper-slide" id="client-2">...</div>
      <div class="client-card swiper-slide" id="client-3">...</div>
    </div>
    <div class="swiper-pagination"></div>
  </div>
</div>
```

2. **Replace grid behavior on wrapper** in [reset.css:444](c:\Users\liyem\.vscode\WebDev\ProjectOneDemo\first-landing\css\reset.css:444) and [reset.css:866](c:\Users\liyem\.vscode\WebDev\ProjectOneDemo\first-landing\css\reset.css:866)
- `.clients-wrapper-grid` should be a Swiper track, not a grid:
```css
.clients-wrapper-grid {
  display: flex;   /* Swiper expects flex track */
  gap: 0;          /* use Swiper spaceBetween instead */
  width: 100%;
  max-width: none;
  margin: 0;
}
```

3. **Move your old wrapper sizing to a new container**
- Add:
```css
.clients-swiper {
  width: 100%;
  max-width: 400px;
  margin: 2rem auto;
  overflow: hidden;
}

@media (width > 768px) {
  .clients-swiper {
    max-width: 700px;
  }
}
```
- Keep `.client-card` styles as-is (this preserves the look).

4. **Initialize Swiper in JS**
- Add CDN CSS/JS includes, then init:
```js
new Swiper('.clients-swiper', {
  slidesPerView: 1,
  spaceBetween: 24,
  autoHeight: true,
  grabCursor: true,
  pagination: {
    el: '.clients-swiper .swiper-pagination',
    clickable: true
  }
});
```

### Why this avoids distortion
- Your current design is in `.client-card` and its children, not in the grid algorithm.
- Distortion usually happens when people keep `display:grid` on `.swiper-wrapper` or keep `max-width/margin` on the moving track.
- This plan keeps card internals unchanged and only swaps track mechanics.

### Test Plan
1. Mobile: one card visible, swipe left/right, no horizontal page overflow.
2. Desktop: same card width/look as now, centered block, swipe works.
3. Content height: long reviews should not clip (`autoHeight: true`).
4. Verify no layout jump when first slide loads.

### Assumptions
- Default behavior is **1 card per view** on all breakpoints (matching your current visual density).
- Pagination dots are sufficient for navigation (no arrows yet).