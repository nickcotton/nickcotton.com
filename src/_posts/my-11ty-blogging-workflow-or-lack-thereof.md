---
title: My 11ty Blogging Workflow (or Lack Thereof)
date: 2024-11-11
toc:
categories:
---

Since deciding to go with 11ty, I've struggled to come up with a simple, frictionless workflow for getting text out of my head, into a markdown document and then quickly published.

Here's the current process:
- Usually start writing a draft in Obsidian, I've got a folder for posts and this seems to be working. There's a bunch of drafts in there.
- Create an empty markdown file for the post in VSCode with some basic front matter (usually copied from another post)
- Try and get the dates right [^1].
- Copy the draft from Obsidian into VSCode which has my entire site repo open at all times.
- Create a new git branch for the post.
- Try and work out how how to fit a blog post into the Conventional Commits framework (feat? chore?).
- `git add .` to stage the file, which I always forget to do before committing.
- Commit.
- Create a PR (what) to the main branch of my own site (lol).
- Review the PR (am I ok?).
- Update the dates at the last minute.
- Merge.
- Netlify takes care of the rest.

Safe to say, there's a little bit of friction there. Event writing out the process feels exhausting. I've tried a few template generators and even came close to installing one of those git powered CMS plugins (opened a PR) but nothing's really stuck.

How do you all do it? Do you just live in your code editors? Push straight to the main branch? I wanna know.

[^1]:For some reason I'm getting super hung up on the date in the file name and the front matter. If I get that wrong or it's not specific enough, is it going to do weird things in RSS readers. Does anyone even subscribe to this blog in an RSS reader?
