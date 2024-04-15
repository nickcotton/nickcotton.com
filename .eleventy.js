import { config as dotenvConfig } from 'dotenv';
import EleventyVitePlugin from '@11ty/eleventy-plugin-vite';
import { EleventyRenderPlugin } from "@11ty/eleventy";
import pluginRss from "@11ty/eleventy-plugin-rss";
import taskLists from 'markdown-it-task-lists';
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { DateTime } from 'luxon';
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { EleventyPluginCodeDemo } from "@ktsn/eleventy-plugin-code-demo";

export default function (eleventyConfig) {
  dotenvConfig();
  eleventyConfig.addGlobalData('env', process.env);
  eleventyConfig.addPlugin(EleventyVitePlugin);
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

  eleventyConfig.addPlugin(EleventyPluginCodeDemo, {
    name: "codeDemoPreview",

    /* Render whatever document structure you want. The HTML, CSS, and JS parsed
    from the shortcode's body are supplied to this function as an argument, so
    you can position them wherever you want, or add class names or data-attributes to html/body */
    renderDocument: ({ html, css, js }) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${js}</script>
      </body>
    </html>`,

    // key-value pairs for HTML attributes; these are applied to all code previews
    iframeAttributes: {
      height: '300',
      style: 'width: 100%;',
      frameborder: '0',
    },

    // Specify preprocessors. Object key is input source type. You must return an object having
    // output `type` (either 'js', 'css' or 'html') and proprocessed `output` string.
    preprocess: {
      ts: (source) => {
        return {
          type: 'js',
          output: compileTypeScript(source),
        };
      },
    },
  });

  eleventyConfig.addPairedShortcode("codeDemo", (html, css, js) => {
    const previewPlugin = eleventyConfig.plugins.find((plugin) => plugin.options?.name === "codeDemoPreview").plugin;
    return `
      <div class="code-demo">
        <div class="code-demo__preview">
          ${previewPlugin(eleventyConfig, {html, css, js}) }
        </div>
        <div class="code-demo__code">
          <pre class="code-demo__code-html"><code>${html}</code></pre>
          <pre class="code-demo__code-css"><code>${css}</code></pre>
          <pre class="code-demo__code-js"><code>${js}</code></pre>
        </div>
      </div>
    `;

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
