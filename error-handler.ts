import ExpressError from "./util/express-error";
import type { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.log("ERROR HANDLER:");
  console.log(error);

  if (error instanceof ExpressError) {
    return res.status(error.status).json({ error });
  }

  return res.status(500).json({ error });
};

export default errorHandler;
