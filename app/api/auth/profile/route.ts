import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const GET = async (req: NextRequest) => {
  const token = req.cookies.get("token")?.value;
  console.log("Token: ", token);

  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const secretKey = process.env.JWT_SECRET || "your_jwt_secret"; 
    const decodedToken = jwt.verify(token, secretKey) as { email: string; id: string }; 
    return NextResponse.json({ user: decodedToken });
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
  }
};
