This document explains how to solve common challenges when developing Nightshade.

# Timing
- The content script starts running before the `body` element exists, which causes DOM operations to fail without throwing an error.
This can be avoided using `bodyPromise()` to wait for the body element before accessing the DOM.

- Some UI elements in Canvas are created using JavaScript and may not be immediately present to manipulate.
You can use `elementPromise()` to wait for an element and get a reference to it safely.

- `eventPromise()` can be used to wait for a document event, which is useful for events like [DOMContentLoaded](https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event), [load](https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event), and [readystatechange](https://developer.mozilla.org/en-US/docs/Web/API/Document/readystatechange_event)

> Code that does not involve the DOM such as API requests should be called before waiting for optimal loading times

# Dynamic UI creation
In the content script, all custom elements are created dynamically with JavaScript.

`htmlFragment()` in `utils.ts` allows creating elements with a HTML string.

```JavaScript
const content = htmlFragment(`
  <h2>Heading</h2>
  <div class="title">
    <button class="action">
      <span class="material-symbols-outlined">arrow_right</span>
    </button>
    <span class="item-name">Example</span>
  </div>
`);

// Element references can be retrieved using standard query methods
const button = content.querySelector(".action");
button.addEventListener('click', () => console.log("action"));

document.body.append(content);
```
