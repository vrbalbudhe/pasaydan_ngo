import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET || "your_jwt_secret"
);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    console.log("No token found, redirecting to login...");
    const redirectUrl = new URL("/pasaydan/auth/logsign", req.nextUrl.origin);
    return NextResponse.redirect(redirectUrl);
  }

  try {
    const { payload } = await jwtVerify(token, secretKey);
    console.log("Decoded JWT payload:", payload);

    (req as any).user = payload;

    return NextResponse.next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return NextResponse.redirect(
      new URL("/pasaydan/auth/logsign", req.nextUrl.origin)
    );
  }
}

export const config = {
  matcher: [
    "/pasaydan/:nextData*.json",
    "/pasaydan/admin",
    "/pasaydan/admin/drives",
  ],
};
