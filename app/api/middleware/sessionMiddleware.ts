import session from "express-session";
import { NextRequest, NextResponse } from "next/server";

const sessionMiddleware = session({
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // sameSite: "Strict",
  },
});

export const applySession = (req: NextRequest, res: NextResponse) => {
  return new Promise((resolve, reject) => {
    sessionMiddleware(req as any, res as any, (err: any) => {
      if (err) reject(err);
      resolve(res);
    });
  });
};
