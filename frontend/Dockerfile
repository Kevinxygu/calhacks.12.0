# Use official Node.js image
FROM node:20-alpine

# Install pnpm globally
# This is like pip for Python or go get for Go
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
# If package.json doesn't change, dependencies won't reinstall
COPY package.json pnpm-lock.yaml ./

# Install dependencies
# --frozen-lockfile ensures exact versions from lockfile
RUN pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Expose port 3000 (Next.js default dev port)
EXPOSE 3000

# Run Next.js in development mode (has built-in hot reload)
# This is like Flask's debug mode - it watches files and reloads automatically
CMD ["pnpm", "dev"]