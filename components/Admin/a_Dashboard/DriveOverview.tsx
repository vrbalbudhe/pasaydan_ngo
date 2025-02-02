// components/Admin/a_Dashboard/DriveOverview.tsx
"use client"
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Clock, CheckCircle } from 'lucide-react';
import { Drive } from '@prisma/client';

const DriveOverview = () => {
  const [drives, setDrives] = useState<Drive[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const response = await fetch('/api/admin/dashboard/drives');
        if (!response.ok) throw new Error('Failed to fetch drives');
        const data = await response.json();
        setDrives(data);
      } catch (error) {
        console.error('Error fetching drives:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrives();
  }, []);

  const getUpcomingDrives = () => 
    drives.filter(drive => new Date(drive.startDate) > new Date());

  const getActiveDrives = () => 
    drives.filter(drive => {
      const now = new Date();
      return new Date(drive.startDate) <= now && new Date(drive.EndDate) >= now;
    });

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const upcomingDrives = getUpcomingDrives();
  const activeDrives = getActiveDrives();

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Drives Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Total Drives</p>
                <p className="text-2xl font-bold text-purple-700">{drives.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Active Drives</p>
                <p className="text-2xl font-bold text-blue-700">{activeDrives.length}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Upcoming Drives</p>
                <p className="text-2xl font-bold text-green-700">{upcomingDrives.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-4">Upcoming Drives</h3>
          <div className="space-y-4">
            {upcomingDrives.slice(0, 3).map((drive) => (
              <div key={drive.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900">{drive.title}</h4>
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{drive.location}</span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(drive.startDate).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{drive.description}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DriveOverview;