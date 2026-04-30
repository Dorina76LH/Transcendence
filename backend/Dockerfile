# Use the official Python image as a parent image
FROM python:3.12-slim

# Prevents Python from buffering stdout and stderr, 
# ensuring logs are sent straight to the terminal in real-time.
ENV PYTHONUNBUFFERED 1

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install netcat (needed for the entrypoint to check DB status)
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    netcat-traditional && \
    rm -rf /var/lib/apt/lists/*

# Copy only the requirements first to leverage Docker's cache layers.
# This way, dependencies are only re-installed if requirements.txt changes.
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . .

# Expose the port Django/Daphne will run on
EXPOSE 8000

# Give execution rights to the entrypoint
RUN chmod +x /usr/src/app/entrypoint.sh

# This script will run every time the container starts
ENTRYPOINT ["sh","/usr/src/app/entrypoint.sh"]

# The CMD is now passed as an argument to the entrypoint
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "core.asgi:application"]