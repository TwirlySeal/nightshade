# Project structure
This document provides an overview of the different components of the project.

## Source code (in `src/`)
- `css/` - CSS applied to Canvas by the injected script, organised by pages
- `injected/` - The script that is injected into Canvas
- `popup/` - The window that appears when you click on the extension icon in the browser toolbar
- `background.ts` - The background script that opens the setup page upon first installing the extension

## Other
- `package/` - Contains scripts for automating build tasks such as bundling and manifest generation.
- `docs/` - Information about the project and learning resources
- `build/` - Output folder for generated code
