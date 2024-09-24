import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3300, () => {
      console.log(
        `Server is listening on http://localhost:${process.env.PORT}`
      );
    });
  })
  .catch((error) => {
    console.log("MONGODB connection FAILED !!! ", error);
  });
