import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const res = NextResponse.json({ message: "Logged out successfully" });
  res.cookies.set("token", "", { expires: new Date(0) });

  return res;
};
