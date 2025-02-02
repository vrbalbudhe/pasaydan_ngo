import { prisma } from "@/prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("API Hit"); // Check if API is being hit

  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const {
    id,
    name,
    email,
    phone,
    userType,
    amount,
    type,
    date,
    transactionNature,
    status,
  } = req.body;

  console.log("Received Data:", req.body.id);

  if (!id) {
    console.error("Error: Missing transaction ID");
    return res.status(400).json({ message: "Transaction ID is required" });
  }

  try {
    // Ensure ID is correct type
    const transactionId = typeof id === "string" ? parseInt(id, 10) : id;
    console.log("Formatted Transaction ID:", transactionId);

    // Check if the transaction exists
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    console.log("Found Transaction:", transaction);

    if (!transaction) {
      console.error("Error: Transaction not found");
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Ensure date is valid
    const parsedDate = date ? new Date(date) : transaction.date;

    // Update the transaction
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        name,
        email,
        phone,
        userType,
        amount,
        type,
        date: parsedDate,
        transactionNature,
        status,
      },
    });

    console.log("Updated Transaction:", updatedTransaction);

    return res.status(200).json(updatedTransaction);
  } catch (error: any) {
    console.error("Error updating transaction:", error);
    return res
      .status(500)
      .json({ message: "Error updating transaction", error: error?.message });
  }
}
