module.exports = {
  author: "Nick Cotton",
  layout: "layouts/post.liquid",
  permalink: function ({ page }) {
    return `/blog/${page.fileSlug}/`;
  },
  tags: ["posts"],
};
