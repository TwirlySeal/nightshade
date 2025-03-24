# Project structure
This document provides an overview of the different components of the project.

## `package/`
In browser extensions, the `manifest.json` file specifies metadata such as the name, description, and permissions. `manifest.kdl` is the source for Nightshade's manifest, from which `main.py` generates a `manifest.json` file each for Firefox and Chrome.

## `src/`
`css/` - CSS applied to Canvas by the injected script, organised by pages

`injected/` - The script that is injected into Canvas

`popup/` - The window that appears when you click on the extension icon in the browser toolbar

`background.ts` - The background script that opens the setup page upon first installing the extension

## Other
`build/` - output folder for generated code
