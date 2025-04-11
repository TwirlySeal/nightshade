import os
import zipfile


def zipdir(dir: str) -> bool:
    try:
        print(f'zipping \'{dir}\'')
        exists = os.path.isdir(dir)

        if not exists:
            print('failed, directory doesn\'t exist')
            return False

        zd = zipfile.ZipFile(f'{dir}.zip', 'w')
        for dirname, sub, files in os.walk(dir):
            for filename in files:
                relpath = dirname
                relpath = relpath.replace(dir, '', -1)
                relpath = f'{relpath}/{filename}'
                zd.write(os.path.join(dirname, filename), relpath)

        zd.close()
    except Exception as e:
        print(f'an exception occured! \'{e}\'')
        return False

    return True


zipdir("./build/chrome")
zipdir("./build/firefox")

