import json
from kdl.parsefuncs import parse
import pathlib

PACKAGE_DIR = pathlib.Path(__file__).parent
BUILD_DIR = PACKAGE_DIR.parent.joinpath('build')

manifest = {}
with open(PACKAGE_DIR.joinpath('manifest.kdl')) as f: doc = parse(f.read())

for node in doc.nodes:
    # For nodes with one argument
    def pairNode(name: str):
        manifest[name] = node.args[0]

    match node.name:
        case 'manifest-version': pairNode('manifest_version')
        case 'icons': manifest['icons'] = {
            icon.name: icon.args[0]
            for icon in node.nodes
        }

        case 'permissions': manifest['permissions'] = [ perm.name for perm in node.nodes ]
        case 'defaults':
            DEFAULTS_KEYS = {
                "popup": "default_popup",
                "tooltip": "default_title"
            }
            manifest['action'] = {
                DEFAULTS_KEYS[default.name]: default.args[0]
                for default in node.nodes
            }

        case 'injections':
            INJECTIONS_KEYS = {
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
                        obj[INJECTIONS_KEYS[field.name]] = field.args
                injections.append(obj)
            manifest['content_scripts'] = injections

        # Does not support type field
        case 'background-script': manifest['background'] = { "service_worker": node.args[0] }

        case 'resources':
            RESOURCES_KEYS = {
                "files": "resources",
                "match": "matches"
            }
            manifest["web_accessible_resources"] = [
                {
                    RESOURCES_KEYS[field.name]: field.args
                    for field in res.nodes
                }
                for res in node.nodes
            ]

        case _: pairNode(node.name)

manifest_string = json.dumps(manifest, indent=2)

def writeManifest(build: str):
    path = BUILD_DIR.joinpath(build, "manifest.json")
    with open(path, "w") as f: f.write(manifest_string)

writeManifest('firefox')
writeManifest('chrome')
