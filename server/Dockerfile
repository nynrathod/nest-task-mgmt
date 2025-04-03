# Use Node.js image as a base
FROM node:18 AS build

# Set the working directory for the backend
WORKDIR /app


# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies using yarn
RUN yarn install

# Copy the entire backend project
COPY . .

# Build the NestJS project
RUN yarn build

# Set the command to run the backend in production mode
CMD ["npm", "run", "start:prod"]

# Expose the port (default for NestJS is 3000)
EXPOSE 3000
