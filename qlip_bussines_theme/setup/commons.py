
import os


ORIGIN_PATH = os.path.dirname(os.path.abspath(__file__)) + "/copy/"
BACKUP_PATH = os.path.dirname(os.path.abspath(__file__)) + "/backup/"
DEST_SITE_PATH = os.path.dirname(os.path.abspath(__file__)) + "/../../../../"
DEST_APPS_PATH = os.path.dirname(os.path.abspath(__file__)) + "/../../../"
FILES = {
    "gotham_rounded": {
        "type": "dir",
        "origin_path": ORIGIN_PATH + "gotham-rounded",
        "backup_path": BACKUP_PATH + "gotham-rounded",
        "dest_path": DEST_SITE_PATH + "sites/assets/frappe/css/fonts/gotham-rounded",
        "backup": False,
    },
    "tags.js": {
        "type": "file",
        "origin_path": ORIGIN_PATH + "tags.js",
        "backup_path": BACKUP_PATH + "tags.js",
        "dest_path": DEST_APPS_PATH + "frappe/frappe/public/js/frappe/ui/tags.js",
        "backup": True,
    },
    "tree.js": {
        "type": "file",
        "origin_path": ORIGIN_PATH + "tree.js",
        "backup_path": BACKUP_PATH + "tree.js",
        "dest_path": DEST_APPS_PATH + "frappe/frappe/public/js/frappe/ui/tree.js",
        "backup": True,
    },
    "user_profile.js": {
        "type": "file",
        "origin_path": ORIGIN_PATH + "user_profile.js",
        "backup_path": BACKUP_PATH + "user_profile.js",
        "dest_path": DEST_APPS_PATH + "frappe/frappe/desk/page/user_profile/user_profile.js",
        "backup": True,
    },
    "user_profile_sidebar.html": {
        "type": "file",
        "origin_path": ORIGIN_PATH + "user_profile_sidebar.html",
        "backup_path": BACKUP_PATH + "user_profile_sidebar.html",
        "dest_path": DEST_APPS_PATH + "frappe/frappe/desk/page/user_profile/user_profile_sidebar.html",
        "backup": True,
    }
}
