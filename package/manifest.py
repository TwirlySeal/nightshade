import json
from kdl.parsefuncs import parse
import copy
import paths

manifest = {}
with open(paths.PACKAGE_DIR.joinpath('manifest.kdl')) as f: doc = parse(f.read())

# Key name constants
ICONS = 'icons'
PERMISSIONS = 'permissions'
BACKGROUND = 'background'

# Key handlers
#
# The label 'IR' (intermediate representation) means the format of the output JSON will be modified
# in writeManifest() depending on the browser to handle differences between Firefox and Chrome

def manifest_version(node): manifest["manifest_version"] = node.args[0]

def icons(node): manifest[ICONS] = {
    icon.name: icon.args[0]
    for icon in node.nodes
}

def permissions(node): manifest[PERMISSIONS] = [ perm.name for perm in node.nodes ]

def defaults(node):
    MAP = {
        "popup": "default_popup",
        "tooltip": "default_title"
    }
    manifest['action'] = {
        MAP[default.name]: default.args[0]
        for default in node.nodes
    }

def injections(node):
    MAP = {
        "match": "matches",
        "script": "js"
    }

    injections = []
    for inj in node.nodes:
        obj = {}
        for field in inj.nodes:
            if field.name == "run-at":
                obj["run_at"] = field.args[0]
            else:
                obj[MAP[field.name]] = field.args
        injections.append(obj)
    manifest['content_scripts'] = injections

def background(node): manifest[BACKGROUND] = node.args[0] # IR

def resources(node):
    MAP = {
        "files": "resources",
        "match": "matches"
    }
    manifest["web_accessible_resources"] = [
        {
            MAP[field.name]: field.args
            for field in res.nodes
        }
        for res in node.nodes
    ]

def pairNode(node): manifest[node.name] = node.args[0]

KEYS = {
    "manifest-version": manifest_version,
    ICONS: icons,
    PERMISSIONS: permissions,
    "defaults": defaults,
    "injections": injections,
    "background-script": background,
    "resources": resources
}

for node in doc.nodes: KEYS.get(node.name, pairNode)(node)

FIREFOX = 'firefox'
CHROME = 'chrome'

hasBackground = BACKGROUND in manifest

def write_manifest(browser):
    clone = copy.deepcopy(manifest)

    if browser == paths.FIREFOX_DIR:
        if hasBackground: clone[BACKGROUND] = {
            "scripts": [clone[BACKGROUND]],
        }
    else: # chrome
        if hasBackground: clone[BACKGROUND] = {
            "service_worker": clone[BACKGROUND]
        }

    path = browser.joinpath("manifest.json")
    with open(path, "w") as f: json.dump(clone, f, indent=2)

write_manifest(paths.FIREFOX_DIR)
write_manifest(paths.CHROME_DIR)
