import { prisma } from "@/prisma/client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const {
    userType,
    email,
    password,
  }: { userType: string; email: string; password: string } = await req.json();

  try {
    console.log("User Type:", userType);
    console.log("Email:", email);
    console.log("Password:", password);

    const existingAccount =
      (await prisma.user.findFirst({ where: { email } })) ||
      (await prisma.organization.findFirst({ where: { email } }));

    if (existingAccount) {
      return NextResponse.json(
        { error: "Account with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (userType === "organization") {
      const newOrg = await prisma.organization.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      if (!newOrg) {
        return NextResponse.json(
          {
            error:
              "Could not create organization account, please try again later",
          },
          { status: 500 }
        );
      }
    }

    if (userType === "individual") {
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      if (!newUser) {
        return NextResponse.json(
          {
            error:
              "Could not create individual account, please try again later",
          },
          { status: 500 }
        );
      }
    }
    return NextResponse.json(
      { message: "Account created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during signup:", error);
    return NextResponse.json(
      { error: "Something went wrong in the signup process" },
      { status: 500 }
    );
  }
}
