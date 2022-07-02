#!/bin/bash

echo "████ ${APP_NAME^^} - DJANGO CONTAINER STARTING... ████████████████████████████ v${APP_VER^^} (${GIT_COMMIT}) ████████"
figlet $APP_NAME

# Display Docker Image / CI / Release details
printf "\n" && echo "Image Build Date/Time: $(cat /app_code/build_timestamp.txt) UTC"| boxes -d shell -p a1l2

if [ "${APP_ENV^^}" != "LOCAL" ]; then
    printf "\n" && echo "BUILD DETAILS" | boxes -d shell -p a1l2
    echo "Git Commit -" "$(cat gitshorthash)"
    echo "Build Pipeline #" "$(cat cibuildnumber)"
    echo "Build Date/Time -" "$(cat cibuilddatetime)" "UTC"
    printf "\n" && echo "RELEASE DETAILS" | boxes -d shell -p a1l2
    echo "App Deploy Env -" $APP_ENV
    echo "App Deploy Type -" $APP_DEPLOY_TYPE
    echo "Release Version -" $APP_VER
    echo "Release Pipeline #" $CI_DEPLOY_NUMBER
    echo "Release Date/Time -" $CI_DEPLOY_DATETIME "UTC"
fi

printf "\n" && figlet $APP_ENV && printf "\n"
printf "\n" && figlet $APP_DEPLOY_TYPE && printf "\n"

# =========================
# Debug / Sanity check info
# =========================
printf "\n" && echo "Current Dir / Files (Debug)" | boxes -d shell -p a1l2
pwd
ls -al

if [ "${APP_ENV^^}" != "PROD" ]; then
    printf "\n" && echo "Env Vars (Debug)" | boxes -d shell -p a1l2
    # Only print environment vars in non-prod environments to prevent sensitive variables being sent to logging system
    printenv
fi

printf "\n" && echo "Pip Freeze (Debug) " | boxes -d shell -p a1l2
pip freeze

printf "\n" && echo "Linux version (Debug)" | boxes -d shell -p a1l2
cat /etc/os-release

printf "\n" && echo "Python Path & Version (Debug)" | boxes -d shell -p a1l2
which python
python -V

# Check for required env vars, exit as failure if missing these critical env vars.
if [[ -z "${APP_ENV}" ]] || [[ -z "${APP_DEPLOY_TYPE}" ]]; then
    echo "█████████████████████████████████████████████████████████████████████████████████████"
    echo "█ CRITICAL ERROR: Missing 'APP_ENV' and/or 'APP_DEPLOY_TYPE', environment variables.█"
    echo "█████████████████████████████████████████████████████████████████████████████████████"
    echo "APP_ENV=" $APP_ENV
    echo "APP_DEPLOY_TYPE=" $APP_DEPLOY_TYPE
    exit
fi

# ==============
# Run Unit Tests
# ==============
if [ "${APP_DEPLOY_TYPE^^}" = "UNIT_TESTS" ]; then

    # Install extra non-prod packages
    printf "\n" && echo "Installing dev dependencies for $APP_DEPLOY_TYPE" | boxes -d shell -p a1l2
    poetry install

    # Collect static bacause some test are checking for static files
    python manage.py collectstatic --noinput

    # Execute tests
    printf "\n" && echo "Running django Unit tests" | boxes -d shell -p a1l2
    coverage run --source='.' --rcfile=.coveragerc -m pytest

    coverage report  # Show coverage results in log output
    coverage html -d /app_code/coverage_html_report  # Gen a html report

    printf "\n" && echo "UNIT TESTS COMPLETED" | boxes -d shell -p a1l2
    exit
fi

# ==================================================
# Wait until Database is available before continuing
# ==================================================
export DATABASE_URL=postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_URL:$POSTGRES_PORT/$POSTGRES_DB

printf "\n" && echo "Checking Database is UP" | boxes -d shell -p a1l2
until psql $DATABASE_URL -c '\l'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - continuing" && figlet "Postgres is up"

# ====================================================================================
# Only run on once in prod environments, not for every container startup
# ====================================================================================
if [ "${APP_DEPLOY_TYPE^^}" = "MIGRATE_AND_SETUP" ] || [ "${APP_DEPLOY_TYPE^^}" = "ALL" ] || [ "${APP_DEPLOY_TYPE^^}" = "E2E" ]; then

    # Migrate database
    printf "\n" && echo "Running django database migrations" | boxes -d shell -p a1l2
    python manage.py migrate --noinput

    printf "\n" && echo "Running django collectstatic" | boxes -d shell -p a1l2

    echo "This will collect all static and copy them to the folder configured in base.py"
    python manage.py collectstatic --noinput

    printf "\n" && echo "Creating Django Superuser" | boxes -d shell -p a1l2
    python manage.py make_superuser $SUPERUSER_USERNAME $SUPERUSER_EMAIL $SUPERUSER_PASSWORD

    # Configure indeaa
    printf "\n" && echo "Configuring IndEAA with standard config" | boxes -d shell -p a1l2
    python manage.py configure_indeaa

    printf "\n" && echo "MIGRATION & SETUP TASK COMPLETED" | boxes -d shell -p a1l2
fi

if [ "${APP_DEPLOY_TYPE^^}" = "E2E" ]; then

    # Run development server
    printf "\n" && echo "Starting inbuilt django webserver" | boxes -d shell -p a1l2
    echo "Running: python manage.py runserver 0.0.0.0:8000"
    python manage.py runserver 0.0.0.0:8000
    exit

fi

# =========================================
# Run inbuilt Django server if ENV is LOCAL
# =========================================
if [ "${APP_ENV^^}" = "LOCAL" ]; then

    # Install extra non-prod packages
    printf "\n" && echo "Installing dev dependencies for $APP_ENV" | boxes -d shell -p a1l2
    poetry install

    # Run development server
    printf "\n" && echo "Starting inbuilt django webserver" | boxes -d shell -p a1l2
    echo "Running: python manage.py runserver 0.0.0.0:8000"
    python manage.py runserver 0.0.0.0:8000
    exit

fi

# ===================
# Run Django/Gunicorn for prod-like environments
# ===================
if [ "${APP_DEPLOY_TYPE^^}" = "WEBWORKER" ]; then

    # Run Gunicorn / Django
    printf "\n" && echo "Running Gunicorn / Django " | boxes -d shell -p a1l2
    echo "Running: gunicorn api.wsgi -b 0.0.0.0:8000 --workers=6 --keep-alive 20 --log-file=- --log-level debug --access-logfile=/var/log/accesslogs/gunicorn --capture-output --timeout 300"
    gunicorn config.wsgi -b 0.0.0.0:8000 --workers=6 --keep-alive 20 --log-file=- --log-level debug --access-logfile=/var/log/accesslogs/gunicorn --capture-output --timeout 90

fi
