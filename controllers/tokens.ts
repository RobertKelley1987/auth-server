import jwt from "jsonwebtoken";
import { generateTokens } from "../lib/jwt";
import { COOKIE_OPTIONS } from "../lib/cookies";
import ExpressError from "../util/express-error";
import type { NextFunction, Request, Response } from "express";
import type { User } from "../types";

export async function createTokens(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const key = process.env.REFRESH_KEY;
    if (!key) throw new ExpressError(500, "Env var not found.");

    const refreshToken = req?.cookies?.jwt;
    if (!refreshToken) throw new ExpressError(401, "No credentials.");

    jwt.verify(refreshToken, key, async (error: any, decoded: any) => {
      if (error) throw new ExpressError(403, "Invalid credentials.");

      const user = <User>decoded;
      const { accessToken, refreshToken } = await generateTokens(user.id);

      res.cookie("jwt", refreshToken, COOKIE_OPTIONS);
      res.status(200).json({ accessToken });
    });
  } catch (error) {
    next(error);
  }
}
