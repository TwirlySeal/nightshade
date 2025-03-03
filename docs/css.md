## Organisation
1. Use inline styles where a name doesn't make sense (e.g. wrapper divs)
2. Create classes for reusable UI components (e.g. button).
3. Combine classes to make variants of components.

```html
<button class="button enabled">
```

```css
.button {
    padding: 5px;

    &.enabled {
        background-color: blue;
    }

    &.disabled {
        background-color: darkblue;
    }
}
```

Benefits of this approach:
  - Styles are applied for both the base button and variant without repeated code
  - Selectors for variant classes are component-specific, making unintentional overlap less likely
  - JavaScript can easily transition between variants by changing the classes
  - `active` can become a convention as a variant name for other components, making them more clear

## Tips
- Use variables for reused values to centralise them
- Use rule nesting to greatly reduce boilerplate (like the example below)

```css
.menu {
    display: grid;

    @media (orientation: landscape) {
        grid-auto-flow: column;
    }

    &:hover {
        background-color: RebeccaPurple;
    }
}
```
