# reset.css usage

## Include in HTML templates
Load reset before main so shared utilities are available across pages.

```html
<link rel="stylesheet" href="/css/reset.css">
<link rel="stylesheet" href="/css/main.css">
```

## Shared section/text blocks
Use base section classes for consistent layout across templates.

```html
<section class="section section--light">
  <div class="section__text">
    <h1 class="section__title">Services</h1>
    <p class="section__desc">What we offer…</p>
  </div>
</section>
```

## Buttons
Base button + modifier classes.

```html
<a class="btn btn--blue" href="#">Get Started</a>
<a class="btn btn--orange btn--sm" href="#">Book Now</a>
```

## Animations (with animations.js)
Reset provides animation helpers:
- `anim-fade-up` (initial state)
- `anim-visible` (added by JS)
- `anim-stagger-1..4` (optional delays)

```html
<div class="anim-fade-up anim-stagger-2">I animate in</div>
```

```js
const items = document.querySelectorAll('.anim-fade-up');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('anim-visible');
    });
  },
  { threshold: 0.2 }
);

items.forEach((el) => observer.observe(el));
```

```html
<script src="/js/animations.js" defer></script>
```
