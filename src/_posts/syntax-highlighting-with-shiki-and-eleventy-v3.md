---
title: Syntax highlighting with shiki and Eleventy v3
date: 2024-11-12
toc:
categories:
---

For the entire life of this website, up until yesterday, I used the official eleventy syntax highlighting plugin. It was kind of "set and forget" for me as I just wanted something that worked. Lately, I'd been tiring of the theme and so rather than just… find a new theme, I decided to see what else was out there.

I'd heard good things about [shiki](https://shiki.matsu.io/) so thought I'd see if it were possible to marry it up with 11ty.

I read [this great post](https://www.hoeser.dev/blog/2023-02-07-eleventy-shiki-simple/) but got spooked by all the `require()` calls so I rewrote it as ESM code. I'm just gonna leave it here in case it's useful for anyone else. At the time of posting, this works with the latest versions of Eleventy and shiki.

First, install shiki:

```shell
npm i -D shiki
```

Then add this to your `.eleventy.js` file:

```js
export default async function (eleventyConfig) {
  eleventyConfig.on("eleventy.before", async () => {
    const shiki = await import("shiki");
    const highlighter = await shiki.createHighlighter({
      themes: ["github-dark"],
      langs: ["html", "css", "yaml", "js", "ts", "liquid", "diff", "ruby"],
    });

    eleventyConfig.amendLibrary("md", function (mdLib) {
      return mdLib.set({
        highlight: function (code, lang) {
          let highlightedCode = highlighter.codeToHtml(code, {
            lang: lang,
            themes: {
              light: "github-dark",
              dark: "github-dark",
            },
          });

          return highlightedCode;
        },
      });
    });
  });
}
```

That's it, you're done! Tweak for whatever languages you want to highlight or whatever themse you want to use.

As a bonus, [this post by Stefan](https://stefanzweifel.dev/posts/2024/06/03/how-i-use-shiki-in-eleventy/) shows how he sets up a simple cache to speed up Eleventy dev server boot times. I haven't found this to be a huge issue for me so have opted for a simpler config but if you have a lot of posts or code blocks, this might be of help.
