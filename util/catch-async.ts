import type { NextFunction, Request, RequestHandler, Response } from "express";

const catchAsync = (fn: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((error: any) => next(error));
  };
};

export default catchAsync;
