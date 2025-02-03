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

    // Extract all contact person details based on indexed keys
    const contactPersons: Array<{ name: string; email: string; mobile: string }> = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("contactPersonName_")) {
        // Get the index from the key (e.g., "contactPersonName_0" yields index "0")
        const index = key.split("_")[1];
        const cpName = value.toString();
        const cpEmail = formData.get(`contactPersonEmail_${index}`)?.toString();
        const cpMobile = formData.get(`contactPersonMobile_${index}`)?.toString() || "";
        // Only push if both name and email are provided
        if (cpName && cpEmail) {
          contactPersons.push({
            name: cpName,
            email: cpEmail,
            mobile: cpMobile,
          });
        }
      }
    }

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

    // Update or create contact person details
    for (const cp of contactPersons) {
      const existingCP = existingOrg.contactPerson.find(
        (person) => person.email === cp.email
      );
      if (existingCP) {
        await prisma.contactPerson.update({
          where: { id: existingCP.id },
          data: {
            name: cp.name,
            email: cp.email,
            mobile: cp.mobile,
            organizationId: updatedOrg.id,
          },
        });
      } else {
        await prisma.contactPerson.create({
          data: {
            name: cp.name,
            email: cp.email,
            mobile: cp.mobile,
            organizationId: updatedOrg.id,
          },
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
