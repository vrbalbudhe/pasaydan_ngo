import { prisma } from "@/prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const {
      transactionId,
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

    try {
      // Check if the transaction exists
      const transaction = await prisma.transaction.findUnique({
        where: { transactionId },
      });

      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      // Update the transaction
      const updatedTransaction = await prisma.transaction.update({
        where: { transactionId },
        data: {
          name,
          email,
          phone,
          userType,
          amount,
          type,
          date,
          transactionNature,
          status,
        },
      });

      // Return the updated transaction
      return res.status(200).json(updatedTransaction);
    } catch (error) {
      console.error("Error updating transaction:", error);
      return res.status(500).json({ message: "Error updating transaction" });
    }
  } else {
    // Method Not Allowed for other HTTP methods
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
