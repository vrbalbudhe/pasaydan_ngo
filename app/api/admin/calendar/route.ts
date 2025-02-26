import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const userType = searchParams.get('userType') || 'all';

    if (!month || !year) {
      return NextResponse.json({ error: 'Month and year are required' }, { status: 400 });
    }

    // Create date range for the selected month
    const startDate = new Date(`${year}-${month.padStart(2, '0')}-01`);
    const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
    const endDate = new Date(`${year}-${month.padStart(2, '0')}-${lastDay}`);
    
    // Get all transactions for the specified month and year
    const transactions = await prisma.transaction.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        User: {
          select: {
            id: true,
            fullname: true,
            email: true
          }
        },
        Organization: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Get all users of different types
    let userQuery = {};
    if (userType !== 'all') {
      userQuery = {
        where: {
          userType: userType === 'individual' ? 'individual' : {
            contains: userType
          }
        }
      };
    }

    const users = await prisma.user.findMany({
      ...userQuery,
      select: {
        id: true,
        fullname: true,
        email: true,
        userType: true,
      },
    });

    const admins = await prisma.admin.findMany({
      where: userType === 'all' || userType === 'Admin' ? {} : { id: 'none' },
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
      },
    });

    const subAdmins = await prisma.subAdmins.findMany({
      where: userType === 'all' || userType === 'MiniAdmin' ? {} : { id: 'none' },
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
      },
    });

    const organizations = await prisma.organization.findMany({
      where: userType === 'all' || userType === 'organization' ? {} : { id: 'none' },
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
      },
    });

    // Format all entity types to have a common structure
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.fullname || user.email,
      email: user.email,
      userType: user.userType
    }));

    const formattedAdmins = admins.map(admin => ({
      id: admin.id,
      name: admin.name || admin.email,
      email: admin.email,
      userType: admin.userType
    }));

    const formattedSubAdmins = subAdmins.map(subAdmin => ({
      id: subAdmin.id,
      name: subAdmin.name || subAdmin.email,
      email: subAdmin.email,
      userType: subAdmin.userType
    }));

    const formattedOrganizations = organizations.map(org => ({
      id: org.id,
      name: org.name || org.email,
      email: org.email,
      userType: org.userType
    }));

    // Combine all entity types
    const allEntities = [
      ...formattedUsers,
      ...formattedAdmins,
      ...formattedSubAdmins,
      ...formattedOrganizations
    ];

    return NextResponse.json({ 
      transactions, 
      entities: allEntities,
      daysInMonth: lastDay
    });
  } catch (error) {
    console.error('Error fetching calendar data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { transactionId, amount, description } = body;

    if (!transactionId) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    const updatedTransaction = await prisma.transaction.update({
      where: {
        id: transactionId,
      },
      data: {
        amount,
        description,
      },
    });

    return NextResponse.json(updatedTransaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}