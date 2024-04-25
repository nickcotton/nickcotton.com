import markdownit from "markdown-it";
import escape from "lodash.escape";
import { minify } from "html-minifier-terser";
import { outdent } from "outdent";
import { codeToHtml } from "shiki";
import { nanoid } from "nanoid";

const parseTokens = (tokens) => {
  const html = [];
  const css = [];
  const js = [];

  tokens.forEach((token) => {
    if (token.type === "fence") {
      if (token.info === "html") {
        html.push(token.content);
      } else if (token.info === "css") {
        css.push(token.content);
      } else if (token.info === "js") {
        js.push(token.content);
      }
    }
  });

  return {
    html: html.join(""),
    css: css.join(""),
    js: js.join(""),
  };
};

const renderDocument = ({ html, css, js }) => `
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="/styles/main.css">
    <style>${css}</style>
  </head>
  <body>
    ${html}
    <script>${js}</script>
  </body>
</html>`;

export default async function (content, title) {
  const name = nanoid(5);
  const md = markdownit();
  const tokens = md.parse(content, {});
  const { html, css, js } = parseTokens(tokens);

  const srcdoc = renderDocument({ html, css, js });
  const minifiedSrcdoc = await minify(srcdoc, {
    collapseWhitespace: true,
    removeComments: true,
    removeAttributeQuotes: true,
    useShortDoctype: true,
    minifyCSS: !!css,
    minifyJS: !!js,
  });
  const escapedSrcdoc = escape(minifiedSrcdoc);

  const langs = [];

  const shikiHtml = await codeToHtml(html, {
    lang: "html",
    theme: "vitesse-dark",
  });

  langs.push({ lang: "html", content: shikiHtml });

  let shikiCss, shikiJs;

  if (css) {
    shikiCss = await codeToHtml(css, {
      lang: "css",
      theme: "vitesse-dark",
    });
    langs.push({ lang: "css", content: shikiCss });
  }

  if (js) {
    shikiJs = await codeToHtml(js, {
      lang: "js",
      theme: "vitesse-dark",
    });
    langs.push({ lang: "js", content: shikiJs });
  }

  const id = nanoid(5);

  const tabs = (id) => {
    return langs
      .map(({ lang }, i) => {
        const checked = i === 0 ? "checked" : "";
        return outdent`
      <input type="radio" id="${lang}-${id}" name="code-demo-${name}" value="${lang}" class="sr-only ${lang}" ${checked} />
      <label class="px-4 py-2" for="${lang}-${id}">${lang.toUpperCase()}</label>`;
      })
      .join("");
  };

  const previewTab = (id) => {
    return outdent`
    <input type="radio" id="preview-${id}" name="code-demo-${name}" value="PREVIEW" class="sr-only preview" />
    <label class="px-4 py-2" for="preview-${id}">Preview</label>`;
  };

  const panes = langs
    .map(({ lang, content }) => {
      return outdent`
    <div class="tab-pane ${lang}">
      ${content}
    </div>`;
    })
    .join("");

  return outdent`
  <div class="code-demo not-prose mb-8">
    <div class="tabs flex bg-red-200">
      ${tabs(id)}
      ${previewTab(id)}
    </div>

    <div class="tab-content">
      ${panes}
      <div class="tab-pane preview" id="preview">
        <iframe
          srcdoc="${escapedSrcdoc}"
          title="${title}"
          width="1600"
          height="900"
          frameborder="0"
          style="width: 100%; height: auto; aspect-ratio: 16 / 9;"
        ></iframe>
      </div>
    </div>
  </div>`;
}
