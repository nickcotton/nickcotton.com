---
title: How to default to dark mode in Tailwind
toc:
date: 2024-03-09
categories:
---

So when I built this site, it just started as a dark site. That's how I envisaged it, I prefer it like that and that's where I focus most of my efforts. However I totally understand and appreciate that some people *need* to use light mode for various reasons. So while I listed "dark mode" as a task on my /todo, what I really needed to add was the styles for the *light* mode.

Once I'd done that, and added a toggle to the nav bar, I wanted to make sure the dark mode was still served by default. I think that's an ok thing to do (I should be able to creatively express myself how I like) but it does mean ignoring the `prefers-color-scheme: dark` media query. If you're ok with doing that, here's how I made dark mode the default.

Follow the instructions in the Tailwind docs about setting up dark mode. For me, that meant adding `darkMode: "selector"` to my `tailwind.config.js` file.

They also provide a short snippet explaining how to save and persist a theme across page loads.

```js
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}
```

But this assumes you want light mode to be the default. I made a couple of changes to the above code. First, I added the `dark` class to the `<html>` element by default. Second, I reworked the snippet above to only remove the dark class if light mode has been explicitly set, i.e. someone has clicked the light mode toggle.

```js
if (localStorage.theme === 'light') {
  document.documentElement.classList.remove('dark')
}
```

This code lives inline in the head of my document and so it runs before anything is rendered. If light mode has been set, remove the `dark` class, otherwise carry on with dark mode as the default.
