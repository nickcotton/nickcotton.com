---
title: Trigger a Netlify build with Apple Shortcuts
date: 2024-03-26T08:46:14Z
---

When I was adding the reading list section to my /now page, I searched the Literal UI for an RSS feed or some other way to trigger a webhook whenever a new book was added. Alas! So I've had to come up with an ever so slightly more manual solution involving Apple Shortcuts.

A tap of this shortcut icon on my homescreen will now kick off a Netlify build for my personal site, updating any remote data in the process.

## Netlify build hooks

The first step is to set up a Netlify build hook. This is a URL that will trigger a build when visited. Do this in your Netlify dashboard.

![Create a build hook](/images/netlify-build-hook.png)

## Setting up the shortcut

1. Open the Shortcuts app and create a new shortcut.
2. Search for URL and add the action "Get contents of URL"
3. Use your Netlify build hook as the URL.
4. Set the method to POST
5. Either run it here to test, or save it out to your homescreen with whatever colour/icon you prefer.

{% image "./src/images/shortcuts.png", "Set up the shortcut and save it to your homescreen for one touch access", "(min-width: 30em) 50vw, 100vw" %}

Now any time you tap that icon, it'll kick off a build. You can see this working in your Netlify dashboard.

![See the build in progress on the Netlify dashboard](/images/netlify-builds.png)
