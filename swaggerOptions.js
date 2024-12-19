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
    // description: "API documentation for the MTN project ",
    description: `


  ### INITIAL ADMIN ACCOUNT AND HIS PASSWORD TO LOGIN 🤗
      -email          :  admin@example.com
      -password       :  admin123
   

   ### INITIAL CUSTOMER ACCOUNT AND HIS PASSWORD TO LOGIN 🤗
      -email          :  customer@example.com
      -password       :  customer123


   ### !!! LOGIN RESPONSE GET THE ACCESS TOKEN AND REFRESH TOKEN 
      -access token  use to auth with it
      -refresh token use in the body of api REFRESH ACCESS TOKEN to get the new access token to auth with it
 
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
