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
