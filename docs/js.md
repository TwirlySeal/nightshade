- Open API endpoints in your browser to see an example of the returned JSON. If you use Firefox, it adds syntax highlighting and shows arrays and objects collapsed

- Firefox and Chrome DevTools both have different strengths. Firefox is better at HTML and CSS, while Chrome is better at JavaScript and performance analysis. It can be worthwhile to use both.

- Querying a specific element instead of the document constrains the search scope which reduces the likelihood of selecting the wrong elements.

# DOM API
[`Document`](https://developer.mozilla.org/en-US/docs/Web/API/Document) methods:
- `getElementById()`
- `createElement()`

Element and Document shared methods:
- `append()` - Insert a set of nodes after the last child of the element
- `prepend()` - Insert a set of nodes before the first child of the element
- `querySelector()` - Find the first element that matches a CSS selector
- `querySelectorAll()`
- `getElementsByClassName()`
- `getElementsByTagName()`

[`Element`](https://developer.mozilla.org/en-US/docs/Web/API/Element) methods:
  - `after()` - Insert a set of nodes after the element
  - `before()` - Insert a set of nodes before the element
  - `replaceWith()`
  - `replaceChildren()`
  - `matches()` - Test whether the element would be selected by the specified CSS selector
  - `closest()` - Traverses up toward the document root to find the first node that matches the specified CSS selector

## \<template>
Template elements hold HTML content that is not rendered on the page. The `content` read-only property of a template element holds a `DocumentFragment` that contains the child nodes of the template. This fragment can be cloned via the `cloneNode` method and inserted into the DOM.

## Shadow DOM
Shadow DOM allows DOM trees to be encapsulated from JavaScript and CSS in a page. Styles applied inside the shadow DOM will be scoped, and not apply outside the shadow root.
