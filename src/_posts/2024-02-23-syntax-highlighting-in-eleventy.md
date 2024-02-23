---
title: Syntax Highlighting in Eleventy
---

A quick test to see if I've got the [Eleventy syntax highlighting plugin](https://www.11ty.dev/docs/plugins/syntaxhighlight/) working properly. I'm using the [Nord theme](https://github.com/PrismJS/prism-themes/blob/master/themes/prism-nord.css), which fits in decently well with the colours of the site.

## CSS

```css
.block {
  display: block;
}
```

## HTML

```html
<!DOCTYPE html>
<html class="leading-tight text-gray-900 antialiased" lang="en">
  <head>
    <meta charset="UTF-8" />
  </head>
  <body>
    <h1>Nick</h1>
  </body>
</html>
```

## Ruby
```ruby
def method_name
  @results = results
end
```

Lovely stuff! Excited to play around with this more and possibly explore [this approach](https://www.bram.us/2024/02/18/custom-highlight-api-for-syntax-highlighting/) outlined by Bramus.
