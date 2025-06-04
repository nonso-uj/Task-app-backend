import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authAppRouter from "./src/apps/authApp/authApp.js";
import taskAppRouter from "./src/apps/taskApp/taskApp.js";
import cookieParser from "cookie-parser";

dotenv.config();

const API_VERSION = "/api";
const APP_URL = process.env.APP_URL;

const corsOptions = {
  origin: APP_URL,
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ["Content-Type", "Authorization"],
};

export async function setupApp() {
  const app = express();

  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: false }));

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

  app.use(`${API_VERSION}/auth-backend`, authAppRouter);
  app.use(`${API_VERSION}/task-backend`, taskAppRouter);

  app.all("*", (req, res) => {
    res.status(404).json({
      error: `Can't find ${req.originalUrl} on this server`,
    });
  });

  return app;
}
