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

Let's have a look at a shortened version of our RSS feed:

```xml
<?xml version='1.0' encoding='utf-8'?>
<rss version="2.0"
	xmlns:atom="http://www.w3.org/2005/Atom"
	xmlns:dc="http://purl.org/dc/elements/1.1/"
	xmlns:letterboxd="https://letterboxd.com"
	xmlns:tmdb="https://themoviedb.org">
	<channel>
		<title>Letterboxd - Nick Cotton</title>
		<link>https://letterboxd.com/nickcotton/</link>
		<description>Letterboxd - Nick Cotton</description>
		<atom:link rel="self" href="https://letterboxd.com/nickcotton/rss/" type="application/rss+xml"/>

		<item>
			<title>Theater Camp, 2023</title>
			<link>https://letterboxd.com/nickcotton/film/theater-camp-2023/</link>
			<guid isPermaLink="false">letterboxd-watch-558527692</guid>
			<pubDate>Thu, 21 Mar 2024 04:10:09 +1300</pubDate>
			<letterboxd:watchedDate>2024-03-20</letterboxd:watchedDate>
			<letterboxd:rewatch>No</letterboxd:rewatch>
			<letterboxd:filmTitle>Theater Camp</letterboxd:filmTitle>
			<letterboxd:filmYear>2023</letterboxd:filmYear>
			<tmdb:movieId>986054</tmdb:movieId>
			<description><![CDATA[ <p><img src="https://a.ltrbxd.com/resized/film-poster/8/8/7/6/5/0/887650-theater-camp-0-600-0-900-crop.jpg?v=ba9c77cf10"/></p> <p>Watched on Wednesday March 20, 2024.</p> ]]></description>
			<dc:creator>Nick Cotton</dc:creator>
		</item>

		<item>
			<title>Essentials</title>
			<link>https://letterboxd.com/nickcotton/list/essentials/</link>
			<guid isPermaLink="false">letterboxd-list-1703095</guid>
			<pubDate>Mon, 10 Jul 2017 20:43:26 +1200</pubDate>
			<description><![CDATA[ <ul> <li> <a href="https://letterboxd.com/film/short-term-12-2013/">Short Term 12</a> </li> <li> <a href="https://letterboxd.com/film/the-intouchables/">The Intouchables</a> </li> <li> <a href="https://letterboxd.com/film/sing-street/">Sing Street</a> </li> <li> <a href="https://letterboxd.com/film/boyhood/">Boyhood</a> </li> <li> <a href="https://letterboxd.com/film/searching-for-sugar-man/">Searching for Sugar Man</a> </li> </ul> ]]></description>
			<dc:creator>Nick Cotton</dc:creator>
		</item>
	</channel>
</rss>
```

We can see there's some metadata about the feed at the top, then a film entry, then a list entry. In reality, there are up to 50 film entries but have just put one here as an example.

So how might we turn our feed into something like:

```json
[
  {
    "title": "Theater Camp",
    "link": "https://letterboxd.com/nickcotton/film/theater-camp-2023/",
    "date": "Thu, 21 Mar 2024 04:10:09 +1300",
    "posterImageSrc": "https://a.ltrbxd.com/resized/film-poster/8/8/7/6/5/0/887650-theater-camp-0-600-0-900-crop.jpg?v=ba9c77cf10"
  }
]
```

Well, I followed [an excellent article by Raymond Camden](https://www.raymondcamden.com/2022/03/08/including-rss-content-in-your-eleventy-site) on how to parse RSS feeds for Eleventy data. Basically, you can use RSS Parser to parse an RSS feed in Node JS and return the feed items as an Eleventy data source.

I've extended his example slightly to filter and manipulate the feed items, and also to extract the poster image URL from the description.

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

## Use it in your Eleventy template

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
