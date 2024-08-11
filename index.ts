import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import indexRoutes from "./routes";
import tokenRoutes from "./routes/tokens";
import errorHandler from "./error-handler";

// General config.
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

// Config routes.
app.use("/", indexRoutes);
app.use("/tokens", tokenRoutes);

// Add errors handler.
app.use(errorHandler);

// Start app.
const port = process.env.PORT;
if (!port) throw new Error("Env vars not configured.");
app.listen(port, () => console.log(`Listening on port ${port}`));
