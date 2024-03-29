#!/bin/bash

echo "████ ${APP_NAME^^} - NEXTJS CONTAINER STARTING... ████████████████████████████ ████████"
figlet $APP_NAME

# Display Docker Image / CI / Release details
echo "Image Build Date/Time: " "$(cat /app_code/build_timestamp.txt)" "UTC"

echo "-----------------------------------------------------------"
echo "APP_ENV:"
figlet $APP_ENV
echo "===================================="

# ====================================================================================
# Debug / Sanity check info
# ====================================================================================
echo "  "
echo "======= Current Dir / Files (Debug) ============================================================================="
pwd
ls -al

echo "  "
echo "======= Env Vars (Debug) ========================================================================================"
if [ "${APP_ENV^^}" != "PRODUCTION" ]; then
  # Only print environment vars in non-prod environments to prevent sensitive variables being sent to logging system
  printenv
fi

echo "  "
echo "======= Linux version (Debug) ==================================================================================="
cat /etc/os-release

echo "  "
echo "======= Node Path & Version (Debug) ==========================================================================="
node -v

# Check for required env vars, exit as failure if missing these critical env vars.
if [[ -z "${APP_ENV}" ]]; then
    echo "█████████████████████████████████████████████████████████████████████████████████████████████████████████████"
    echo "█ CRITICAL ERROR: Missing 'APP_ENV' and/or 'APP_DEPLOY_TYPE', environment variables."
    echo "█████████████████████████████████████████████████████████████████████████████████████████████████████████████"
    echo "APP_ENV=" $APP_ENV
    echo "░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░"
    exit
fi

# ====================================================================================
# Install extra dependencies if ENV is LOCAL
# ====================================================================================
if [ "${APP_ENV^^}" = "LOCAL" ]; then

    # Install some extras
    echo "  "
    echo "======= Installing extra libraries just for LOCAL env ======================================================="
    yarn install --production=false
fi

# ====================================================================================
# Run inbuilt NextJS server if ENV is LOCAL and (E2E - temporarily)
# ====================================================================================
if [ "${APP_ENV^^}" = "LOCAL" ] || [ "${APP_ENV^^}" = "E2E" ]; then
    # Using standard NODE_ENV value
    export NODE_ENV=development
    # Run Development server
    echo "  "
    echo "======= Starting inbuilt nextJS webserver ==================================================================="
    yarn dev
    exit
fi

echo "Running Production mode of application"
yarn start