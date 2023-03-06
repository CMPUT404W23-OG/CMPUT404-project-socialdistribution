FROM node:latest

# Create app directory
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install app dependencies
RUN npm install

# Make port 3000 available to the world outside this container
EXPOSE 80

# Run the app when the container launches
CMD ["npm","run", "dev"]

