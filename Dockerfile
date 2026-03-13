# Dockerfile for Frontend Component
# Stage 1: Build the React application
FROM node:20-alpine as build

WORKDIR /app

# Copy dependency definitions
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build the project (Vite specific)
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Copy the build output to replace the default nginx contents.
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
