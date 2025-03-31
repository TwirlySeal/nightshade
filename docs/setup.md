## Required software
- [Deno](https://deno.com/)
- [Python](https://www.python.org/)

**Language support extensions:**
There are editor extensions that provide support for Deno and the KDL language. For VS Code, search 'Deno' and 'KDL' in the Extensions tab, and there are also integrations for some other editors.

## Setup
1. Clone the repository:
```
git clone https://github.com/twirlyseal/nightshade.git
```

2. Create a virtual environment and install kdl-py:
```zsh
python -m venv env
source env/bin/activate # on Windows use `env\Scripts\activate`
pip install kdl-py
```

## Building the extension
When building the extension for the first time, you will need to perform all of these steps. Afterwards, you only need to build the components you've changed.

**Extension manifest:** Run `package/main.py` from inside the package folder

**TypeScript and CSS:** `deno task firefox` or `deno task chrome`

## Using the extension
> Reloading is only necessary when the extension manifest or JavaScript files are changed; for static files such as HTML, CSS, and images, the browser always uses the current version.

**Firefox:**
1. Navigate to `about:debugging` and click 'This Firefox'
2. Click 'Load Temporary Add-on' and click on any file in `build/firefox/` (e.g. `manifest.json`)

To reload the extension, click 'Reload'.

**Chrome:**
1. Navigate to `chrome://extensions` and enable developer mode
2. Click 'Load unpacked' and select the `build/chrome/` folder

To reload the extension, click the circular arrow icon on the extension card.
