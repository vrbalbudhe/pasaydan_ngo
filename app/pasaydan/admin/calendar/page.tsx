"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CalendarCheck, List, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import CalendarView from "@/components/Admin/a_Calendar/CalendarView";
import ListView from "@/components/Admin/a_Calendar/ListView";
import MonthNavigation from "@/components/Admin/a_Calendar/MonthNavigation";
import DonationEditorDialog from "@/components/Admin/a_Calendar/DonationEditorDialog";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

interface User {
  id: string;
  fullname: string;
}

interface DonationEntry {
  id?: string;
  userId: string;
  date: string;
  amount: number;
  transactionNature: "CREDIT" | "DEBIT";
  description?: string;
  userName?: string;
}

const DonationCalendarPage = () => {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  const [users, setUsers] = useState<User[]>([]);
  const [donations, setDonations] = useState<DonationEntry[]>([]);
  const [allDonations, setAllDonations] = useState<DonationEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [editingDonation, setEditingDonation] = useState<DonationEntry | null>(null);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const calendarGrid = [];
  let dayCounter = 1;
  for (let week = 0; week < 6; week++) {
    const weekDays = [];
    for (let day = 0; day < 7; day++) {
      if ((week === 0 && day < firstDayOfMonth) || dayCounter > daysInMonth) {
        weekDays.push(null);
      } else {
        weekDays.push(dayCounter++);
      }
    }
    calendarGrid.push(weekDays);
    if (dayCounter > daysInMonth) break;
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const usersResponse = await fetch("/api/admin/calendar/users");
        const { success: usersSuccess, users } = await usersResponse.json();
        if (usersSuccess) setUsers(users);

        const startDate = `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}-01`;
        const endDate = `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}-${daysInMonth}`;

        const donationsResponse = await fetch(`/api/admin/calendar?startDate=${startDate}&endDate=${endDate}`);
        const { success: donationsSuccess, donations } = await donationsResponse.json();
        if (donationsSuccess) {
          const formatted = donations.map((donation: DonationEntry) => ({
            ...donation,
            userName: donation.userName || "Unknown User",
          }));
          setDonations(formatted);
        }

        const fullStart = `${currentYear - 1}-01-01`;
        const fullEnd = `${currentYear + 1}-12-31`;
        const allRes = await fetch(`/api/admin/calendar?startDate=${fullStart}&endDate=${fullEnd}`);
        const { success: allSuccess, donations: all } = await allRes.json();
        if (allSuccess) {
          setAllDonations(all);
        }
      } catch (error) {
        toast.error("Failed to load data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentMonth, currentYear]);

  const getDayDonations = (day: number) => {
    const date = `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    return donations.filter((d) => d.date === date);
  };

  const getDayTotal = (day: number) => {
    return getDayDonations(day).reduce((total, donation) => {
      return donation.transactionNature === "CREDIT" ? total + donation.amount : total - donation.amount;
    }, 0);
  };

  const getMonthTotal = () => {
    return donations.reduce((sum, d) => d.transactionNature === "CREDIT" ? sum + d.amount : sum - d.amount, 0);
  };

  const getOverallTotal = () => {
    return allDonations.reduce((sum, d) => d.transactionNature === "CREDIT" ? sum + d.amount : sum - d.amount, 0);
  };

  const openDonationEditor = (userId: string, day: number) => {
    const existing = getDayDonations(day).find((d) => d.userId === userId);
    setEditingDonation(
      existing || {
        userId,
        date: `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`,
        amount: 0,
        transactionNature: "CREDIT",
        description: "",
      }
    );
  };

  const saveDonation = async () => {
    if (!editingDonation) return;
    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingDonation),
      });

      const data = await response.json();
      if (data.success) {
        setDonations((prev) => {
          const updated = prev.filter((d) => !(d.userId === editingDonation.userId && d.date === editingDonation.date));
          return [...updated, { ...editingDonation, id: data.donationId }];
        });
        toast.success("Donation saved.");
        setEditingDonation(null);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to save donation.");
    } finally {
      setIsSaving(false);
    }
  };

  const getUserName = (userId: string) => {
    const donation = donations.find((d) => d.userId === userId);
    return donation?.userName || donation?.name || "Unknown User";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center">
          <Loader2 className="animate-spin h-16 w-16 mx-auto text-blue-500 mb-4" />
          <span className="text-2xl text-gray-700 font-semibold">Loading Pasaydan Donations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <CalendarCheck className="h-10 w-10 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-800">Pasaydan Donations</h1>
        </div>
        <div className="flex gap-2 shadow-sm rounded-lg bg-white">
          <Button 
            variant={viewMode === "calendar" ? "default" : "ghost"} 
            onClick={() => setViewMode("calendar")}
            className="flex items-center space-x-2"
          >
            <CalendarCheck className="h-4 w-4" />
            <span>Calendar View</span>
          </Button>
          <Button 
            variant={viewMode === "list" ? "default" : "ghost"} 
            onClick={() => setViewMode("list")}
            className="flex items-center space-x-2"
          >
            <List className="h-4 w-4" />
            <span>List View</span>
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500 mb-2">Monthly Total</div>
              <div className={`text-2xl font-bold ${getMonthTotal() >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(getMonthTotal())}
              </div>
            </div>
            <TrendingUp className={`h-10 w-10 ${getMonthTotal() >= 0 ? "text-green-400" : "text-red-400"}`} />
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500 mb-2">Overall Total</div>
              <div className={`text-2xl font-bold ${getOverallTotal() >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(getOverallTotal())}
              </div>
            </div>
            <TrendingUp className={`h-10 w-10 ${getOverallTotal() >= 0 ? "text-green-400" : "text-red-400"}`} />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-md">
        <CardContent className="p-6">
          <MonthNavigation
            monthNames={monthNames}
            currentMonth={currentMonth}
            currentYear={currentYear}
            previousMonth={() => setCurrentMonth(currentMonth === 0 ? 11 : currentMonth - 1)}
            nextMonth={() => setCurrentMonth(currentMonth === 11 ? 0 : currentMonth + 1)}
          />
        </CardContent>
      </Card>

      {viewMode === "calendar" ? (
        <CalendarView
          monthNames={monthNames}
          currentMonth={currentMonth}
          currentYear={currentYear}
          calendarGrid={calendarGrid}
          dayLabels={dayLabels}
          getDayDonations={getDayDonations}
          getDayTotal={getDayTotal}
          getUserName={getUserName}
          openDonationEditor={openDonationEditor}
          setSelectedUser={setSelectedUser}
        />
      ) : (
        <ListView
          users={users}
          donations={donations}
          monthNames={monthNames}
          currentMonth={currentMonth}
          currentYear={currentYear}
          days={Array.from({ length: daysInMonth }, (_, i) => i + 1)}
          openDonationEditor={openDonationEditor}
          setSelectedUser={setSelectedUser}
          getUserName={getUserName}
        />
      )}

      {editingDonation && (
        <DonationEditorDialog
          open={!!editingDonation}
          onClose={() => setEditingDonation(null)}
          donation={editingDonation}
          setDonation={setEditingDonation}
          saveDonation={saveDonation}
          isSaving={isSaving}
          users={users}
          userName={users.find((u) => u.id === editingDonation.userId)?.fullname}
          dateDisplay={format(new Date(editingDonation.date), "MMMM d, yyyy")}
        />
      )}
    </div>
  );
};

export default DonationCalendarPage;