// app/api/admin/expenditures/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET(req: NextRequest) {
  try {
    // Parse URL for query parameters
    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year");
    const month = searchParams.get("month");
    
    // Calculate date range based on year and month
    let startDate, endDate;
    if (year && month) {
      // Month-specific range (month is 0-indexed in JS Date)
      startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      endDate = new Date(parseInt(year), parseInt(month), 0); // Last day of month
    } else if (year) {
      // Year-specific range
      startDate = new Date(parseInt(year), 0, 1);
      endDate = new Date(parseInt(year), 11, 31);
    } else {
      // Default to current year if no parameters provided
      const currentYear = new Date().getFullYear();
      startDate = new Date(currentYear, 0, 1);
      endDate = new Date(currentYear, 11, 31);
    }

    // Statistics by category
    const categoryStats = await prisma.expenditure.groupBy({
      by: ['category'],
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    // Statistics by month (if year is provided)
    let monthlyStats = [];
    if (year) {
      // Aggregate data for each month
      monthlyStats = await Promise.all(
        Array.from({ length: 12 }, async (_, monthIndex) => {
          const monthStart = new Date(parseInt(year), monthIndex, 1);
          const monthEnd = new Date(parseInt(year), monthIndex + 1, 0);
          
          const total = await prisma.expenditure.aggregate({
            where: {
              date: {
                gte: monthStart,
                lte: monthEnd,
              },
            },
            _sum: {
              amount: true,
            },
          });
          
          return {
            month: monthIndex + 1,
            monthName: new Date(2000, monthIndex, 1).toLocaleString('default', { month: 'long' }),
            total: total._sum.amount || 0,
          };
        })
      );
    }

    // Statistics by user (member-wise)
    const userStats = await prisma.expenditure.groupBy({
      by: ['userId'],
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
        userId: {
          not: null,
        },
      },
      _sum: {
        amount: true,
      },
    });

    // Get user details for user stats
    const userDetails = await Promise.all(
      userStats.map(async (stat) => {
        if (!stat.userId) return { ...stat, user: null };
        
        const user = await prisma.user.findUnique({
          where: { id: stat.userId },
          select: {
            id: true,
            fullname: true,
            email: true,
          },
        });
        
        return {
          userId: stat.userId,
          total: stat._sum.amount,
          user,
        };
      })
    );

    // Calculate overall total
    const overallTotal = await prisma.expenditure.aggregate({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return NextResponse.json({
      totalExpenditure: overallTotal._sum.amount || 0,
      categoryBreakdown: categoryStats,
      monthlyBreakdown: monthlyStats,
      userContributions: userDetails,
      dateRange: {
        startDate,
        endDate,
      },
    });
  } catch (error) {
    console.error("Error fetching expenditure statistics:", error);
    return NextResponse.json({ error: "Failed to fetch expenditure statistics" }, { status: 500 });
  }
}