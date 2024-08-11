import jwt from "jsonwebtoken";
import ExpressError from "../util/express-error";
import { updateUserToken } from "../db/users";
import { getParameter } from "../parameter-store";

async function getKey(name: string) {
  let key;

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    key = process.env.ACCESS_KEY;
  } else {
    const { Parameter } = await getParameter(name);
    key = Parameter?.Value;
  }

  return key;
}

export async function createAccessToken(userId: string) {
  const key = await getKey("JWT_ACCESS_KEY");
  if (!key) throw new ExpressError(500, "Env var not found.");

  const data = { id: userId };
  return jwt.sign(data, key, { expiresIn: "10m" });
}

export async function createRefreshToken(userId: string) {
  const key = await getKey("JWT_REFRESH_KEY");
  if (!key) throw new ExpressError(500, "Env var not found.");

  const data = { id: userId };
  return jwt.sign(data, key, { expiresIn: "24h" });
}

export async function generateTokens(userId: string) {
  const accessToken = await createAccessToken(userId);
  const refreshToken = await createRefreshToken(userId);
  await updateUserToken(userId, refreshToken);

  return { accessToken, refreshToken };
}
