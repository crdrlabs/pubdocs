#!/bin/bash

# This script uses rclone bisync, which is considered in beta, though is
# thought to be stable for gdrive.  However, keep in mind the following
# recommendations of specific relevance to this application:
#
# - Don't test race conditions re files under active modification
# - Don't test race conditions re other hosts uploading simultaneously
# - Empty directories are not replicated
# - We need --track-renames for directory renames, but don't use w/ resync
# - Don't edit Google docs and sheets files locally
#
# BEFORE USING THIS SCRIPT, YOU NEED TO SETUP RCLONE AND BORG CORRECTLY.
#   borg init --encryption=none gdrive_borg_backup
#
# Exit on errors
set -euo pipefail

# Get directory script lives in
script_dir="$(dirname $(readlink -f $0))"

# Set up some other variables and paths
log_file="$script_dir/gdrive_sync_log.log"
borg_dir="$script_dir/gdrive_borg_backup"

# Log all the output
touch "$log_file" || die "Can not touch log file.  What gives?"
exec > >(tee -a "$log_file") 2>&1

# We have to set this so borg knows where to store stuff
export BORG_REPO="$borg_dir"

warn() {
    echo "$1" 2>&1
}

die() {
    warn "ERROR: $1"
    exit 1
}

clonedir() {
    gname="$1"
    lname="$2"
    lfname="$script_dir/$lname"
    [[ ! -w $lfname ]] && {
        [[ -d $lfname ]] && die "$lfname exists but is not writeable"
        warn "You don't have a local copy of $lname.  Initializing."
        mkdir "$lfname"
        rclone bisync --resync "$gname" "$lfname"
    }
    echo "$0 BEGIN SYNC $gname $(date)"
    archive_prefix="{hostname}-$lname"
    borg create \
        --progress \
        --list \
        --filter=ACME \
        --show-rc \
        --compression=auto,zstd,5 \
        --one-file-system \
        "::$archive_prefix-{now}" "$lfname"
    borg prune \
        --glob-archives '$archive_prefix-*' \
        --show-rc \
        --keep-daily=7 \
        --keep-weekly=2 \
        --keep-monthly=12
    rclone bisync "$gname" "$lfname" \
        --track-renames \
        --compare size,modtime \
        --ignore-listing-checksum
    echo "$0 FINISH SYNC $gname $(date)"
}

# Sanity checks
rclone config dump | grep -q gdrive || die "You need to set up rclone first"

if [[ ! -w $borg_dir ]]; then
    borg init --encryption=none || die "Can't borg init $borg_dir"
fi

# AND NOW, FINALLY, INITIATE THE ACTION!

clonedir gdrive:CRDR_preview_pub gpub
echo
echo "✅ GDRIVE SYNC COMPLETED ✅"
