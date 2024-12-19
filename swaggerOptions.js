import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { version } = require("./package.json");
import dotenv from "dotenv";
dotenv.config({ path: "config.env" });

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "MTN API Documentation",
    version,
    // description: "API documentation for the MTN project",
    description:  `
    ## How to Set Up and Run the Application

    Follow these steps to install and run the application locally:

    ### 1. Installation
    - Clone the repository:
      \`\`\`bash
      git clone https://github.com/your-repo-name.git
      \`\`\`
    - Navigate to the project folder:
      \`\`\`bash
      cd your-project-folder
      \`\`\`
    - Install dependencies:
      \`\`\`bash
      npm install
      \`\`\`

    ### 2. Environment Variables
    - Create a \`.env\` file in the root directory.
    - Add the following variables:
      \`\`\`
      PORT=8000
      MONGO_URI=your_mongodb_connection_string
      JWT_SECRET=your_jwt_secret
      \`\`\`

    ### 3. Start the Server
    - Run the server in development mode:
      \`\`\`bash
      npm run dev
      \`\`\`
    - The API will be available at:
      \`\`\`
      http://localhost:8000
      \`\`\`

    ### 4. Authentication
    - Use the \`/api/login\` endpoint to get a JWT token.
    - Add the token in Swagger UI using the **Authorize** button (top-right corner) with the Bearer scheme.

    ---

    This API allows you to manage orders with endpoints for creating, viewing, updating, and deleting orders.
    `,
  },
  servers: [
    {
      url: process.env.BASE_URL,
      description: "Development Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT", // Optional
      },
    },
  },
};

export const swaggerOptions = {
  swaggerDefinition,
  apis: ["./Routes/*.js"],
};
