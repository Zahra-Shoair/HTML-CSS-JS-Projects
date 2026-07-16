# Color Palette Generator — Concepts Reference

A study guide covering every HTML, CSS, and JavaScript concept used in this project.

---

## HTML

### Semantic structure
`<div class="container">` wraps the content; `<h1>` is used for the single page heading. Screen readers and search engines both rely on a meaningful heading hierarchy — don't skip levels or use headings just for their default font size.

### `<link rel="stylesheet">` with `integrity` + `crossorigin`
This is **Subresource Integrity (SRI)**. The `integrity` hash lets the browser verify a CDN file hasn't been tampered with before running it. `crossorigin="anonymous"` is required for SRI to work on cross-origin resources (i.e., files loaded from a different domain than your page).

### Icon fonts (Font Awesome)
`<i class="fa-solid fa-copy">` renders a glyph using a special font plus a CSS `::before` rule — it's not an image. This is why icons can silently disappear if the font fails to load: it's a font/CSS loading issue, not a missing file.

### `aria-hidden="true"`
Tells assistive technology to skip an element entirely. Used on icons that are purely decorative, where the real accessible label lives elsewhere (button text, `title` attribute, or `aria-label`).

### `role="button"` + `tabindex="0"`
Makes a non-interactive element (like a `<div>`) focusable via keyboard and tells assistive tech to treat it as a button. This does **not** come with built-in keyboard behavior — you must handle Enter/Space yourself in JS, unlike a real `<button>` element which gets this for free.

### IDs vs. classes
- `id` — unique, one per page, best for JS hooks or anchor links.
- `class` — reusable across many elements, best for styling and grouping.

Rule of thumb: style with classes, hook JS to IDs (or `data-*` attributes) when targeting one specific element.

---

## CSS

### `box-sizing: border-box`
Makes `padding` and `border` count *inside* an element's declared width/height instead of adding to it. It's a near-universal reset — without it, adding padding makes layouts wider than expected.

### The universal selector `*`
Applies a rule to every element on the page. Powerful but can be expensive on very large pages, and easy to override by accident. Fine at the scale of this project.

### `@import url(...)`
Pulls in another stylesheet (here, Google Fonts). Note: `@import` blocks parallel downloading and loads more slowly than a `<link>` tag placed in `<head>`. For production, prefer `<link>` for fonts.

### Flexbox (`display: flex`)
One-dimensional layout — a single row or column.
- Used on `<body>` to center `.container` both horizontally and vertically with `align-items` + `justify-content`.
- Used on `.color-info` to push the hex code and copy icon to opposite ends.

### CSS Grid (`display: grid`)
Two-dimensional layout — rows *and* columns at once.

```css
grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
```

This is the key trick in the project: the browser automatically calculates how many columns fit, each at least 130px wide, stretching to fill any leftover space. That gives a fully responsive grid without needing a media query to change the column count.

### `linear-gradient()`
Generates a smooth blend between colors. Used for the background and the button. The angle (`135deg`, `45deg`) controls the direction of the blend.

### Pseudo-elements (`::before`, `::after`)
Generate content that doesn't exist in the HTML.
- `h1::after` draws the decorative underline bar.
- `.copy-btn.active::before` swaps the icon's glyph to a checkmark by changing the `content` value the icon font renders.

### Pseudo-classes
- `:hover` — mouse is over the element.
- `:active` — element is currently being clicked.
- `:focus-visible` — element is focused via keyboard (not mouse click). Better UX than plain `:focus`, since it avoids showing outlines after a mouse click while still showing them for keyboard users.

### `transition`
Must be declared on the element's **base** state (not just inside `:hover`) in order to animate smoothly between states. Missing this was a bug in the original button CSS.

### `box-shadow` / `border-radius`
Create soft depth and rounded corners. Layered/soft shadows (e.g. `0 10px 25px rgba(0,0,0,0.3)`) are a common way to fake elevation.

### `rgba()`
A color value with an alpha (transparency) channel — commonly used for shadows so they blend naturally into any background color.

### Media queries (`@media (max-width: ...)`)
Apply CSS conditionally based on viewport size. Here, it just shrinks the grid's minimum column width on small screens.

---

## JavaScript

### `DOMContentLoaded`
Fires once the HTML has been fully parsed (but not necessarily after images/stylesheets/fonts finish loading). Wrapping code in this event ensures the elements you're selecting actually exist yet.

### Selecting elements
- `document.getElementById(id)` — fastest, but only works with IDs.
- `document.querySelector(selector)` — returns the *first* match, or `null`.
- `document.querySelectorAll(selector)` — returns a static NodeList of *all* matches.

### `addEventListener`
Attaches a function to run when an event fires (`click`, `keydown`, etc.), without overwriting any other listeners already attached — unlike `element.onclick = ...`, which replaces them.

### Event delegation
Instead of attaching a listener to every individual child element, attach **one** listener to a shared parent and inspect `event.target` to determine what was actually clicked. This is more efficient and automatically covers elements added to the page later — important here since the palette's colors change dynamically.

### `event.target.closest(selector)`
Walks up from the clicked element through its ancestors until it finds one matching the given selector (or returns `null`). This is the standard way to answer "which container was this click inside?"

### `this` in event handlers
Inside a function used as a listener (e.g. `addEventListener("click", copyText)`), `this` refers to the element the listener is attached to. This behaves *differently* with arrow functions, where `this` is not rebound — which is why a regular `function` was used here instead.

### `classList.add` / `.remove` / `.toggle`
The modern way to manipulate an element's CSS classes without manually editing the whole `className` string.

### Template literals
```js
`<div>${hex}</div>`
```
Backtick strings that allow variable interpolation with `${}`. Used in `createColorBox` to build an HTML string from a variable.

### `element.innerHTML`
Injects a string as HTML into an element. Convenient, but a security risk (XSS) if the string ever comes from untrusted user input. It's safe here because the content comes from your own hardcoded/generated hex values, not from user-typed text.

### `navigator.clipboard.writeText()`
The modern Clipboard API. It returns a **Promise**, so it can fail (e.g. non-HTTPS context, permission denied) — always pair it with `.then()`/`.catch()` rather than assuming it always succeeds.

### Promises (`.then` / `.catch`)
Handle asynchronous operations. `.then()` runs on success; `.catch()` runs on failure. Always pair them for anything that can fail — network requests, clipboard access, file reads, etc.

### `setTimeout`
Schedules code to run after a delay, in milliseconds. Used here to revert the copy icon back to normal 1.5 seconds after showing a checkmark.

### `Math.random()` / `Math.floor()`
- `Math.random()` returns a float between 0 (inclusive) and 1 (exclusive).
- `Math.floor()` rounds down to the nearest integer.

Combined, they generate a random whole number within a given range.

### Number base conversion — `.toString(16)`
Converts a number to a hexadecimal (base 16) string. `0xffffff` is hex literal notation for the largest 6-digit hex value (16,777,215 in decimal) — the entire RGB color space expressed as one number.

### `.padStart(6, "0")`
Pads a string with leading characters until it reaches a target length. This matters here because small random numbers convert to hex strings shorter than 6 characters (e.g. `5` instead of `000005`), which would otherwise produce invalid or unintended colors.

### `for...of` loops
Iterate over the **values** of an iterable (arrays, NodeLists, HTMLCollections). This differs from `for...in`, which iterates over **keys/indices** — mixing the two up is a common source of bugs.

### `document.createElement`
Builds a new DOM node programmatically, as an alternative to writing static HTML directly. Used in `createColorBox` so the palette markup only has to be maintained in one place (JavaScript) instead of being duplicated in the HTML file too.

---

## Quick self-test

Try explaining these in your own words before checking back against the notes above:

1. Why does `grid-template-columns: repeat(auto-fit, minmax(130px, 1fr))` make a grid responsive without media queries?
2. Why did clicking a color swatch vs. the copy icon behave differently before the `.closest()` fix?
3. Why does `navigator.clipboard.writeText()` need a `.catch()`?
4. Why does `0.toString(16)` sometimes need `.padStart(6, "0")`?
5. What's the practical difference between attaching one listener to a parent (delegation) vs. one listener per child?
