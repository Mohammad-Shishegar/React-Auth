import { Router } from "express";

import { users } from "../data/users.js";
import { sessions } from "../data/sessions.js";
import { generateToken } from "../utils/token.js";

const router = Router();

const ACCESS_TOKEN_EXPIRES_IN = 1000 * 60 * 15;
const REFRESH_TOKEN_EXPIRES_IN = 1000 * 60 * 60 * 24 * 30;

const getUserResponse = (user: (typeof users)[number]) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  permissions: user.permissions,
});

// ==========================================
// LOGIN
// ==========================================

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    (user) => user.email === email && user.password === password,
  );

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const accessToken = generateToken();
  const refreshToken = generateToken();

  const session = {
    id: generateToken(),
    userId: user.id,

    accessToken,
    refreshToken,

    accessTokenExpiresAt: Date.now() + ACCESS_TOKEN_EXPIRES_IN,

    refreshTokenExpiresAt: Date.now() + REFRESH_TOKEN_EXPIRES_IN,

    revoked: false,
  };

  sessions.push(session);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth",
    maxAge: REFRESH_TOKEN_EXPIRES_IN,
  });

  return res.json({
    user: getUserResponse(user),
    accessToken,
  });
});

// ==========================================
// REFRESH
// ==========================================

router.post("/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh token not found",
    });
  }

  const session = sessions.find(
    (session) =>
      session.refreshToken === refreshToken &&
      !session.revoked &&
      session.refreshTokenExpiresAt > Date.now(),
  );

  if (!session) {
    return res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }

  const user = users.find((user) => user.id === session.userId);

  if (!user) {
    return res.status(401).json({
      message: "User not found",
    });
  }

  // Refresh Token Rotation
  session.revoked = true;

  const newAccessToken = generateToken();
  const newRefreshToken = generateToken();

  const newSession = {
    id: generateToken(),
    userId: user.id,

    accessToken: newAccessToken,
    refreshToken: newRefreshToken,

    accessTokenExpiresAt: Date.now() + ACCESS_TOKEN_EXPIRES_IN,

    refreshTokenExpiresAt: Date.now() + REFRESH_TOKEN_EXPIRES_IN,

    revoked: false,
  };

  sessions.push(newSession);

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth",
    maxAge: REFRESH_TOKEN_EXPIRES_IN,
  });

  return res.json({
    accessToken: newAccessToken,
  });
});

// ==========================================
// ME
// ==========================================

router.get("/me", (req, res) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const [type, accessToken] = authorization.split(" ");

  if (type !== "Bearer" || !accessToken) {
    return res.status(401).json({
      message: "Invalid authorization header",
    });
  }

  const session = sessions.find(
    (session) =>
      session.accessToken === accessToken &&
      !session.revoked &&
      session.accessTokenExpiresAt > Date.now(),
  );

  if (!session) {
    return res.status(401).json({
      message: "Access token expired or invalid",
    });
  }

  const user = users.find((user) => user.id === session.userId);

  if (!user) {
    return res.status(401).json({
      message: "User not found",
    });
  }

  return res.json({
    user: getUserResponse(user),
  });
});

// ==========================================
// LOGOUT
// ==========================================

router.post("/logout", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    const session = sessions.find(
      (session) => session.refreshToken === refreshToken,
    );

    if (session) {
      session.revoked = true;
    }
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth",
  });

  return res.status(204).send();
});

export default router;
