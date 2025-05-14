"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CalendarCheck } from "lucide-react";
import { toast } from "sonner";

// Import our new components
import CalendarHeader from "@/components/Admin/a_Calendar/CalendarHeader";
import CalendarGrid from "@/components/Admin/a_Calendar/CalendarGrid";
import CalendarMetrics from "@/components/Admin/a_Calendar/CalendarMetrics";
import CalendarNavigation from "@/components/Admin/a_Calendar/CalendarNavigation";
import AddDonationDialog from "@/components/Admin/a_Calendar/AddDonationDialog";
import EditDonationDialog from "@/components/Admin/a_Calendar/EditDonationDialog";

export interface DonationEntry {
  id: string;
  name: string;
  email: string;
  phone: string;
  amount: number;
  type: string;
  transactionNature: "CREDIT" | "DEBIT";
  date: Date;
  description?: string;
  status: string;
  userType?: string;
  entryType?: string;
  moneyFor?: string;
  customMoneyFor?: string;
  transactionId?: string; // Added transactionId to interface
  userId?: string;
}

export interface User {
  id: string;
  fullname: string;
  email?: string;
  phone?: string;
  mobile?: string;
  type?: string;
}

const DonationCalendarPage = () => {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // State for calendar view
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [isLoading, setIsLoading] = useState(true);
  const [monthData, setMonthData] = useState<DonationEntry[]>([]);
  const [allDonations, setAllDonations] = useState<DonationEntry[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  // State for donation dialogs
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDonation, setSelectedDonation] = useState<DonationEntry | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Calendar calculation
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Build calendar grid
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

  // Navigation methods
  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Direct month and year setters
  const setMonth = (month: number) => {
    setCurrentMonth(month);
  };

  const setYear = (year: number) => {
    setCurrentYear(year);
  };

  // Fetch transactions and users
  useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch users for dropdown selection
      const usersResponse = await fetch("/api/admin/calendar/users");
      const usersData = await usersResponse.json();
      if (usersData.success) {
        setUsers(usersData.users || []);
      }
      
      // Fetch current month data
      const startDate = new Date(currentYear, currentMonth, 1);
      const endDate = new Date(currentYear, currentMonth + 1, 0);
      endDate.setHours(23, 59, 59, 999); // Set to end of day
      
      const response = await fetch(`/api/admin/transactions?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
      const data = await response.json();
      
      if (data.success) {
        setMonthData(data.data || []);
      } else {
        toast.error("Failed to load transactions");
      }

      // Fetch ALL donations for overall totals without date filtering
      const allResponse = await fetch(`/api/admin/transactions?limit=10000`); // Use a high limit to get all transactions
      const allData = await allResponse.json();
      
      if (allData.success) {
        setAllDonations(allData.data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, [currentMonth, currentYear]);

  // Get donations for a specific day
  const getDayDonations = (day: number) => {
    const targetDate = new Date(currentYear, currentMonth, day);
    return monthData.filter(donation => {
      const donationDate = new Date(donation.date);
      return (
        donationDate.getDate() === targetDate.getDate() &&
        donationDate.getMonth() === targetDate.getMonth() &&
        donationDate.getFullYear() === targetDate.getFullYear()
      );
    });
  };

  // Calculate total for a day
  const getDayTotal = (day: number) => {
    const donations = getDayDonations(day);
    return donations.reduce((total, donation) => {
      return donation.transactionNature === "CREDIT" 
        ? total + donation.amount 
        : total - donation.amount;
    }, 0);
  };

  // Calculate totals
  const getMonthTotal = () => {
    return monthData.reduce((total, donation) => {
      return donation.transactionNature === "CREDIT" 
        ? total + donation.amount 
        : total - donation.amount;
    }, 0);
  };

  const getOverallTotal = () => {
    return allDonations.reduce((total, donation) => {
      return donation.transactionNature === "CREDIT" 
        ? total + donation.amount 
        : total - donation.amount;
    }, 0);
  };

  // Open add donation dialog
  const openAddDialog = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    setSelectedDate(date);
    setAddDialogOpen(true);
  };

  // Open edit donation dialog
  const openEditDialog = (donation: DonationEntry) => {
    setSelectedDonation(donation);
    setEditDialogOpen(true);
  };

  // Save a new donation
  const saveNewDonation = async (formData: any) => {
    setIsSaving(true);
    try {
      // Create form data object to match transaction API expectations
      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("email", formData.email || "calendar@entry.com");
      formDataObj.append("phone", formData.phone || "0000000000");
      formDataObj.append("amount", formData.amount.toString());
      formDataObj.append("type", formData.type);
      formDataObj.append("transactionNature", formData.transactionNature);
      formDataObj.append("date", selectedDate.toISOString());
      formDataObj.append("description", formData.description || "");
      formDataObj.append("status", "VERIFIED");
      formDataObj.append("userType", formData.userType || "INDIVIDUAL");
      formDataObj.append("entryType", "MANUAL");
      formDataObj.append("entryBy", formData.entryBy || "Calendar Admin");
      formDataObj.append("moneyFor", formData.moneyFor || "OTHER");
      
      // Add transaction ID for non-cash payments
      if (formData.type !== "CASH" && formData.transactionId) {
        formDataObj.append("transactionId", formData.transactionId);
      }

      // Use the transaction API directly
      const response = await fetch("/api/admin/transactions", {
        method: "POST",
        body: formDataObj,
      });

      const result = await response.json();

      if (result.success) {
        // Add the new donation to our local state
        setMonthData(prev => [...prev, result.data]);
        setAllDonations(prev => [...prev, result.data]);
        toast.success("Donation added successfully");
        setAddDialogOpen(false);
      } else {
        toast.error(result.error || "Failed to add donation");
      }
    } catch (error) {
      console.error("Error adding donation:", error);
      toast.error("Failed to add donation");
    } finally {
      setIsSaving(false);
    }
  };

  // Update an existing donation
  const updateDonation = async (formData: any) => {
    if (!selectedDonation) return;
    
    setIsSaving(true);
    try {
      // Create request payload for the transaction update API
      const payload = {
        id: selectedDonation.id,
        name: formData.name,
        email: formData.email || selectedDonation.email,
        phone: formData.phone || selectedDonation.phone,
        amount: formData.amount,
        type: formData.type,
        transactionNature: formData.transactionNature,
        description: formData.description,
        // Include the transaction ID - important for non-cash transactions
        transactionId: formData.transactionId || selectedDonation.transactionId,
        // Include necessary fields to ensure the update works
        userType: selectedDonation.userType || "INDIVIDUAL",
        status: selectedDonation.status || "VERIFIED",
        date: selectedDonation.date,
        entryType: selectedDonation.entryType || "MANUAL",
        moneyFor: selectedDonation.moneyFor || "OTHER"
      };

      // Use transaction update API
      const response = await fetch("/api/admin/transactions/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        // Update the donation in our local state
        setMonthData(prev => 
          prev.map(item => item.id === selectedDonation.id ? result.data : item)
        );
        setAllDonations(prev => 
          prev.map(item => item.id === selectedDonation.id ? result.data : item)
        );
        toast.success("Donation updated successfully");
        setEditDialogOpen(false);
        
        // Refresh data to ensure all changes are reflected
        refreshCalendarData();
      } else {
        toast.error(result.error || "Failed to update donation");
      }
    } catch (error) {
      console.error("Error updating donation:", error);
      toast.error("Failed to update donation");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete a donation
  const deleteDonation = async (donationId: string) => {
    try {
      const response = await fetch(`/api/admin/transactions/${donationId}`, {
        method: "DELETE",
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMonthData(prev => prev.filter(item => item.id !== donationId));
        setAllDonations(prev => prev.filter(item => item.id !== donationId));
        toast.success("Donation deleted successfully");
        setEditDialogOpen(false);
      } else {
        toast.error("Failed to delete donation");
      }
    } catch (error) {
      console.error("Error deleting donation:", error);
      toast.error("Failed to delete donation");
    }
  };

  // Refresh calendar data
  const refreshCalendarData = async () => {
  try {
    // Fetch current month data
    const startDate = new Date(currentYear, currentMonth, 1);
    const endDate = new Date(currentYear, currentMonth + 1, 0);
    endDate.setHours(23, 59, 59, 999);
    
    const response = await fetch(`/api/admin/transactions?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
    const data = await response.json();
    
    if (data.success) {
      setMonthData(data.data || []);
    }

    // Also refresh overall totals - fetch ALL transactions
    const allResponse = await fetch(`/api/admin/transactions?limit=10000`);
    const allData = await allResponse.json();
    
    if (allData.success) {
      setAllDonations(allData.data || []);
    }
  } catch (error) {
    console.error("Error refreshing data:", error);
  }
};

  // Loading state
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
      {/* Header */}
      <CalendarHeader />
      
      {/* Metrics */}
      <CalendarMetrics 
        monthTotal={getMonthTotal()} 
        overallTotal={getOverallTotal()} 
      />

      {/* Month Navigation */}
      <Card className="bg-white shadow-md">
        <CardContent className="p-6">
          <CalendarNavigation 
            monthNames={monthNames}
            currentMonth={currentMonth}
            currentYear={currentYear}
            previousMonth={previousMonth}
            nextMonth={nextMonth}
            setMonth={setMonth}
            setYear={setYear}
          />
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <CalendarGrid 
        calendarGrid={calendarGrid}
        dayLabels={dayLabels}
        getDayDonations={getDayDonations}
        getDayTotal={getDayTotal}
        openAddDialog={openAddDialog}
        openEditDialog={openEditDialog}
      />

      {/* Add Donation Dialog */}
      <AddDonationDialog 
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSave={saveNewDonation}
        isSaving={isSaving}
        selectedDate={selectedDate}
        users={users}
      />

      {/* Edit Donation Dialog */}
      <EditDonationDialog 
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSave={updateDonation}
        onDelete={deleteDonation}
        isSaving={isSaving}
        donation={selectedDonation}
        users={users}
      />
    </div>
  );
};

export default DonationCalendarPage;