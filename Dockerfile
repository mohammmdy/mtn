# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port your app listens on
EXPOSE 8000

# Run migrations before starting the app
CMD ["sh", "-c", "npm run db:migrate && npm start"]
