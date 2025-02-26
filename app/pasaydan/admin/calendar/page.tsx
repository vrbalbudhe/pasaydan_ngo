'use client';

import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { 
  CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Edit, 
  Info,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard
} from 'lucide-react';

// Import all necessary components from your UI library
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { CardHeader } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';
import { CardDescription } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { SelectContent } from '@/components/ui/select';
import { SelectItem } from '@/components/ui/select';
import { SelectTrigger } from '@/components/ui/select';
import { SelectValue } from '@/components/ui/select';
import { Table } from '@/components/ui/table';
import { TableBody } from '@/components/ui/table';
import { TableCell } from '@/components/ui/table';
import { TableHead } from '@/components/ui/table';
import { TableHeader } from '@/components/ui/table';
import { TableRow } from '@/components/ui/table';
import { Dialog } from '@/components/ui/dialog';
import { DialogContent } from '@/components/ui/dialog';
import { DialogHeader } from '@/components/ui/dialog';
import { DialogTitle } from '@/components/ui/dialog';
import { DialogFooter } from '@/components/ui/dialog';
import { DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { TabsContent } from '@/components/ui/tabs';
import { TabsList } from '@/components/ui/tabs';
import { TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup } from '@/components/ui/toggle-group';
import { ToggleGroupItem } from '@/components/ui/toggle-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  transactionNature: 'CREDIT' | 'DEBIT';
  transactionId: string;
  type: string;
  User?: { fullname: string; email: string } | null;
  Organization?: { name: string; email: string } | null;
}

interface Entity {
  id: string;
  name: string;
  email: string;
  userType: string;
}

interface DayTransaction {
  day: number;
  transactions: Transaction[];
}

export default function CalendarPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [daysInMonth, setDaysInMonth] = useState(31);
  const [selectedUserType, setSelectedUserType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // New state variables
  const [selectedDayTransactions, setSelectedDayTransactions] = useState<Transaction[]>([]);
  const [selectedEntityName, setSelectedEntityName] = useState('');
  const [selectedDay, setSelectedDay] = useState(0);
  const [editingTransaction, setEditingTransaction] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{[key: string]: {amount: string, description: string}}>({});

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const userTypes = [
    { value: 'all', label: 'All' },
    { value: 'individual', label: 'Users' },
    { value: 'organization', label: 'Organizations' },
    { value: 'Admin', label: 'Admins' },
    { value: 'MiniAdmin', label: 'Sub Admins' },
  ];

  useEffect(() => {
    fetchCalendarData();
  }, [selectedMonth, selectedYear, selectedUserType]);

  const fetchCalendarData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/admin/calendar?month=${selectedMonth}&year=${selectedYear}&userType=${selectedUserType}`
      );
      const data = await response.json();
      setTransactions(data.transactions);
      setEntities(data.entities);
      setDaysInMonth(data.daysInMonth);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
      setIsLoading(false);
    }
  };

  const handleTransactionUpdate = async (transactionId: string) => {
    if (!editValues[transactionId]) return;

    try {
      const response = await fetch('/api/admin/calendar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId: transactionId,
          amount: parseFloat(editValues[transactionId].amount),
          description: editValues[transactionId].description,
        }),
      });

      if (response.ok) {
        // Update local state to reflect changes
        const updatedTransactions = selectedDayTransactions.map(t => {
          if (t.id === transactionId) {
            return {
              ...t, 
              amount: parseFloat(editValues[transactionId].amount),
              description: editValues[transactionId].description
            };
          }
          return t;
        });
        
        setSelectedDayTransactions(updatedTransactions);
        setEditingTransaction(null);
        
        // Refetch all data to ensure everything is in sync
        fetchCalendarData();
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const goToPreviousMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const filteredEntities = useMemo(() => {
    return entities.filter(entity => {
      const matchesUserType = selectedUserType === 'all' || entity.userType.toLowerCase() === selectedUserType.toLowerCase();
      const matchesSearch = searchTerm === '' || 
        entity.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        entity.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesUserType && matchesSearch;
    });
  }, [entities, selectedUserType, searchTerm]);

  const getTransactionsForEntityAndMonth = (entityId: string) => {
    const days: DayTransaction[] = [];
    
    // Create entries for all days in the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayTransactions = transactions.filter(t => {
        const transactionDay = new Date(t.date).getDate();
        return ((t.User?.email && entities.find(e => e.id === entityId)?.email === t.User?.email) || 
               (t.Organization?.email && entities.find(e => e.id === entityId)?.email === t.Organization?.email)) && 
               transactionDay === day;
      });
      
      days.push({ day, transactions: dayTransactions });
    }
    
    return days;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const openDayTransactions = (entity: Entity, day: number, transactions: Transaction[]) => {
    setSelectedEntityName(entity.name);
    setSelectedDay(day);
    setSelectedDayTransactions(transactions);
    
    // Initialize edit values for each transaction
    const initialEditValues: {[key: string]: {amount: string, description: string}} = {};
    transactions.forEach(t => {
      initialEditValues[t.id] = {
        amount: t.amount.toString(),
        description: t.description || ''
      };
    });
    setEditValues(initialEditValues);
    
    setIsDialogOpen(true);
  };

  const handleEditStart = (transactionId: string) => {
    setEditingTransaction(transactionId);
  };

  const handleEditCancel = () => {
    setEditingTransaction(null);
    // Reset edit values to original
    const resetValues: {[key: string]: {amount: string, description: string}} = {};
    selectedDayTransactions.forEach(t => {
      resetValues[t.id] = {
        amount: t.amount.toString(),
        description: t.description || ''
      };
    });
    setEditValues(resetValues);
  };

  const handleInputChange = (transactionId: string, field: 'amount' | 'description', value: string) => {
    setEditValues(prev => ({
      ...prev,
      [transactionId]: {
        ...prev[transactionId],
        [field]: value
      }
    }));
  };

  return (
    <Card className="w-full shadow-lg border-t-4 border-blue-500">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-semibold text-blue-800">Transaction Calendar</CardTitle>
            <CardDescription>View and manage financial transactions by date</CardDescription>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={goToPreviousMonth}
                className="h-9 w-9"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => setSelectedMonth(parseInt(value))}
              >
                <SelectTrigger className="w-32 h-9">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger className="w-24 h-9">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => (
                    <SelectItem 
                      key={new Date().getFullYear() - 2 + i} 
                      value={(new Date().getFullYear() - 2 + i).toString()}
                    >
                      {new Date().getFullYear() - 2 + i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={goToNextMonth}
                className="h-9 w-9"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <ToggleGroup type="single" value={selectedUserType} onValueChange={(value) => value && setSelectedUserType(value)}>
              {userTypes.map(type => (
                <ToggleGroupItem key={type.value} value={type.value} aria-label={type.label} className="text-xs sm:text-sm">
                  {type.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            
            <div className="w-full sm:w-64">
              <Input 
                type="text" 
                placeholder="Search by name or email" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9"
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-60">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border shadow">
              <Table>
                <TableHeader className="bg-blue-50">
                  <TableRow>
                    <TableHead className="sticky left-0 bg-blue-50 z-10 min-w-[180px]">User / Entity</TableHead>
                    <TableHead className="text-center">Type</TableHead>
                    <TableHead className="text-center">Transactions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntities.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center h-40">
                        No results found.
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredEntities.map((entity) => {
                    const entityTransactions = getTransactionsForEntityAndMonth(entity.id);
                    
                    return (
                      <TableRow key={entity.id} className="hover:bg-slate-50">
                        <TableCell className="font-medium sticky left-0 bg-white z-10 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span>{entity.name}</span>
                            <span className="text-xs text-gray-500">{entity.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={
                            entity.userType === 'Admin' ? "destructive" : 
                            entity.userType === 'MiniAdmin' ? "secondary" :
                            entity.userType === 'organization' ? "outline" : "default"
                          }>
                            {entity.userType}
                          </Badge>
                        </TableCell>
                        <TableCell className="p-2">
                          <div className="flex flex-wrap gap-1">
                            {entityTransactions.map(({ day, transactions }) => {
                              if (transactions.length === 0) {
                                return (
                                  <div key={day} className="h-6 w-8 text-center text-sm text-gray-800 flex items-center justify-center">
                                    {day}
                                  </div>
                                );
                              }
                              
                              const hasCreditTransaction = transactions.some(t => t.transactionNature === 'CREDIT');
                              const hasDebitTransaction = transactions.some(t => t.transactionNature === 'DEBIT');
                              const totalCredit = transactions
                                .filter(t => t.transactionNature === 'CREDIT')
                                .reduce((sum, t) => sum + t.amount, 0);
                              const totalDebit = transactions
                                .filter(t => t.transactionNature === 'DEBIT')
                                .reduce((sum, t) => sum + t.amount, 0);
                              
                              return (
                                <Button
                                  key={day}
                                  variant="ghost"
                                  size="sm"
                                  className={`rounded-md px-1 py-0.5 flex flex-col items-center justify-center min-w-12 h-11 text-xs font-normal ${
                                    hasCreditTransaction && hasDebitTransaction
                                      ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                                      : hasCreditTransaction
                                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                                  }`}
                                  onClick={() => openDayTransactions(entity, day, transactions)}
                                >
                                  <span className="font-bold">{day}</span>
                                  <div className="flex flex-col items-center">
                                    {hasCreditTransaction && (
                                      <span className="text-green-600 text-xs">+{formatCurrency(totalCredit)}</span>
                                    )}
                                    {hasDebitTransaction && (
                                      <span className="text-red-600 text-xs">-{formatCurrency(totalDebit)}</span>
                                    )}
                                  </div>
                                </Button>
                              );
                            })}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <CalendarIcon className="h-5 w-5" />
              Transactions for {selectedEntityName} on {months.find(m => m.value === selectedMonth)?.label} {selectedDay}, {selectedYear}
            </DialogTitle>
            <DialogDescription>
              {selectedDayTransactions.length} transaction{selectedDayTransactions.length !== 1 ? 's' : ''} found
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <Accordion type="single" collapsible className="w-full">
              {selectedDayTransactions.map((transaction, index) => {
                const isEditing = editingTransaction === transaction.id;
                
                return (
                  <AccordionItem 
                    key={transaction.id} 
                    value={transaction.id}
                    className={`border rounded-lg mb-3 ${
                      transaction.transactionNature === 'CREDIT' 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <AccordionTrigger className="px-4 py-2 hover:no-underline">
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-2">
                          {transaction.transactionNature === 'CREDIT' ? (
                            <ArrowUpRight className="h-5 w-5 text-green-600" />
                          ) : (
                            <ArrowDownRight className="h-5 w-5 text-red-600" />
                          )}
                          <span className={transaction.transactionNature === 'CREDIT' ? 'text-green-700' : 'text-red-700'}>
                            {transaction.transactionNature === 'CREDIT' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="mr-2">
                            {transaction.type}
                          </Badge>
                          <span className="text-sm text-gray-500">ID: {transaction.transactionId.slice(0, 8)}...</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="space-y-1.5">
                              <div className="font-medium text-sm text-gray-500">User/Organization</div>
                              <div>{transaction.User?.fullname || transaction.Organization?.name || 'Unknown'}</div>
                            </div>
                          </div>
                          <div>
                            <div className="space-y-1.5">
                              <div className="font-medium text-sm text-gray-500">Email</div>
                              <div>{transaction.User?.email || transaction.Organization?.email || 'Unknown'}</div>
                            </div>
                          </div>
                          <div>
                            <div className="space-y-1.5">
                              <div className="font-medium text-sm text-gray-500">Transaction ID</div>
                              <div className="font-mono text-sm">{transaction.transactionId}</div>
                            </div>
                          </div>
                          <div>
                            <div className="space-y-1.5">
                              <div className="font-medium text-sm text-gray-500">Date & Time</div>
                              <div>{format(new Date(transaction.date), 'PPP p')}</div>
                            </div>
                          </div>
                        </div>
                        
                        {isEditing ? (
                          <div className="space-y-4 pt-4 border-t border-gray-200">
                            <h4 className="text-sm font-medium mb-3 flex items-center gap-1.5">
                              <Edit className="h-4 w-4" />
                              Update Transaction
                            </h4>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Amount</label>
                                <Input
                                  type="number"
                                  value={editValues[transaction.id]?.amount || ''}
                                  onChange={(e) => handleInputChange(transaction.id, 'amount', e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <Input
                                  value={editValues[transaction.id]?.description || ''}
                                  onChange={(e) => handleInputChange(transaction.id, 'description', e.target.value)}
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={handleEditCancel}>
                                  Cancel
                                </Button>
                                <Button onClick={() => handleTransactionUpdate(transaction.id)}>
                                  Save Changes
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2 pt-4 border-t border-gray-200">
                            <div className="space-y-1.5">
                              <div className="font-medium text-sm text-gray-500">Description</div>
                              <div>{transaction.description || 'No description provided'}</div>
                            </div>
                            <div className="flex justify-end">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="mt-2"
                                onClick={() => handleEditStart(transaction.id)}
                              >
                                <Edit className="h-4 w-4 mr-1" /> Edit
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}