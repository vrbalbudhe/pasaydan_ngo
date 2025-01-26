import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/client';
import * as XLSX from 'xlsx';

// Helper functions
const convertToCSV = (data: any[]) => {
  if (!data || data.length === 0) return '';
  const BOM = '\uFEFF';
  const header = Object.keys(data[0]);
  const rows = [header.join(',')];
  
  for (const row of data) {
    const values = header.map(key => {
      const value = row[key];
      if (value === null || value === undefined) return '';
      const str = String(value);
      return str.includes(',') ? `"${str}"` : str;
    });
    rows.push(values.join(','));
  }
  
  return BOM + rows.join('\r\n');
};

const convertToExcel = (data: any[]) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
};

const formatDate = (date: Date | string | null) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
};

const formatAddress = (address: any) => {
  if (!address) return '';
  return `${address.streetAddress}${address.addressLine2 ? ', ' + address.addressLine2 : ''}, ${address.city}, ${address.state}, ${address.postalCode}, ${address.country}`;
};

const getDrivesData = async (where: any, orderBy: any) => {
  return prisma.drive.findMany({
    where,
    orderBy,
    select: {
      id: true,
      title: true,
      location: true,
      description: true,
      status: true,
      dtype: true,
      startDate: true,
      EndDate: true,
      timeInterval: true,
      geoLocation: true,
      placeLink: true,
      photos: true,
      createdAt: true
    }
  });
};

const getUsersData = async (where: any, orderBy: any) => {
  return prisma.user.findMany({
    where,
    orderBy,
    select: {
      id: true,
      userType: true,
      fullname: true,
      email: true,
      mobile: true,
      avatar: true,
      address: {
        select: {
          streetAddress: true,
          addressLine2: true,
          city: true,
          state: true,
          postalCode: true,
          country: true
        }
      },
      createdAt: true,
      organizationId: true,
      transactions: {
        select: {
          id: true,
          amount: true,
          type: true,
          status: true
        }
      }
    }
  });
};

const getDonationsData = async (where: any, orderBy: any) => {
  console.log('Fetching donations with:', { where, orderBy });

  // Handle date fields properly for MongoDB
  if (where.createdAt) {
    where.date = where.createdAt;
    delete where.createdAt;
  }

  // Remove any undefined or null values from where clause
  Object.keys(where).forEach(key => {
    if (where[key] === undefined || where[key] === null) {
      delete where[key];
    }
  });

  // Remove mode: 'insensitive' for MongoDB compatibility
  if (where.OR) {
    where.OR = where.OR.map((condition: any) => {
      const key = Object.keys(condition)[0];
      return {
        [key]: { contains: condition[key].contains }
      };
    });
  }

  try {
    const result = await prisma.transaction.findMany({
      where,
      orderBy: {
        [orderBy.date ? 'date' : orderBy.createdAt ? 'date' : Object.keys(orderBy)[0]]: 
        Object.values(orderBy)[0]
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        userType: true,
        amount: true,
        type: true,
        transactionId: true,
        date: true,
        transactionNature: true,
        screenshotPath: true,
        entryType: true,
        entryBy: true,
        entryAt: true,
        description: true,
        status: true,
        statusDescription: true,
        verifiedBy: true,
        verifiedAt: true,
        moneyFor: true,
        customMoneyFor: true,
        User: {
          select: {
            fullname: true,
            email: true
          }
        },
        Organization: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    console.log('Donation query result:', result);
    return result;
  } catch (error) {
    console.error('Error fetching donations:', error);
    throw error;
  }
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dataType = searchParams.get('type');
    const format = searchParams.get('format');
    const sortField = searchParams.get('sortField') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // Build where conditions
    const where: any = {};
    const search = searchParams.get('search')?.toLowerCase();
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');
    
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }
    
    if (status && status !== 'all') {
      where.status = status;
    }
    
    // Add search conditions based on dataType
    if (search) {
      switch (dataType) {
        case 'drives':
          where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { location: { contains: search, mode: 'insensitive' } },
            { dtype: { contains: search, mode: 'insensitive' } },
          ];
          break;
          
        case 'users':
          where.OR = [
            { fullname: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { mobile: { contains: search, mode: 'insensitive' } },
          ];
          break;
          
        case 'donations':
          where.OR = [
            { name: { contains: search } },
            { email: { contains: search } },
            { phone: { contains: search } },
            { transactionId: { contains: search } }
          ];
          break;
      }
    }

    const orderBy = { [sortField]: sortOrder };
    let data: any[] = [];

    // Fetch data based on type
    switch (dataType) {
      case 'drives':
        data = await getDrivesData(where, orderBy);
        break;
        
      case 'users':
        data = await getUsersData(where, orderBy);
        break;
        
      case 'donations':
        data = await getDonationsData(where, orderBy);
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
    }

    // Format data
    data = data.map(item => {
      const formattedItem: any = { ...item };

      // Handle dates safely
      const formatDateSafely = (date: any) => {
        if (!date) return null;
        try {
          return new Date(date).toISOString();
        } catch (error) {
          console.warn('Invalid date:', date);
          return null;
        }
      };

      if (dataType === 'drives') {
        formattedItem.geoLocation = item.geoLocation ? JSON.stringify(item.geoLocation) : '';
        formattedItem.photos = item.photos ? item.photos.join(', ') : '';
        formattedItem.createdAt = formatDateSafely(item.createdAt);
      }

      if (dataType === 'users') {
        formattedItem.address = formatAddress(item.address);
        formattedItem.transactions = item.transactions ? item.transactions.length : 0;
        formattedItem.createdAt = formatDateSafely(item.createdAt);
      }

      if (dataType === 'donations') {
        formattedItem.date = formatDateSafely(item.date);
        formattedItem.verifiedAt = formatDateSafely(item.verifiedAt);
        formattedItem.entryAt = formatDateSafely(item.entryAt);
        formattedItem.createdAt = formatDateSafely(item.createdAt);
        formattedItem.userName = item.User?.fullname || item.Organization?.name || '';
        formattedItem.userEmail = item.User?.email || item.Organization?.email || '';
      }

      return formattedItem;
    });

    // Return data in requested format
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


{/*import { NextResponse } from 'next/server';
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
}*/}