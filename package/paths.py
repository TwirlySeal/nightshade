import pathlib

PACKAGE_DIR = pathlib.Path(__file__).parent
ROOT_DIR = PACKAGE_DIR.parent

BUILD_DIR = ROOT_DIR.joinpath('build')
CHROME_DIR = BUILD_DIR.joinpath("chrome")
FIREFOX_DIR = BUILD_DIR.joinpath("firefox")
