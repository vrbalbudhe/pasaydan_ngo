import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const uploadDir = path.join("public", "uploads", "avatars");

export async function POST(request: Request) {
  try {
    // Ensure the upload directory exists
    await mkdir(uploadDir, { recursive: true });

    const formData = await request.formData();

    // Extract organization details from formData
    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();
    const mobile = formData.get("mobile")?.toString();

    const streetAddress = formData.get("streetAddress")?.toString();
    const addressLine2 = formData.get("addressLine2")?.toString();
    const city = formData.get("city")?.toString();
    const state = formData.get("state")?.toString();
    const postalCode = formData.get("postalCode")?.toString();
    const country = formData.get("country")?.toString();

    const avatar = formData.get("avatar");

    const contactPersonName = formData.get("contactPersonName")?.toString();
    const contactPersonEmail = formData.get("contactPersonEmail")?.toString();
    const contactPersonMobile = formData.get("contactPersonMobile")?.toString();

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Handle avatar upload
    let avatarPath: string | undefined;
    if (avatar && avatar instanceof Blob) {
      const avatarBuffer = Buffer.from(await avatar.arrayBuffer());
      const avatarFilePath = path.join(uploadDir, avatar.name);
      await writeFile(avatarFilePath, avatarBuffer);
      avatarPath = `/uploads/avatars/${avatar.name}`;
    }

    // Check if organization exists
    const existingOrg = await prisma.organization.findUnique({
      where: { email },
      include: { contactPerson: true },
    });

    if (!existingOrg) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );
    }

    let addressId = existingOrg.addressId;

    // Update or create address
    if (streetAddress && city && state && postalCode && country) {
      const addressData = {
        streetAddress,
        addressLine2,
        city,
        state,
        postalCode,
        country,
      };

      if (addressId) {
        const updatedAddress = await prisma.address.update({
          where: { id: addressId },
          data: addressData,
        });
        addressId = updatedAddress.id;
      } else {
        const newAddress = await prisma.address.create({
          data: addressData,
        });
        addressId = newAddress.id;
      }
    }

    // Update organization details
    const updatedOrg = await prisma.organization.update({
      where: { email },
      data: {
        name,
        mobile,
        avatar: avatarPath,
        addressId,
      },
    });

    // Update contact person details
    if (contactPersonName && contactPersonEmail) {
      const contactPersonData = {
        name: contactPersonName,
        email: contactPersonEmail,
        mobile: contactPersonMobile,
        organizationId: updatedOrg.id,
      };

      const existingContactPerson = existingOrg.contactPerson.find(
        (person) => person.email === contactPersonEmail
      );

      if (existingContactPerson) {
        await prisma.contactPerson.update({
          where: { id: existingContactPerson.id },
          data: contactPersonData,
        });
      } else {
        await prisma.contactPerson.create({
          data: contactPersonData,
        });
      }
    }

    return NextResponse.json(updatedOrg);
  } catch (error: any) {
    console.error("Error updating organization profile:", error);
    return NextResponse.json(
      { message: "Failed to update profile", error: error.message },
      { status: 500 }
    );
  }
}
