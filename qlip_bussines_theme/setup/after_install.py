# Configure theme after install
# Leonardo Alviarez leonardo.alviarez@alphas.technology

import shutil
import os


def after_install():
    copy_files_after_install()


def copy_files_after_install():
    """
    Copy necessary files to frappe sites instance
    """
    origin_path = os.path.dirname(os.path.abspath(__file__)) + "/copy/"
    dest_path = os.path.dirname(os.path.abspath(__file__)) + "/../../../../"
    files_to_copy = {
        "gotham_rounded": {
            "type": "dir",
            "origin_path": origin_path + "gotham-rounded",
            "dest_path": dest_path + "sites/assets/frappe/css/fonts/gotham-rounded"
        }
    }

    for  ftc in files_to_copy.values():
        if ftc["type"] == "dir": 
            shutil.copytree(ftc["origin_path"], ftc["dest_path"])
        elif ftc == "file":
            pass
