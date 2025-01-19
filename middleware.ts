import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET || "your_jwt_secret"
);

async function verifyToken(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return null;
  }
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;
  if (!token && pathname !== "/pasaydan/auth/logsign") {
    console.log("No token found, redirecting to login...");
    const redirectUrl = new URL("/pasaydan/auth/logsign", req.nextUrl.origin);
    return NextResponse.redirect(redirectUrl);
  }

  const payload = await verifyToken(req);
  console.log("this is the payload: :", payload);
  if (!payload && pathname !== "/pasaydan/auth/logsign") {
    console.log("Invalid token, redirecting to login...");
    const redirectUrl = new URL("/pasaydan/auth/logsign", req.nextUrl.origin);
    return NextResponse.redirect(redirectUrl);
  }

  const userRole = payload?.role || payload?.userType;
  console.log("user roles : ", userRole);
  if (pathname.startsWith("/pasaydan/com/profile")) {
    if (userRole !== "individual" && userRole !== "organization") {
      console.log(
        "Access denied for non-user/non-org role on /pasaydan/com/profile"
      );
      const redirectUrl = new URL("/pasaydan/auth/logsign", req.nextUrl.origin);
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (pathname.startsWith("/pasaydan/admin")) {
    if (userRole !== "Admin" && userRole !== "MiniAdmin") {
      console.log(
        "Access denied for non-admin/non-subadmin role on /pasaydan/admin"
      );
      return NextResponse.json(
        { error: "Access denied. Insufficient permissions." },
        { status: 403 }
      );
    }
  }

  const response = NextResponse.next();
  response.headers.set("x-user", JSON.stringify(payload)); // Add user payload to headers
  return response;
}

export const config = {
  matcher: [
    "/pasaydan/com/profile",
    "/pasaydan/admin/:path*",
    // "/api/drive/:path*",
  ],
};
