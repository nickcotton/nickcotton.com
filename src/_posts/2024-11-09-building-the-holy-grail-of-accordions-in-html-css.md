---
title: Building the holy grail of accordions in HTML & CSS
date: 2024-11-09
---

For a recent work project, we needed to build an accordion to house some product information. It's something I've built a number of times before so this time I decided to see if I could do it all in pure HTML & CSS.

Requirements
- Transitions for opening/closing
- One open row at a time
- First row should start as open
- Should be server rendered
- Should not cause any Content Layout Shift

After a bit of reading and researching, it became obvious that using the `<details>`/`<summary>` elements would be the way to go. My experience when using new HTML inventions in the past is that you often have to sacrifice some flexibility or you can't style it exactly how you want, or the browser support isn't quite there so you just end up building your own version. Thankfully `<details>` and `<summary>` have been well supported for years now.

Ok lets get our basic HTML structure down. Imagine our accordion is showing a breakdown of product specs. It might look something like this. What I like about this structure is there's no wrapping element required, just the details elements one after another.

```html
<details>
  <summary>Description</summary>
  <p>With a brand new design and all new content, make time for yourself with our daily wellness journal. Start and end each day with a fresh mindset, set intentions and take note of the things that make you feel good. Inside, there are 12-weeks of pages for reflecting on your mindful goals, habits, sleep and energy levels, and the things you’re grateful for.</p>
</details>
<details>
  <summary>Dimensions</summary>
  <p>153mm &times; 215mm</p>
</details>
<details>
  <summary>What's inside</summary>
  <ul>
    <li><p>An introduction to the wellness eco system and the 6 pillars that sit within it</p></li>
    <li><p>12 weeks worth of daily overview pages (two-page spread for each day), with space for logging intentions, sleep and energy levels in the morning and evening</p></li>
    <li><p>Weekly and monthly check ins against the 6 wellness pillars</p></li>
    <li><p>Useful articles throughout, written by wellness expert</p></li>
    <li><p>Reflection and 360 life wheel at the end of your journalling journey </p></li>
  </ul>
</details>
```

And some basic styles to get us up and running

```css
/* Opt-in the whole page to interpolate sizes to/from keywords */
:root {
  interpolate-size: allow-keywords;
}

/* Fix Safari issue related to <summary> / <details> arrow */
details > summary.list-none::-webkit-details-marker,
details > summary.list-none::marker {
  display: none;
}

details {
  border-bottom: 1px solid #1e2525
}

details > summary {
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  align-items: center;
}

details > summary::after {
  content: "";
  height: 16px;
  width: 16px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Crect width='256' height='256' fill='none'/%3E%3Cpolyline points='208 96 128 176 48 96' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='16'/%3E%3C/svg%3E");
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  transition: transform 0.3s ease-in-out;
}

details[open] > summary::after {
  transform: rotateX(180deg);
}

details::details-content {
  display: block;
  height: 0;
  transition-property: height, content-visibility;
  transition-duration: 0.3s;
  overflow: hidden;
  transition-behavior: allow-discrete;
}

details[open]::details-content {
  height: auto;
  height: calc-size(auto);
}
```

A few really interesting details here, like the `::details-content` pseudo selector, the `open` attribute and this little snippet:

```css
:root {
  interpolate-size: allow-keywords;
}
```

This is a new CSS feature, only available in Chrome for now I think but it basically allows you to then use keywords in places like transitions. This is the magic that allows us to transition the accordion state without any JS. How good!

{% codeDemo %}

```html
<main class="bg-slate-500 text-white h-screen p-8">
  <details>
    <summary>Description</summary>
    <p>With a brand new design and all new content, make time for yourself with our daily wellness journal. Start and end each day with a fresh mindset, set intentions and take note of the things that make you feel good. Inside, there are 12-weeks of pages for reflecting on your mindful goals, habits, sleep and energy levels, and the things you’re grateful for.</p>
  </details>
  <details>
    <summary>Dimensions</summary>
    <p>153mm &times; 215mm</p>
  </details>
  <details>
    <summary>What's inside</summary>
    <ul>
      <li><p>An introduction to the wellness eco system and the 6 pillars that sit within it</p></li>
      <li><p>12 weeks worth of daily overview pages (two-page spread for each day), with space for logging intentions, sleep and energy levels in the morning and evening</p></li>
      <li><p>Weekly and monthly check ins against the 6 wellness pillars</p></li>
      <li><p>Useful articles throughout, written by wellness expert</p></li>
      <li><p>Reflection and 360 life wheel at the end of your journalling journey </p></li>
    </ul>
  </details>
</main>
```

```css
/* Opt-in the whole page to interpolate sizes to/from keywords */
:root {
  interpolate-size: allow-keywords;
}

/* Fix Safari issue related to <summary> / <details> arrow */
details > summary.list-none::-webkit-details-marker,
details > summary.list-none::marker {
  display: none;
}

details {
  border-bottom: 1px solid #1e2525
}

details > summary {
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  align-items: center;
}

details > summary::after {
  content: "";
  height: 16px;
  width: 16px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Crect width='256' height='256' fill='none'/%3E%3Cpolyline points='208 96 128 176 48 96' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='16'/%3E%3C/svg%3E");
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  transition: transform 0.3s ease-in-out;
}

details[open] > summary::after {
  transform: rotateX(180deg);
}

details::details-content {
  display: block;
  height: 0;
  transition-property: height, content-visibility;
  transition-duration: 0.3s;
  overflow: hidden;
  transition-behavior: allow-discrete;
}

details[open]::details-content {
  height: auto;
  height: calc-size(auto);
}
```

{% endcodeDemo %}
