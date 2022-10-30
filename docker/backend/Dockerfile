
# IndEAA

# ===================================
# ---- Executed at Image Build ----
# ===================================
FROM python:3.9.9-slim-bullseye

WORKDIR /app_code

# Install Dependencies
# `rm -rf /var/lib/apt/lists/*` -> Remove cache to make image smaller
RUN apt-get update && apt-get install --yes --no-install-recommends figlet boxes curl postgresql-client-13 g++ libssl-dev gcc && rm -rf /var/lib/apt/lists/*

# Update pip and install poetry
RUN pip install --upgrade pip && pip install poetry

# Copy application code into a directory called 'app_code'
# This copy includes pyproject.toml and poetry.lock
COPY ./backend /app_code

# Installing requirements using poetry
# `poetry config virtualenvs.create false` -> Use system python and not virtualenvs
# `poetry install --only main` -> Install from lock file with no dev dependencies
RUN poetry config virtualenvs.create false && poetry install --only main

# Copy runtime script & make it executable
COPY /docker/backend/runtime.sh /runtime.sh
RUN chmod +x /runtime.sh

# Generate a timestamp of when this image was created for display in the logs / as the container comes up. Used as a sanity check.
RUN touch /app_code/build_timestamp.txt
RUN date > /app_code/build_timestamp.txt && cat /app_code/build_timestamp.txt

# Add command aliases
RUN echo 'alias run-flake8="flake8 --max-line-length 150 --exclude=*/migrations/* --ignore=F405,F403"' >> ~/.bashrc
RUN echo 'alias run-safety="safety check"' >> ~/.bashrc

RUN figlet IndEAA - DJANGO

# ========================================
# ---- Executed at Container Runtime ----
# ========================================

# CMD commands get executed at container runtime!
CMD ["/runtime.sh"]
