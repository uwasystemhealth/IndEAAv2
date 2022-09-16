#!/bin/bash

# Make the folder if it doesn't exist
if [ ! -d "backups" ]; then
    mkdir backups
fi
# This script backups the folder `./data` to `./backups/{date}`
sudo tar czf ./backups/$(date +%Y%m%d-%H%M%S).tar.gz ./data

# This means that when you want to restore data, do the following procedures:
# 0. Shutdown the container
# 1. Take the existing content of the folder `./data` and put it somewhere
# 2. Extract the backup file (for a specific date) to the folder `./data`

# Commmand `tar -xvzf backups/{backup-file-name}` eg. `tar -xvzf backups/20220805-005551.tar.gz`
# Note: If you're getting permission denied, just use this magic command ;) `sudo chmod 777 -R data`. This will allow permission especially for container to serve this

# 3. Start the container again