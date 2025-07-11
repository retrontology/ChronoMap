# Use a Python image
FROM python:3.13-slim

# Set workdir
WORKDIR /app

# Install package
COPY . .
RUN pip install .

# Expose port (Flask will run on 5000 by default)
EXPOSE 5000

# Start Flask
CMD ["gunicorn", "-b", "unix:/mnt/socket/gunicorn.sock", "wsgi:app"]
