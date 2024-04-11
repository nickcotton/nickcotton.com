import { config as dotenvConfig } from 'dotenv';
import EleventyVitePlugin from '@11ty/eleventy-plugin-vite';
import { EleventyRenderPlugin } from "@11ty/eleventy";
import pluginRss from "@11ty/eleventy-plugin-rss";
import taskLists from 'markdown-it-task-lists';
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { DateTime } from 'luxon';
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import Image from "@11ty/eleventy-img";

export default function (eleventyConfig) {
  dotenvConfig();
  eleventyConfig.addGlobalData('env', process.env);
  eleventyConfig.addPlugin(EleventyVitePlugin, {
    viteOptions: {
      assetsInclude: ['**/*.xml'],
    }
  });
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		// which file extensions to process
		extensions: "html",

		// optional, attributes assigned on <img> override these values.
		defaultAttributes: {
			loading: "lazy",
			decoding: "async"
		},

    urlPath: "/images/",
	});

  eleventyConfig.addShortcode("image", async function (src, alt, sizes) {
		let metadata = await Image(src, {
			widths: [300, 600, 1200, 2400, "auto"],
			formats: ["avif", "webp", "auto"],
      urlPath: "/images/",
      outputDir: "./_site/images/",
		});

		let imageAttributes = {
			alt,
			sizes,
			loading: "lazy",
			decoding: "async",
      "eleventy:ignore": "",
		};

		return Image.generateHTML(metadata, imageAttributes);
	});

  // Static assets to pass through
  eleventyConfig.addPassthroughCopy('./src/fonts');
  eleventyConfig.addPassthroughCopy('./src/images');
  eleventyConfig.addPassthroughCopy('./src/public');
  eleventyConfig.addPassthroughCopy('./src/styles');
  eleventyConfig.addPassthroughCopy('./src/main.js');
  eleventyConfig.addPassthroughCopy('./src/dev.js');

  eleventyConfig.setServerOptions({
    // Default values are shown:

    // Whether the live reload snippet is used
    liveReload: true,

    // Whether DOM diffing updates are applied where possible instead of page reloads
    domDiff: true,

    // The starting port number
    // Will increment up to (configurable) 10 times if a port is already in use.
    port: 8080,

    // Additional files to watch that will trigger server updates
    // Accepts an Array of file paths or globs (passed to `chokidar.watch`).
    // Works great with a separate bundler writing files to your output folder.
    // e.g. `watch: ["_site/**/*.css"]`
    watch: [],

    // Show local network IP addresses for device testing
    showAllHosts: false,

    // Use a local key/certificate to opt-in to local HTTP/2 with https
    https: {
      // key: "./localhost.key",
      // cert: "./localhost.cert",
    },

    // Change the default file encoding for reading/serving files
    encoding: 'utf-8',
  });

  eleventyConfig.addFilter("postDate", (dateObj) => DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED))

  eleventyConfig.amendLibrary("md", mdLib => mdLib.use(taskLists));

  return {
    dir: {
      input: 'src',
      output: '_site',
    },
    passthroughFileCopy: true,
    templateFormats: ['liquid', 'html', 'md', 'njk'],
    htmlTemplateEngine: 'liquid',
    dataTemplateEngine: 'liquid',
    markdownTemplateEngine: 'liquid',
  };
};
