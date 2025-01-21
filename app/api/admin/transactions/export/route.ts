// app/api/admin/transactions/export/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import * as XLSX from 'xlsx';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const format = searchParams.get("format") || 'csv';

    // Fetch all transactions with related data
    const transactions = await prisma.transaction.findMany({
      include: {
        User: {
          select: {
            fullname: true,
            email: true,
          },
        },
        Organization: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Transform data for export
    const exportData = transactions.map(t => ({
      Date: new Date(t.date).toLocaleDateString('en-IN'),
      Name: t.name,
      Email: t.email,
      Phone: t.phone,
      Amount: t.amount,
      'Transaction Type': t.type,
      'Transaction Nature': t.transactionNature,
      'Transaction ID': t.transactionId,
      Status: t.status,
      'Entry Type': t.entryType,
      'Entry By': t.entryBy,
      'Entry At': new Date(t.entryAt).toLocaleString('en-IN'),
      Description: t.description || '',
      'Money For': t.moneyFor,
      'Custom Category': t.customMoneyFor || '',
      'User Type': t.userType,
      'Verified By': t.verifiedBy || '',
      'Verified At': t.verifiedAt ? new Date(t.verifiedAt).toLocaleString('en-IN') : '',
    }));

    if (format === 'csv') {
      // Convert to CSV
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
      
      return new Response(csvOutput, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="transactions.csv"`,
        },
      });
    } else {
      // Convert to Excel
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
      
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
      
      return new Response(excelBuffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="transactions.xlsx"`,
        },
      });
    }
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to export transactions" },
      { status: 500 }
    );
  }
}