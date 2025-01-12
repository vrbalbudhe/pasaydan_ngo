import { prisma } from "@/prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password }: { email: string; password: string } =
      await req.json();
    console.log(email, password);

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        userType: true,
        password: true,
      },
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

      const secretKey = process.env.JWT_SECRET || "your_jwt_secret";
      const token = jwt.sign(
        {
          email: existingUser.email,
          id: existingUser.id,
          userType: existingUser.userType,
        },
        secretKey,
        {
          expiresIn: "1h",
        }
      );

      const response = NextResponse.json(
        { message: "User login successful", User: existingUser },
        { status: 200 }
      );
      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600,
        path: "/",
      });

      return response;
    }

    const existingOrganization = await prisma.organization.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
      },
    });

    if (!existingOrganization) {
      return NextResponse.json(
        { error: "No user or organization found with this email" },
        { status: 404 }
      );
    }

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

    const secretKey = process.env.JWT_SECRET || "your_jwt_secret";
    const token = jwt.sign(
      {
        email: existingOrganization.email,
        id: existingOrganization.id,
        name: existingOrganization.name,
        userType: "organization",
      },
      secretKey,
      {
        expiresIn: "1h",
      }
    );

    const response = NextResponse.json(
      {
        message: "Organization login successful",
        Organization: existingOrganization,
      },
      { status: 200 }
    );
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "Something went wrong in the POST LOGIN route" },
      { status: 500 }
    );
  }
}
