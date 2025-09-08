import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerJSDoc from "swagger-jsdoc";
import { serve, setup } from "swagger-ui-express";
import helmet from "helmet";
import morgan from "morgan";
import connectToDataBase from "./config/db.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import user from "./routes/user.routes.js";
import taskRoutes from "./routes/task.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();
const port = process.env.PORT || 4000;

connectToDataBase();

const app = express();
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || true, credentials: true }));
app.use(cookieParser());

const swaggerOption = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Manager project",
      version: "1.0.0",
      description: "API documentation using Swagger Task Manager in Node.js",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"],
};


const specs = swaggerJSDoc(swaggerOption);

app.use("/api", [user, taskRoutes]);
app.use("/api-docs", serve, setup(specs));

app.use(notFound);
app.use(errorHandler);

app.listen(port, () =>
  console.log(`🚀 Server running on http://localhost:${port}`)
);
