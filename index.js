import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authAppRouter from "./apps/auth-backend/authApp.js";

dotenv.config();

const API_VERSION = "/api";
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((error) => {
    console.error("DB connection error: ", error);
    process.exit(1);
  });

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

app.all("*", (req, res) => {
  res.status(404).json({
    error: `Can't find ${req.originalUrl} on this server`,
  });
});

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});

export default app;
