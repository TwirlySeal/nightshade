import sys
import kdl
import json
from pprint import pprint

TARGET_FIREFOX = 'firefox'
TARGET_CHROME = 'chrome'

BUILD_DIR = '$BUILD_DIR'
SHARED_DIR = '$SHARED_DIR'

def match_replace_define(source: str, define: str, value: str) -> str:
    if source.find(define) != -1:
        return str.replace(source, define, value)

    return source

def inject_define(source: str, define: str, target: str) -> str:
    content = match_replace_define(source, define, target)
    if source == content:
        return content

    if define == BUILD_DIR:
        return f'build/{content}'

    if define == SHARED_DIR: # change the location strings per target if needed
        if target == TARGET_FIREFOX:
            return  f'shared/{content}'
        if target == TARGET_CHROME:
            return  f'shared/{content}'

    return content

def build_manifest(target: str):
    with open('manifest.kdl') as f: s = f.read()
    doc = kdl.parsefuncs.parse(s)

    print(f'generating manifect for {target}...')

    manifest = {}
    # start parsing the kdl file
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

            case 'resources': # web_accessible_resources
                # Does not support 'use_dynamic_url'
                # To-do: make files the parent key for matches and extension_ids to allow for bothp
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
                        
                        updatedargs = []
                        for arg in field.args:
                            resourceContent = inject_define(arg, SHARED_DIR, target)
                            updatedargs.append(resourceContent)

                        obj[key] = updatedargs

                    resources.append(obj)

                manifest['web_accessible_resources'] = resources

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

                        # match args against defs and update the values
                        updatedargs = []
                        for arg in field.args:
                            injectionContent = inject_define(arg, BUILD_DIR, target)
                            updatedargs.append(injectionContent)

                        obj[key] = updatedargs

                    injections.append(obj)

                manifest['content_scripts'] = injections

            case 'background-script': # background
                # Does not support type field
                manifest['background'] = {"service_worker": node.args[0]}

            case _:
                try:
                    manifest[node.name] = node.args[0]
                except:
                    pprint(node)

    try:
        with open("../manifest.json", "w") as f: json.dump(manifest, f, indent=2)
        print(f'manifest generated for {target}!')
    except Exception as e:
        print('failed to generate manifest: ', e)

def run(args: list[str]):
    if len(args) != 2: # only supporting firefox and chrome
        print(f'expected 2 arguments, recieved {len(args)}')
        return

    TARGET = args[1]
    if TARGET == TARGET_CHROME:
        build_manifest(TARGET_CHROME)
    elif TARGET == TARGET_FIREFOX:
        build_manifest(TARGET_FIREFOX)
    else:
        print('could not build manifest for specified target...')


if __name__ == '__main__':
    run(sys.argv)