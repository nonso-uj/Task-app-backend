import mongoose from "mongoose";
import { setupApp } from "./app.js";

const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DATABASE_URL || process.env.LOCAL_DATABASE_URL;

const app = await setupApp();

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((error) => {
    console.error("DB connection error: ", error);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});
