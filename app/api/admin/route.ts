import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/client';
import * as XLSX from 'xlsx';

// Helper function to convert data to CSV with proper UTF-8 encoding
function convertToCSV(data: any[]) {
  if (!data || data.length === 0) return '';
  
  // Function to escape special characters and handle quotes
  const escapeField = (field: any) => {
    if (field === null || field === undefined) return '';
    const stringField = String(field);
    if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
      return `"${stringField.replace(/"/g, '""')}"`;
    }
    return stringField;
  };

  const header = Object.keys(data[0]);
  const rows = [
    header.join(','),
    ...data.map(row => 
      header.map(fieldName => escapeField(row[fieldName])).join(',')
    )
  ];

  // Add UTF-8 BOM at the start
  const BOM = '\uFEFF';
  return BOM + rows.join('\r\n');
}

// Helper function to convert data to Excel
function convertToExcel(data: any[]) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return excelBuffer;
}

// Helper function to format dates
function formatDate(date: Date | string | null) {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
}

// Helper function to build filter conditions
function buildFilterConditions(searchParams: URLSearchParams) {
  const where: any = {};

  // Common filters
  const search = searchParams.get('search')?.toLowerCase();
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const status = searchParams.get('status');
  const type = searchParams.get('filterType');
  const location = searchParams.get('location');

  if (startDate && endDate) {
    where.createdAt = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  if (status) {
    where.status = status;
  }

  return { where, search };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dataType = searchParams.get('type'); // 'drives', 'users', or 'donations'
    const format = searchParams.get('format'); // 'csv' or 'excel'
    const sortField = searchParams.get('sortField') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const { where, search } = buildFilterConditions(searchParams);

    let data: any[] = [];
    const orderBy = { [sortField]: sortOrder };

    switch (dataType) {
      case 'drives':
        // Add drive-specific filters
        if (search) {
          where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { location: { contains: search, mode: 'insensitive' } },
            { dtype: { contains: search, mode: 'insensitive' } },
          ];
        }
        if (searchParams.get('dtype')) {
          where.dtype = searchParams.get('dtype');
        }
        if (searchParams.get('location')) {
          where.location = searchParams.get('location');
        }

        data = await prisma.drive.findMany({
          where,
          orderBy,
          select: {
            id: true,
            title: true,
            location: true,
            dtype: true,
            status: true,
            startDate: true,
            EndDate: true,
            createdAt: true,
            description: true
          }
        });
        break;

      case 'users':
        // Add user-specific filters
        if (search) {
          where.OR = [
            { fullname: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { mobile: { contains: search, mode: 'insensitive' } },
          ];
        }

        data = await prisma.user.findMany({
          where,
          orderBy,
          select: {
            id: true,
            fullname: true,
            email: true,
            address: true,
            mobile: true,
            createdAt: true
          }
        });
        break;

      case 'donations':
        // Add donation-specific filters
        if (search) {
          where.OR = [
            { fullname: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { type: { contains: search, mode: 'insensitive' } },
          ];
        }
        if (searchParams.get('type')) {
          where.type = searchParams.get('type');
        }

        const GetAllDonationRequests = await prisma.donationRequests.findMany();
        return NextResponse.json(GetAllDonationRequests, { status: 200 });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid data type' }, 
          { status: 400 }
        );
    }

    // Format dates and handle null values
    data = data.map(item => ({
      ...item,
      createdAt: formatDate(item.createdAt),
      startDate: item.startDate ? item.startDate : '',
      EndDate: item.EndDate ? item.EndDate : '',
      fullname: item.fullname || '',
      email: item.email || '',
      mobile: item.mobile || '',
      address: item.address || '',
      type: item.type || '',
      quantity: item.quantity || '',
      status: item.status || '',
    }));

    if (format === 'csv') {
      const csv = convertToCSV(data);
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv;charset=utf-8',
          'Content-Disposition': `attachment; filename=${dataType}-${Date.now()}.csv`
        }
      });
    } 
    
    if (format === 'xlsx') {
      const excel = convertToExcel(data);
      return new NextResponse(excel, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename=${dataType}-${Date.now()}.xlsx`
        }
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}