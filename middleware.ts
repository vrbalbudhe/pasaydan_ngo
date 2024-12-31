import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET || "your_jwt_secret"
);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const response = NextResponse.next();

  // if (!token) {
  //   response.headers.set("x-user", JSON.stringify({ guest: true }));
  //   return response;
  // }
  if (!token) {
    console.log("No token found, redirecting to login...");
    const redirectUrl = new URL("/pasaydan/auth/logsign", req.nextUrl.origin);
    return NextResponse.redirect(redirectUrl);
  }

  try {
    // Validate the JWT token
    const { payload } = await jwtVerify(token, secretKey);
    console.log("Decoded JWT payload:", payload);

    // Proceed with the request if token is valid
    response.headers.set("x-user", JSON.stringify(payload));

    return response;
  } catch (error) {
    const response = NextResponse.next();
    console.error("JWT verification failed:", error);
    response.headers.set("x-user", JSON.stringify({ guest: true }));
    return response;
  }
}

// Apply middleware only to specific routes
export const config = {
  matcher: [
    "/pasaydan/:nextData*.json", // JSON API routes (used in data fetching, not UI)
    "/pasaydan/admin", // Admin dashboard (protected)
    "/pasaydan/admin/drives", // Admin drives page (protected)
    "/pasaydan/com/profile", // Profile page (protected)
    // "/pasaydan/com/:path*", // All other pages (protected)
  ],
};
