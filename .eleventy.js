import { config as dotenvConfig } from 'dotenv';
import EleventyVitePlugin from '@11ty/eleventy-plugin-vite';
import { EleventyRenderPlugin } from "@11ty/eleventy";
import { feedPlugin, dateToRfc822 } from "@11ty/eleventy-plugin-rss";
import taskLists from 'markdown-it-task-lists';
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { DateTime } from 'luxon';
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import codeDemoShortcode from './config/codeDemoShortcode.js';

export default function (eleventyConfig) {
  dotenvConfig();
  eleventyConfig.addGlobalData('env', process.env);
  eleventyConfig.addPlugin(EleventyVitePlugin);
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom", // or "rss", "json"
		outputPath: "/feed.xml",
		collection: {
			name: "posts", // iterate over `collections.posts`
			limit: 0,      // 0 means no limit
		},
		metadata: {
			language: "en",
			title: "Nick Cotton - Blog",
			subtitle: "How Good",
			base: process.env.BASE_URL,
			author: {
				name: "Nick Cotton",
				email: "", // Optional
			}
		}
  });

  // TODO: can be removed once this is merged:
  // https://github.com/11ty/eleventy-plugin-rss/pull/51
  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter('head', function(array, n) {
    if(!n || n === 0) {
      return array;
    }
    if(n < 0) {
      throw new Error("`collection.limit` option must be a positive number.");
    }
    return array.slice(0, n);
  });

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

  eleventyConfig.addPairedShortcode("codeDemo", codeDemoShortcode);

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

  eleventyConfig.addNunjucksFilter("dateToRfc822", dateToRfc822);

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
