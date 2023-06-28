# Base image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Install Strapi globally
RUN npm install -g create-strapi-app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --quiet

# Copy the Strapi project files to the container
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the Strapi server port
EXPOSE 1337

# Start the Strapi server
CMD ["npm", "run", "start"]
