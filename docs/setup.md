# Required software
- [Deno](https://deno.com/) and [Python](https://www.python.org/) need to be installed to build the extension.

- Editor extensions for Deno and KDL are recommended. For VS Code, search 'Deno' and 'KDL' in the Extensions tab, and there are also integrations for other editors.

# Setup
1. Clone the repository:
```zsh
git clone https://github.com/twirlyseal/nightshade.git
```

2. Create a virtual environment and install kdl-py:
```zsh
python3 -m venv env # on Windows use `python` instead of `python3`
source env/bin/activate # on Windows use `env\Scripts\activate`
pip install kdl-py
```

# Building the extension
When building the extension for the first time, you will need to perform all of these steps. Afterwards, you only need to build the components you've changed.

**TypeScript and injected CSS:** `deno task firefox` or `deno task chrome`

**Extension manifest:** Run `package/manifest.py`

**Other files:** Run `package/copy.py`

# Using the extension
> Reloading is only necessary when the extension manifest or JavaScript files are changed. For static files such as HTML, CSS, and images, the browser always uses the current version.

**Firefox:**
1. Navigate to `about:debugging` and click 'This Firefox'
2. Click 'Load Temporary Add-on' and click on any file in `build/firefox/` (e.g. `manifest.json`)

To reload the extension, click 'Reload'.

**Chrome:**
1. Navigate to `chrome://extensions` and enable developer mode
2. Click 'Load unpacked' and select the `build/chrome/` folder

To reload the extension, click the circular arrow icon on the extension card.
