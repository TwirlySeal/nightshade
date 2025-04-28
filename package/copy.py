import paths
import shutil

# 0: The symlink location path relative to `build/<browser>/`
# 1: The source path relative to project root
# 2: Boolean for if target is a directory
SYMLINKS = {
    ("icons/", "icons/", True),
    ("popup.css", "src/popup/popup.css", False),
    ("popup.html", "src/popup/popup.html", False)
}

for (dst, src, isDir) in SYMLINKS:
    src = paths.ROOT_DIR.joinpath(src)

    def specialise(func):
        func(paths.FIREFOX_DIR.joinpath(dst))
        func(paths.CHROME_DIR.joinpath(dst))

    def copyDir(dst): shutil.copytree(src, dst, dirs_exist_ok=True)
    def copy(dst): shutil.copy2(src,dst)

    if isDir: specialise(copyDir)
    else: specialise(copy)
