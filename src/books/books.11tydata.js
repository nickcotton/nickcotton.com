export default {
  author: "Nick Cotton",
  layout: "layouts/book.liquid",
  permalink: function ({ page }) {
    return `/books/${page.fileSlug}/`;
  },
  tags: ["books"],
  eleventyComputed: {
    eleventyExcludeFromCollections: (data) =>
      data.eleventyExcludeFromCollections || data.draft,
  },
};
