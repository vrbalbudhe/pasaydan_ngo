import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { message } = req.body;
    console.log(message);

    if (message && message.text) {
      const chatId = message.chat.id;
      const text = message.text;

      if (text === "/runapi") {
        try {
          const response = await axios.get(
            "http://localhost:3000/api/telegram"
          );
          await axios.post(
            `https://api.telegram.org/bot8015823950:AAGsfqaIFX5fixa_q6CXcYOC8AYbvhI1Nk8/sendMessage`,
            {
              chat_id: chatId,
              text:
                "API executed successfully. Response: " +
                JSON.stringify(response.data),
            }
          );
        } catch (error) {
          console.error("Error executing API:", error);
          await axios.post(
            `https://api.telegram.org/bot8015823950:AAGsfqaIFX5fixa_q6CXcYOC8AYbvhI1Nk8/sendMessage`,
            {
              chat_id: chatId,
              text: "Error executing the API. Please try again later.",
            }
          );
        }
      } else {
        // Handle other commands or messages
        await axios.post(
          `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendMessage`,
          {
            chat_id: chatId,
            text: "Unrecognized command. Please use /runapi.",
          }
        );
      }
    }

    res.status(200).send("OK");
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
