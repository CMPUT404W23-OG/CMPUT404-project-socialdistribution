FROM python:3.9

# Create app directory
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install app dependencies
RUN pip install -r requirements.txt

# Expose port 8000
EXPOSE 8000

# Run the app when the container launches on IPV6

CMD ["python", "manage.py", "runserver","[::]:8000"]