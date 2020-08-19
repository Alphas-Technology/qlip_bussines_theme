# Configure theme after install
# Leonardo Alviarez leonardo.alviarez@alphas.technology

import shutil
import os

from .commons import *

def after_install():
    
    # Backup the files / dirs before add ther new files / dirs 
    backup_files_after_install()
    copy_files_after_install()


def copy_files_after_install():
    """
    Copy necessary files to frappe sites instance
    """
    
    for ftc in FILES.values():
        if ftc["type"] == "dir":
            shutil.rmtree(ftc["dest_path"])
            shutil.copytree(ftc["origin_path"], ftc["dest_path"])
        elif ftc["type"] == "file":
            shutil.copyfile(ftc["origin_path"], ftc["dest_path"])


def backup_files_after_install():
    """
    Backup the files / dirs
    """

    for ftc in FILES.values():
        if ftc["type"] == "dir":
            try:
                if ftc["backup"]:
                    shutil.copytree(ftc["dest_path"], ftc["backup_path"])
            except FileExistsError:
                pass
        elif ftc["type"] == "file":
            shutil.copyfile(ftc["dest_path"], ftc["backup_path"])