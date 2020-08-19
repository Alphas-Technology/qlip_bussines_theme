
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
    "qlip-logo.svg": {
        "type": "file",
        "origin_path": ORIGIN_PATH + "qlip-logo.svg",
        "backup_path": BACKUP_PATH + "qlip-logo.svg",
        "dest_path": DEST_SITE_PATH + "sites/assets/frappe/images/qlip-logo.svg",
        "backup": False,
    },
    "qlip-logo-empresa.svg": {
        "type": "file",
        "origin_path": ORIGIN_PATH + "qlip-logo-empresa.svg",
        "backup_path": BACKUP_PATH + "qlip-logo-empresa.svg",
        "dest_path": DEST_SITE_PATH + "sites/assets/frappe/images/qlip-logo-empresa.svg",
        "backup": False,
    },
    "qlip-chat-icon.svg": {
        "type": "file",
        "origin_path": ORIGIN_PATH + "qlip-chat-icon.svg",
        "backup_path": BACKUP_PATH + "qlip-chat-icon.svg",
        "dest_path": DEST_SITE_PATH + "sites/assets/frappe/icons/qlip-chat-icon.svg",
        "backup": False,
    },
    "qlip-configuration-icon.svg": {
        "type": "file",
        "origin_path": ORIGIN_PATH + "qlip-configuration-icon.svg",
        "backup_path": BACKUP_PATH + "qlip-configuration-icon.svg",
        "dest_path": DEST_SITE_PATH + "sites/assets/frappe/icons/qlip-configuration-icon.svg",
        "backup": False,
    },
    "qlip-exclamation-icon.svg": {
        "type": "file",
        "origin_path": ORIGIN_PATH + "qlip-exclamation-icon.svg",
        "backup_path": BACKUP_PATH + "qlip-exclamation-icon.svg",
        "dest_path": DEST_SITE_PATH + "sites/assets/frappe/icons/qlip-exclamation-icon.svg",
        "backup": False,
    },
    "qlip-notification-icon.svg": {
        "type": "file",
        "origin_path": ORIGIN_PATH + "qlip-notification-icon.svg",
        "backup_path": BACKUP_PATH + "qlip-notification-icon.svg",
        "dest_path": DEST_SITE_PATH + "sites/assets/frappe/icons/qlip-notification-icon.svg",
        "backup": False,
    },
    "qlip-ok-icon.svg": {
        "type": "file",
        "origin_path": ORIGIN_PATH + "qlip-ok-icon.svg",
        "backup_path": BACKUP_PATH + "qlip-ok-icon.svg",
        "dest_path": DEST_SITE_PATH + "sites/assets/frappe/icons/qlip-ok-icon.svg",
        "backup": False,
    },
    "qlip-popup-icon.svg": {
        "type": "file",
        "origin_path": ORIGIN_PATH + "qlip-popup-icon.svg",
        "backup_path": BACKUP_PATH + "qlip-popup-icon.svg",
        "dest_path": DEST_SITE_PATH + "sites/assets/frappe/icons/qlip-popup-icon.svg",
        "backup": False,
    },
    "qlip-x-icon.svg": {
        "type": "file",
        "origin_path": ORIGIN_PATH + "qlip-x-icon.svg",
        "backup_path": BACKUP_PATH + "qlip-x-icon.svg",
        "dest_path": DEST_SITE_PATH + "sites/assets/frappe/icons/qlip-x-icon.svg",
        "backup": False,
    },
    "chat.js": {
        "type": "file",
        "origin_path": ORIGIN_PATH + "chat.js",
        "backup_path": BACKUP_PATH + "chat.js",
        "dest_path": DEST_SITE_PATH + "sites/assets/frappe/js/frappe/chat.js",
        "backup": True,
    },
    "common.js": {
        "type": "file",
        "origin_path": ORIGIN_PATH + "common.js",
        "backup_path": BACKUP_PATH + "common.js",
        "dest_path": DEST_SITE_PATH + "sites/assets/frappe/js/frappe/utils/common.js",
        "backup": True,
    },
    "navbar.html": {
        "type": "file",
        "origin_path": ORIGIN_PATH + "navbar.html",
        "backup_path": BACKUP_PATH + "navbar.html",
        "dest_path": DEST_SITE_PATH + "sites/assets/frappe/js/frappe/ui/toolbar/navbar.html",
        "backup": True,
    },
    "list_view.js": {
        "type": "file",
        "origin_path": ORIGIN_PATH + "list_view.js",
        "backup_path": BACKUP_PATH + "list_view.js",
        "dest_path": DEST_SITE_PATH + "sites/assets/frappe/js/frappe/list/list_view.js",
        "backup": True,
    },
    "form_sidebar.html": {
        "type": "file",
        "origin_path": ORIGIN_PATH + "form_sidebar.html",
        "backup_path": BACKUP_PATH + "form_sidebar.html",
        "dest_path": DEST_SITE_PATH + "sites/assets/frappe/js/frappe/form/templates/form_sidebar.html",
        "backup": True,
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
