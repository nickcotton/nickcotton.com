export default {
  author: "Nick Cotton",
  layout: "layouts/post.liquid",
  permalink: function ({ page }) {
    return `/blog/${page.fileSlug}/`;
  },
  tags: ["posts"],
  eleventyComputed: {
    eleventyExcludeFromCollections: (data) =>
      data.eleventyExcludeFromCollections || data.draft,
  },
};
