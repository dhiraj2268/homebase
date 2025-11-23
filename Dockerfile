
FROM node:18-alpine AS base

WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy all other app files
COPY . .

# Expose the port your app runs on
EXPOSE 3003

# Default command
CMD ["nodemon", "app.js"]
