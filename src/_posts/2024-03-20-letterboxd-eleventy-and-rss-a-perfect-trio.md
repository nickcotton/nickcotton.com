---
title: Letterboxd, Eleventy and RSS - a Perfect Trio
date: 2024-03-20
toc: true
categories:
---

For my [/now](/now/) page, I wanted to add feeds for the things I've been watching/reading/listening to recently. It's no secret that I'm a fan of Letterboxd and movies in general so thought I'd start there.

## tl;dr just gimme the code

Install RSS Parser

```
npm install --save-dev rss-parser
```

Pop this in a file named `src/_data/letterboxd.js`:

```js
import Parser from "rss-parser";
const parser = new Parser({
  customFields: {
    item: ["description"],
  },
});

export default async function () {
  const feed = await parser.parseURL("https://letterboxd.com/nickcotton/rss/");
  return feed.items
    .filter((item) => item.link.includes("nickcotton/film"))
    .map((item) => {
      return {
        title: item.title,
        link: item.link,
        date: item.pubDate,
        posterImageSrc: item.description.match(/<img\s+src="([^"]*)/)?.[1],
      };
    });
}
```

Then use it in your templates like so:

```liquid
{% raw %}<ul>
  {% for film in letterboxd limit:24 %}
    <li>
      <a href="{{ film.link }}">
        <img
          src="{{ film.posterImageSrc }}"
          alt="{{ film.title }}"
          width="400"
          height="600"
          eleventy:widths="400">
      </a>
    </li>
  {% endfor %}
</ul>
{% endraw %}
```

Read on for details.

## Grab your Letterboxd RSS feed

In lieu of a publicly available API, each Letterboxd account has an RSS feed with recently logged movies and list updates (we'll go through how to filter these out). It's predictably in the form `https://letterboxd.com/[username]/rss/`. Even if there were an API, [RSS is arguably a better option anyway](https://en.wikipedia.org/wiki/Rule_of_least_power).

## Parsing RSS feeds in JS

Followed [an excellent article by Raymond Camden](https://www.raymondcamden.com/2022/03/08/including-rss-content-in-your-eleventy-site) on how to parse RSS feeds for Eleventy data. Basically, you can use RSS Parser to parse an RSS feed in Node JS and return the feed items as an Eleventy data source.

## Only return diary entries

In our JS, RSS Parser will return a list of items. We can filter these items to just get diary entries by checking if they include the string `username/film`.

## Make it dynamic

“But won't I have to rebuild my site any time the RSS feed is updated?”

Well, yes. Let's look at a way to automate that process though.

In Netlify, look in your site configuration and set up a build hook. This is a unique URL that will trigger a build when you hit it.

![Netlify Build Hook](/images/netlify-build-hook.png)


Now we want to create a new Zap in Zapier to ping that build hook URL when it detects a change in the RSS feed. AFAIK, it checks the feed every 15 mins, which is more than frequent enough for my use case. This was easy enough to set up so here's an overview of the result.

![Zap to trigger Netlify build](/images/zapier-netlify.png)

## Make it fast

If you set up the [Eleventy Image plugin](https://www.11ty.dev/docs/plugins/image/), it can be used to fetch and resize the images for you ahead of time. This means you're not restricted to using the 600px wide versions provided in the feed and you won't be hotlinking the images from Letterboxd on every pageview. Win win.

This ends up being pretty particular to my setup but I'm sure other hosting providers have similar options and the logic can be more broadly applied to other types of content.

I'm sure there are a lot of other ways this could be done too but this is server rendered, effectively dynamic and totally free. If you're doing something similar with other types of content, I'd love to know about it.
