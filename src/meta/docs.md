---
layout: 'layouts/prose.liquid'
title: 'docs'
subtitle: 'How I build and maintain this thing. Like a README.'
meta:
  desc: 'How the site is built'
---

The site is built with Eleventy, a static site generator and is hosted and deployed using Netlify. I forked [11st-starter-kit](https://github.com/stefanfrede/11st-starter-kit) to get me started and I'm sure there are relics of that lying around if you know where to look.

***

## Running the site

Run `npm run dev` in the folder.

## File structure

Posts live in `src/_posts/` - some have a date as part of the filename, some don't. Should make that consistent at some point. Nice to have them ordered with dates, but also nice that it's not required and adding dates adds a level of friction to the creation process (do you update the date just before you push to master?). Well this is becoming a blog post so I'll stop there.

## The media diary

The media diary lives on my /now page as that's usually what I've been up to lately. The collections each come from different sources and APIs, but I am thinking about consolidating all under one roof (could I ever really give up Letterboxd though?). I've been inspired by some other sites, like [Anh's](https://anhvn.com/media/).

## Front end

It's styled up with tailwind, mostly. I've jumped out of that mode whenever I've run into something that seems too custom or tricky but that's limited to a single file of a few hundred lines. Something to work on.
