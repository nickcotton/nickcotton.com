---
title: Playground
date: 2024-04-15
toc:
categories:
---

{% codeDemo 'Demo of a button that shows an alert when clicked' %}
```html
<button>Click me!</button>
```
```css
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
body,
html {
  height: 100%;
}
body {
  display: grid;
  place-content: center;
}
button {
  padding: 8px;
}
```
```js
const button = document.querySelector('button');
button.addEventListener('click', () => {
  alert('hello, 11ty!');
});
```
{% endcodeDemo %}
