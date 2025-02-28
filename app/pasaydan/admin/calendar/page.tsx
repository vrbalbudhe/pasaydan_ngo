"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  Edit,
  CreditCard,
  Check,
  X,
  InfoIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface User {
  id: string;
  fullname: string;
}

interface DonationEntry {
  id?: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  amount: number;
  transactionNature: "CREDIT" | "DEBIT";
  description?: string;
}

const DonationCalendarPage = () => {
  // Define month names and get current date
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [users, setUsers] = useState<User[]>([]);
  const [donations, setDonations] = useState<DonationEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingDonation, setEditingDonation] = useState<{
    userId: string;
    day: number;
    donation: DonationEntry | null;
  } | null>(null);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Get days in month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Calculate calendar grid with proper day placement
  const calendarGrid = [];
  let dayCounter = 1;
  
  // Generate weeks
  for (let week = 0; week < 6; week++) {
    const weekDays = [];
    for (let day = 0; day < 7; day++) {
      if ((week === 0 && day < firstDayOfMonth) || dayCounter > daysInMonth) {
        weekDays.push(null); // Empty cell
      } else {
        weekDays.push(dayCounter++);
      }
    }
    calendarGrid.push(weekDays);
    if (dayCounter > daysInMonth) break;
  }

  // Fetch users and donations
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch users
        const usersResponse = await fetch("/api/admin/calendar/users");
        const usersData = await usersResponse.json();
        
        if (usersData.success) {
          setUsers(usersData.users);
        }

        // Fetch donations for current month
        const startDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-01`;
        const endDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(daysInMonth).padStart(2, "0")}`;
        
        const donationsResponse = await fetch(
          `/api/admin/calendar?startDate=${startDate}&endDate=${endDate}`
        );
        const donationsData = await donationsResponse.json();
        
        if (donationsData.success) {
          setDonations(donationsData.donations);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentMonth, currentYear, daysInMonth]);

  // Handle month navigation
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

  // Get donation for a specific user and day
  const getDonation = (userId: string, day: number) => {
    const date = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return donations.find(
      (d) => d.userId === userId && d.date === date
    );
  };

  // Get donations for a specific day (all users)
  const getDayDonations = (day: number) => {
    const date = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return donations.filter((d) => d.date === date);
  };

  // Handle opening donation editor
  const openDonationEditor = (userId: string, day: number) => {
    const donation = getDonation(userId, day);
    
    setEditingDonation({
      userId,
      day,
      donation: donation || {
        userId,
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        amount: 0,
        transactionNature: "CREDIT",
        description: "",
      },
    });
  };

  // Save donation from editor
  const saveEditingDonation = async () => {
    if (!editingDonation) return;
    
    setIsSaving(true);
    
    try {
      const donation = editingDonation.donation;
      
      if (!donation) return;
      
      const response = await fetch("/api/admin/calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donation),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update the donation in the state
        setDonations(prev => {
          const existingIndex = prev.findIndex(
            d => d.userId === donation.userId && d.date === donation.date
          );
          
          if (existingIndex !== -1) {
            const updated = [...prev];
            updated[existingIndex] = {
              ...donation,
              id: donation.id || data.donationId,
            };
            return updated;
          } else {
            return [...prev, { ...donation, id: data.donationId }];
          }
        });
        
        toast.success("Donation saved successfully");
        setEditingDonation(null);
      } else {
        toast.error(data.message || "Failed to save donation");
      }
    } catch (error) {
      console.error("Error saving donation:", error);
      toast.error("Failed to save donation. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get user name by ID
  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.fullname : "Unknown User";
  };

  // Get color for transaction
  const getTransactionColor = (type: "CREDIT" | "DEBIT") => {
    return type === "CREDIT" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  // Calculate total donations for a day
  const getDayTotal = (day: number) => {
    const dayDonations = getDayDonations(day);
    let total = 0;
    
    dayDonations.forEach(donation => {
      if (donation.transactionNature === "CREDIT") {
        total += donation.amount;
      } else {
        total -= donation.amount;
      }
    });
    
    return total;
  };

  // Calculate total donations for a user in current month
  const getUserMonthlyTotal = (userId: string) => {
    const userDonations = donations.filter(d => d.userId === userId);
    let total = 0;
    
    userDonations.forEach(donation => {
      if (donation.transactionNature === "CREDIT") {
        total += donation.amount;
      } else {
        total -= donation.amount;
      }
    });
    
    return total;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
        <span className="ml-2 text-xl">Loading donation calendar...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pasaydan Donations</h1>
        
        <div className="flex gap-2">
          <Button 
            variant={viewMode === "calendar" ? "default" : "outline"} 
            onClick={() => setViewMode("calendar")}
            size="sm"
          >
            <CalendarIcon className="h-4 w-4 mr-2" /> Calendar View
          </Button>
          <Button 
            variant={viewMode === "list" ? "default" : "outline"} 
            onClick={() => setViewMode("list")}
            size="sm"
          >
            <CreditCard className="h-4 w-4 mr-2" /> List View
          </Button>
        </div>
      </div>
      
      {/* Month navigation */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={previousMonth}
              className="flex items-center"
              size="sm"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            
            <div className="text-xl font-semibold">
              {monthNames[currentMonth]} {currentYear}
            </div>
            
            <Button 
              variant="outline" 
              onClick={nextMonth}
              className="flex items-center"
              size="sm"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Calendar View */}
      {viewMode === "calendar" && (
        <div className="grid grid-cols-1 gap-6">
          {/* Google Calendar-inspired view */}
          <Card>
            <CardContent className="p-4">
              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2">
                {dayLabels.map((day, index) => (
                  <div key={index} className="text-center font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarGrid.flat().map((day, index) => {
                  if (day === null) {
                    return (
                      <div 
                        key={`empty-${index}`} 
                        className="bg-gray-50 h-28 rounded-md"
                      />
                    );
                  }
                  
                  const dayDonations = getDayDonations(day);
                  const dayTotal = getDayTotal(day);
                  const hasPositiveDonations = dayDonations.some(d => d.transactionNature === "CREDIT" && d.amount > 0);
                  const hasNegativeDonations = dayDonations.some(d => d.transactionNature === "DEBIT" && d.amount > 0);
                  
                  return (
                    <div 
                      key={`day-${day}`}
                      className={`border rounded-md h-28 p-1 overflow-hidden flex flex-col
                        ${new Date().getDate() === day && 
                          new Date().getMonth() === currentMonth && 
                          new Date().getFullYear() === currentYear 
                            ? 'bg-blue-50 border-blue-200' 
                            : 'bg-white'}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{day}</span>
                        {dayDonations.length > 0 && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant={dayTotal >= 0 ? "success" : "destructive"}>
                                  {formatCurrency(Math.abs(dayTotal))}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Day Total: {formatCurrency(dayTotal)}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      
                      <div className="overflow-y-auto flex-grow text-xs space-y-1">
                        {dayDonations.length > 0 ? (
                          dayDonations.slice(0, 3).map((donation, idx) => (
                            <div 
                              key={`donation-${idx}`} 
                              className={`px-1 py-0.5 rounded ${
                                donation.transactionNature === "CREDIT" 
                                  ? "bg-green-50 border-l-2 border-green-500" 
                                  : "bg-red-50 border-l-2 border-red-500"
                              }`}
                              onClick={() => openDonationEditor(donation.userId, day)}
                            >
                              <div className="truncate">{getUserName(donation.userId)}</div>
                              <div className="font-medium">
                                {formatCurrency(donation.amount)}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="h-full flex items-center justify-center text-gray-400">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 text-xs"
                                >
                                  <Plus className="h-3 w-3 mr-1" /> Add
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Add Donation</DialogTitle>
                                  <DialogDescription>
                                    {format(new Date(currentYear, currentMonth, day), "MMMM d, yyyy")}
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Select Member</label>
                                    <Select onValueChange={(value) => setSelectedUser(value)}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a member" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {users.map((user) => (
                                          <SelectItem key={user.id} value={user.id}>
                                            {user.fullname}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                
                                <DialogFooter>
                                  <Button 
                                    onClick={() => {
                                      if (selectedUser) {
                                        openDonationEditor(selectedUser, day);
                                        setSelectedUser(null);
                                      }
                                    }}
                                    disabled={!selectedUser}
                                  >
                                    Continue
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        )}
                        
                        {dayDonations.length > 3 && (
                          <div className="text-center text-gray-500">
                            +{dayDonations.length - 3} more
                          </div>
                        )}
                      </div>
                      
                      {dayDonations.length > 0 && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-5 text-xs mt-1"
                            >
                              <Plus className="h-3 w-3 mr-1" /> Add
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Donation</DialogTitle>
                              <DialogDescription>
                                {format(new Date(currentYear, currentMonth, day), "MMMM d, yyyy")}
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Select Member</label>
                                <Select onValueChange={(value) => setSelectedUser(value)}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a member" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {users.map((user) => (
                                      <SelectItem key={user.id} value={user.id}>
                                        {user.fullname}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            <DialogFooter>
                              <Button 
                                onClick={() => {
                                  if (selectedUser) {
                                    openDonationEditor(selectedUser, day);
                                    setSelectedUser(null);
                                  }
                                }}
                                disabled={!selectedUser}
                              >
                                Continue
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* List View */}
      {viewMode === "list" && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Donation Entries: {monthNames[currentMonth]} {currentYear}
              </h2>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" /> New Donation
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Donation</DialogTitle>
                    <DialogDescription>
                      Select a member and date to add a new donation entry
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Select Member</label>
                      <Select onValueChange={(value) => setSelectedUser(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a member" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.fullname}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Select Day</label>
                      <Select onValueChange={(value) => {
                        if (selectedUser) {
                          openDonationEditor(selectedUser, parseInt(value));
                        }
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a day" />
                        </SelectTrigger>
                        <SelectContent>
                          {days.map((day) => (
                            <SelectItem key={day} value={day.toString()}>
                              {day} {monthNames[currentMonth]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="space-y-2">
              {/* User summary cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {users.map((user) => {
                  const userTotal = getUserMonthlyTotal(user.id);
                  const userDonationCount = donations.filter(d => d.userId === user.id).length;
                  
                  return (
                    <Card key={user.id} className="overflow-hidden">
                      <div className={`h-2 ${userTotal >= 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg truncate">{user.fullname}</h3>
                        <div className="flex justify-between items-center mt-2">
                          <div>
                            <span className="text-sm text-gray-500">Total: </span>
                            <span className={`font-bold ${userTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(userTotal)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {userDonationCount} entries
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              {/* Donation entries table */}
              <div className="bg-white rounded-md border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Member
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {donations.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          No donations found for this month. Add a new donation to get started.
                        </td>
                      </tr>
                    ) : (
                      donations
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((donation, index) => {
                          const day = parseInt(donation.date.split('-')[2]);
                          return (
                            <tr key={donation.id || index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {format(new Date(donation.date), "d MMM yyyy")}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {getUserName(donation.userId)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {formatCurrency(donation.amount)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  donation.transactionNature === "CREDIT" 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-red-100 text-red-800"
                                }`}>
                                  {donation.transactionNature}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                {donation.description || "-"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => openDonationEditor(donation.userId, day)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Donation Editor Dialog */}
      {editingDonation && (
        <Dialog open={!!editingDonation} onOpenChange={(open) => !open && setEditingDonation(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDonation.donation?.id ? "Edit Donation" : "New Donation"}
              </DialogTitle>
              <DialogDescription>
                {getUserName(editingDonation.userId)} - {format(
                  new Date(currentYear, currentMonth, editingDonation.day), 
                  "MMMM d, yyyy"
                )}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount</label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={editingDonation.donation?.amount || ""}
                    onChange={(e) => setEditingDonation({
                      ...editingDonation,
                      donation: {
                        ...editingDonation.donation!,
                        amount: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Transaction Type</label>
                  <Select
                    value={editingDonation.donation?.transactionNature || "CREDIT"}
                    onValueChange={(value) => setEditingDonation({
                      ...editingDonation,
                      donation: {
                        ...editingDonation.donation!,
                        transactionNature: value as "CREDIT" | "DEBIT"
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CREDIT">Credit (Received)</SelectItem>
                      <SelectItem value="DEBIT">Debit (Paid Out)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description (Optional)</label>
                <Textarea
                  placeholder="Enter description..."
                  rows={3}
                  value={editingDonation.donation?.description || ""}
                  onChange={(e) => setEditingDonation({
                    ...editingDonation,
                    donation: {
                      ...editingDonation.donation!,
                      description: e.target.value
                    }
                  })}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setEditingDonation(null)}
              >
                Cancel
              </Button>
              <Button 
                onClick={saveEditingDonation}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" /> 
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Auto-save notification */}
      {isSaving && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center shadow-md">
          <Loader2 className="animate-spin h-4 w-4 mr-2" /> 
          Saving changes...
        </div>
      )}
    </div>
  );
};

export default DonationCalendarPage;