# Based from https://github.com/vercel/next.js/blob/canary/examples/with-docker-compose/next-app/prod-without-multistage.Dockerfile
FROM node:16-bullseye-slim

# SET WORKING DIRECTORY
WORKDIR /app_code

# Install Dependencies
# `rm -rf /var/lib/apt/lists/*` -> Remove cache to make image smaller
RUN apt-get update && apt-get install --yes --no-install-recommends figlet boxes && rm -rf /var/lib/apt/lists/*

# Generate a timestamp of when this image was created for display in the logs / as the container comes up. Used as a sanity check.
RUN touch /app_code/build_timestamp.txt
RUN date > /app_code/build_timestamp.txt && cat /app_code/build_timestamp.txt

# Copy runtime script & make it executable
COPY /docker/frontend/runtime.sh /runtime.sh
RUN chmod +x /runtime.sh

# Copy Application code into a directory called `app_code`
COPY ./frontend /app_code
COPY /.env /app_code/.env

# Install ALL Dependencies from the lock file
RUN yarn install --frozen-lockfile

# Build the application
# Note: This will replace the environment variables with "build-time" variables
RUN yarn build

# ========================================
# ---- Executed at Container Runtime ----
# ========================================

# CMD commands get executed at container runtime!
CMD ["/runtime.sh"]
