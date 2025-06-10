import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authAppRouter from "./src/authApp/authApp.js";
import taskAppRouter from "./src/taskApp/taskApp.js";
import cookieParser from "cookie-parser";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

dotenv.config();

const API_VERSION = "/api";

const corsOptions = {
  origin: [
    "https://nonso-react-auth-app.netlify.app",
    "https://*.netlify.app",
    process.env.APP_URL,
  ].filter(Boolean),
  credentials: true,
  optionsSuccessStatus: 201,
  allowedHeaders: ["Content-Type", "Authorization"],
};

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tasks API",
      version: "1.0.0",
      description: "A simple tasks CRUD app.",
      contact: {
        email: "nonso.udonne@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000/api",
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
  apis: [
    "./src/authApp/routes/*.router.js",
    "./src/taskApp/routes/*.router.js",
  ],
};

export async function setupApp() {
  const app = express();

  const specs = swaggerJSDoc(swaggerOptions);

  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(`${API_VERSION}/docs`, swaggerUI.serve, swaggerUI.setup(specs));

  // Set Referrer-Policy header
  app.use((req, res, next) => {
    res.setHeader("Referrer-Policy", "no-referrer-when-downgrade");
    next();
  });

  app.get(`${API_VERSION}/ping`, (req, res) => {
    res.status(200).json({
      response: "pong",
      server_status: "running",
    });
  });

  app.get(`${API_VERSION}/docs.json`, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(specs);
  });

  app.use(`${API_VERSION}/auth-backend`, authAppRouter);
  app.use(`${API_VERSION}/task-backend`, taskAppRouter);

  app.all("*", (req, res) => {
    res.status(404).json({
      error: `Can't find ${req.originalUrl} on this server`,
    });
  });

  return app;
}
