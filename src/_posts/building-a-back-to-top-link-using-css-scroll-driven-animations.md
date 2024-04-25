---
title: Building a back to top link using CSS scroll-driven animations
date: 2024-04-24
toc:
categories:
---

It's just something to do, isn't it?

I've been making my way through the (brilliant) list of things on [100 things you can do on your personal website](https://jamesg.blog/2024/02/19/personal-website-ideas/) and the equally brilliant [follow-up](https://jamesg.blog/2024/03/10/100-more-personal-website-ideas/). I've found myself just doing things on the list for something to do. I can often tick off one or two an evening (which is the only free time I seem to have these days). Quite often they'd lead to learning or creating something interesting.

When I went to tackle the back-to-top link, I wanted to challenge myself to use a CSS-only approach. Coincidentally, I'd read an article (or at least come across the title of an article) about creating a CSS only back-to-top link using `position: sticky` — in the end, I had a bit of trouble getting that approach to work so left it alone for a while, hoping inspiration would strike.

A few weeks later I came across and watched [Kevin Powell's video on scroll driven animations](https://www.youtube.com/watch?v=UmzFk68Bwdk). Sheer luck that I chose this one as I'm not a subscriber (nothing against him, I'm just not that big on YouTube).

It unlocked an idea and a new approach, one I haven't seen anywhere else, so I thought I'd share. If the browser doesn't support the CSS scroll-driven animation API, the button will just show at all times. Not the worst fallback.

First let's create the element on the page. I've set it to be fixed in the bottom right corner and put it just before my closing body tag. The icon is a simple svg arrow from the heroicons set.

```html
<a href="about:srcdoc#" title="Back to top" class="back-to-top fixed size-12 bottom-8 right-8 bg-slate-900 text-white border-2 border-slate-400 rounded-full flex items-center justify-center z-50 transition-colors hover:border-white">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
    <path fill-rule="evenodd" d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0 1 10 17Z" clip-rule="evenodd" />
  </svg>
</a>
```

Now let's create a simple animation for this element to use:

```css
@keyframes come-on-up {
  from {
    transform: translateY(200px);
  }

  to {
    transform: translateY(0);
  }
}
```

Now let's tie that animation to the scroll position:

```css
.back-to-top {
  animation: come-on-up linear;
  animation-range-start: entry;
  animation-timeline: view();
}
```

Now let's put it all together in a demo:

{% codeDemo %}
```html
<main class="bg-slate-500">
  <article class="flex items-center justify-center">
    <p>Scroll down to see it in action</p>
  </article>
  <a href="#" title="Back to top" class="back-to-top fixed size-12 bottom-8 right-8 bg-slate-900 text-white border-2 border-slate-400 rounded-full flex items-center justify-center z-50 transition-colors hover:border-white">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
      <path fill-rule="evenodd" d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0 1 10 17Z" clip-rule="evenodd" />
    </svg>
  </a>
</main>
```
```css
main {
  height: 400vh;
}

article {
  height: 100vh;
}

.back-to-top {
  animation: come-on-up linear;
  animation-range-start: entry;
  animation-timeline: view();
}

@keyframes come-on-up {
  from {
    transform: translateY(200px);
  }

  to {
    transform: translateY(0);
  }
}
```
{% endcodeDemo %}

A couple of caveats here:

- It should be pretty easy to see how you can customise the threshold and timings of the animation.
- I've styled this with a mixture of tailwind/utility classes and normal CSS. Don't lynch me. Trying to keep only the relevant stuff in the demo.
- The href of the link in the demo is `about:srcdoc#` but that's just to get it working in an iframe. You can just use `#` and that should work fine.
