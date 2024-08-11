import bcrypt from "bcrypt";
import {
  createUser,
  findUserByEmail,
  findUserByToken,
  updateUserToken,
} from "../db/users";
import { generateTokens } from "../lib/jwt";
import { COOKIE_OPTIONS } from "../lib/cookies";
import ExpressError from "../util/express-error";
import type { Request, Response } from "express";

export async function registerUser(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) throw new ExpressError(401, "No credentials.");

  const hashed = await bcrypt.hash(password, 12);
  const newUser = await createUser(email, hashed);

  const { accessToken, refreshToken } = await generateTokens(newUser.id);
  res.cookie("jwt", refreshToken, COOKIE_OPTIONS);
  res.status(201).json({ accessToken });
}

export async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) throw new ExpressError(401, "Invalid credentials.");

  const foundUser = await findUserByEmail(email);
  if (!foundUser) throw new ExpressError(403, "Invalid credentials.");

  console.log(foundUser);

  const validated = bcrypt.compare(password, foundUser.password);
  if (!validated) throw new ExpressError(403, "Invalid credentials.");

  const { accessToken, refreshToken } = await generateTokens(foundUser.id);
  res.cookie("jwt", refreshToken, COOKIE_OPTIONS);
  res.status(200).json({ accessToken });
}

export async function logoutUser(req: Request, res: Response) {
  // If zero cookies, do nothing.
  const { cookies } = req;
  if (!cookies) {
    return res.status(200).json({ message: "User is not logged in. " });
  }

  // If user with refresh token exists, clear token in db.
  const refreshToken = cookies.jwt;
  const foundUser = await findUserByToken(refreshToken);
  if (!!foundUser) {
    await updateUserToken(foundUser.id, "");
  }

  // Clear cookie and return success response.
  res.clearCookie("jwt", COOKIE_OPTIONS);
  res.status(200).json({ message: "User successfully logged out." });
}
