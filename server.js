import express from "express";
import dotenv from "dotenv";
import "express-async-errors";
import morgan from "morgan";

import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

// db and authenticateUser
import connectDB from "./db/connect.js";

// routers
import authRouter from "./routes/authRoutes.js";
import userlistsRouter from "./routes/userlistsRouter.js";
import listRouter from "./routes/listRouter.js";

// middleware
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import authenticateUser from "./middleware/auth.js";
import cors from "cors";

const app = express();
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(cors());

// routes

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/userlists", authenticateUser, userlistsRouter);
app.use("/api/v1/useritems", authenticateUser, listRouter);

//! comment out when in development
// only when ready to deploy
app.use(express.static(path.resolve(__dirname, "./client/build")));

//! comment out when in development
// only when ready to deploy
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
