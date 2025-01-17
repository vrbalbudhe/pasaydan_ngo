import { prisma } from "@/prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password }: { email: string; password: string } =
    await req.json();
  try {
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Helper function for token generation and response
    const createResponse = (
      userData: object,
      userType: string,
      role?: string
    ) => {
      const secretKey = process.env.JWT_SECRET || "your_jwt_secret";
      const token = jwt.sign(userData, secretKey, { expiresIn: "1h" });

      const response = NextResponse.json(
        { message: `${userType} login successful`, data: userData },
        { status: 200 }
      );
      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600,
        path: "/",
      });

      return response;
    };

    // Check for User
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, userType: true, password: true },
    });

    if (existingUser) {
      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Invalid credentials. Please try again." },
          { status: 401 }
        );
      }

      return createResponse(
        {
          email: existingUser.email,
          id: existingUser.id,
          userType: existingUser.userType,
        },
        "User"
      );
    }

    // Check for Organization
    const existingOrganization = await prisma.organization.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, password: true },
    });

    if (existingOrganization) {
      const isPasswordValid = await bcrypt.compare(
        password,
        existingOrganization.password
      );
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Invalid credentials. Please try again." },
          { status: 401 }
        );
      }

      return createResponse(
        {
          email: existingOrganization.email,
          id: existingOrganization.id,
          name: existingOrganization.name,
          userType: "organization",
        },
        "Organization"
      );
    }

    // Check for Admin
    const existingAdmins = await prisma.admin.findUnique({
      where: { email },
      select: { id: true, email: true, password: true, userType: true },
    });

    if (existingAdmins) {
      const isPasswordValid = await bcrypt.compare(
        password,
        existingAdmins.password
      );
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Invalid credentials. Please try again." },
          { status: 401 }
        );
      }

      return createResponse(
        {
          email: existingAdmins.email,
          id: existingAdmins.id,
          role: existingAdmins.userType,
        },
        "Admin"
      );
    }

    // Check for SubAdmin
    const existingSubAdmins = await prisma.subAdmins.findUnique({
      where: { email },
      select: { id: true, email: true, password: true, userType: true },
    });

    if (existingSubAdmins) {
      const isPasswordValid = await bcrypt.compare(
        password,
        existingSubAdmins.password
      );
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Invalid credentials. Please try again." },
          { status: 401 }
        );
      }

      return createResponse(
        {
          email: existingSubAdmins.email,
          id: existingSubAdmins.id,
          role: existingSubAdmins.userType,
        },
        "MiniAdmin"
      );
    }

    return NextResponse.json(
      { error: "No user, organization, or admin found with this email" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "Something went wrong in the POST LOGIN route" },
      { status: 500 }
    );
  }
}
