import { NextResponse } from "next/server";
import axios from "axios";

const TELEGRAM_API_URL = `https://api.telegram.org/bot8015823950:AAGsfqaIFX5fixa_q6CXcYOC8AYbvhI1Nk8/sendMessage`;

export async function POST(req: Request) {
  const { message } = await req.json();
  console.log(message);
  try {
    const chatIds = ["1968520917", "1080984577"];
    for (const chatId of chatIds) {
      const response = await axios.post(TELEGRAM_API_URL, {
        chat_id: chatId,
        text: message,
      });

      if (response.data.ok) {
        console.log(`Message sent to chat ID: ${chatId} successfully.`);
      } else {
        console.error(
          `Failed to send message to chat ID: ${chatId}:`,
          response.data
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending message to Telegram:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
