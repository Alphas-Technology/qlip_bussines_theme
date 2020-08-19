
import os


ORIGIN_PATH = os.path.dirname(os.path.abspath(__file__)) + "/copy/"
BACKUP_PATH = os.path.dirname(os.path.abspath(__file__)) + "/backup/"
DEST_PATH = os.path.dirname(os.path.abspath(__file__)) + "/../../../../"
FILES = {
    "gotham_rounded": {
        "type": "dir",
        "origin_path": ORIGIN_PATH + "gotham-rounded",
        "backup_path": BACKUP_PATH + "gotham-rounded",
        "dest_path": DEST_PATH + "sites/assets/frappe/css/fonts/gotham-rounded",
        "backup": True,
    }
}
