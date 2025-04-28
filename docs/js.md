- Open API endpoints in your browser to see an example of the returned JSON. If you use Firefox, it adds syntax highlighting and shows arrays and objects collapsed

- Firefox and Chrome DevTools both have different strengths. Firefox is better at HTML and CSS, while Chrome is better at JavaScript and performance analysis. It can be worthwhile to use both.

- Querying a specific element instead of the document constrains the search scope which reduces the likelihood of selecting the wrong elements.

- Use HTML to define UI, CSS to define visual states, and JavaScript to switch between them

- Mutation for local state, events for distant dependencies

- Keep creation of elements decoupled from their insertion and querying of elements decoupled from their mutation

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
The template element holds a HTML fragment that can be cloned via JavaScript, allowing reusable views with less boilerplate. The element's content is not rendered, but stored in a read-only `content` property as a `DocumentFragment`.

```HTML
<div id="view">
    <template>
        <div class="card">
            <p class="title"></p>
            <p class="desc"></p>
        </div>
    </template>

    <script>
      const view = document.getElementById("view");
      const template = view.querySelector("template");
      const data = [
        {title: "Item 1", desc: "Description 1"},
        {title: "Item 2", desc: "Description 2"}
      ];

      view.append(...data.map(item => {
        const clone = templ.content.cloneNode(true);
        const setText = (selector, text) => clone.querySelector(selector).textContent = text;

        setText(".title", item.title);
        setText(".desc", item.desc);
        return clone;
      }));
    </script>
</div>
```

## Shadow DOM
Shadow DOM allows DOM trees to be encapsulated from JavaScript and CSS in a page. Styles applied inside the shadow DOM will be scoped, and not apply outside the shadow root.
