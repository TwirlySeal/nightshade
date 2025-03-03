import kdl
import json
from pprint import pprint

with open('manifest.kdl') as f: s = f.read()
doc = kdl.parsefuncs.parse(s)

manifest = {}

for node in doc.nodes:
    match node.name:
        case 'manifest-version':
            manifest['manifest_version'] = node.args[0]

        case 'icons':
            icons = {}
            for icon in node.nodes:
                icons[icon.name] = icon.args[0]

            manifest['icons'] = icons

        case 'permissions':
            manifest['permissions'] = [perm.name for perm in node.nodes]

        case 'defaults': # action
            # Does not support 'default_icon'
            action = {}

            for default in node.nodes:
                key = ""
                match default.name:
                    case 'popup':
                        key = 'default_popup'
                    case 'tooltip':
                        key = 'default_title'

                action[key] = default.args[0]

            manifest['action'] = action

        case 'injections': # content_scripts
            # Only supports single-value fields
            injections = []
            for match in node.nodes:
                obj = {}

                for field in match.nodes:
                    key = ""
                    match field.name:
                        case 'run-at':
                            obj['run_at'] = field.args[0]
                            continue
                        case 'match':
                            key = 'matches'
                        case 'script':
                            key = 'js'

                    obj[key] = field.args

                injections.append(obj)

            manifest['content_scripts'] = injections

        case 'background-script': # background
            # Does not support type field
            manifest['background'] = {"service_worker": node.args[0]}

        case 'resources': # web_accessible_resources
            # Does not support 'use_dynamic_url'
            # To-do: make files the parent key for matches and extension_ids to allow for both
            resources = []
            for resource in node.nodes:
                obj = {}

                for field in resource.nodes:
                    key = ""
                    match field.name:
                        case 'files':
                            key = 'resources'
                        case 'match':
                            key = 'matches'

                    obj[key] = field.args

                resources.append(obj)

            manifest['web_accessible_resources'] = resources

        case _:
            try:
                manifest[node.name] = node.args[0]
            except:
                pprint(node)

with open("../manifest.json", "w") as f: json.dump(manifest, f, indent=2)
