## Required software
- [Deno](https://deno.com/)
- [Deno Language Server](https://docs.deno.com/runtime/getting_started/setup_your_environment/)
- [Python](https://www.python.org/)

## Setup
1. Clone the repository:
```
git clone https://github.com/twirlyseal/nightshade/nightshade.git
```

2. Create a virtual environment and install kdl-py:
```bash
python -m venv env
source env/bin/activate
pip install kdl-py
```

3. Run `package/main.py` to generate the extension manifest

4. Run `deno task firefox` or `deno task chrome` to build the extension for your browser

> Firefox DevTools are better for HTML and CSS, while Chrome DevTools are better for JavaScript and performance+network analysis

## Running the extension
**Firefox:**
1. Navigate to `about:debugging` and click 'This Firefox'
2. Click 'Load Temporary Add-on' and click on any file at the root of the project directory (e.g. `manifest.json`)

**Chrome:**
1. Navigate to `chrome://extensions` and enable developer mode
2. Click 'Load unpacked' and select the project folder
