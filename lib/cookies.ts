import type { CookieOptions } from "express";

export const COOKIE_OPTIONS: CookieOptions = {
  secure: false,
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000,
};
