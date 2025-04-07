# Sizing Units
`rem` - Multiple of the root element's font size. The default unit for most uses

`em` - Multiple of the font size of the element being styled. Useful for scaling based on your own font size setting

`px` - Pixels. When precise control over pixels is needed

`ch` - The width of the character 0. Useful for sizing text containers

## Viewport Units
The viewport is the viewable content area in a browser window.
- `vh` - Fraction of the viewport height
- `vw` - Fraction of the viewport width

`vh` and `vw` don't account for browser interfaces that dynamically expand and retract (like the toolbar in mobile browsers which hides when you scroll down)
- `dvh`/`dvw` - Resizes when these interfaces expand and retract
- `svh`/`svw` - Based on the viewport size when these interfaces are retracted

# Nesting
Nesting reduces boilerplate for selectors with shared components. Nested selectors are child selectors, unless the nesting selector `&` is used which makes them compound selectors.

Without nesting:
```css
.card { background-color: gray; }
.card span { color: white; }
.card:hover { background-color: rebeccapurple; }
```

With nesting:
```css
.card {
    background-color: gray;
    span { color: white; }
    &:hover { background-color: rebeccapurple; }
}
```
