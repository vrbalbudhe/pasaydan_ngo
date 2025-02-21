// app/api/calendar/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get("month");

    if (!month) {
      return NextResponse.json(
        { error: "Month parameter is required" },
        { status: 400 }
      );
    }

    // Get the month number (0-11) from month name
    const monthNumber = new Date(`${month} 1, 2024`).getMonth();
    
    // Get all users and their transactions for the specified month
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullname: true,
        transactions: {
          where: {
            AND: [
              {
                date: {
                  gte: new Date(2024, monthNumber, 1),
                  lt: new Date(2024, monthNumber + 1, 1),
                },
              },
            ],
          },
          select: {
            id: true,
            amount: true,
            transactionNature: true,
            date: true,
          },
        },
      },
    });

    // Transform data into calendar format
    const calendarData: any = {};

    users.forEach((user) => {
      calendarData[user.id] = {
        name: user.fullname,
      };

      user.transactions.forEach((transaction) => {
        const day = transaction.date.getDate().toString();
        
        if (!calendarData[user.id][day]) {
          calendarData[user.id][day] = [];
        }

        calendarData[user.id][day].push({
          id: transaction.id,
          amount: transaction.amount,
          type: transaction.transactionNature,
          date: transaction.date.toISOString(),
        });
      });
    });

    return NextResponse.json(calendarData);
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// app/api/transactions/[id]/route.ts
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { amount, type } = await request.json();

    const updatedTransaction = await prisma.transaction.update({
      where: { id: params.id },
      data: {
        amount,
        transactionNature: type,
      },
    });

    return NextResponse.json(updatedTransaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}