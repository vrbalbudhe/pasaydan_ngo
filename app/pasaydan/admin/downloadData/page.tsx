'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Download,
  FileDown,
  Loader2,
  ArrowUpDown,
  X,
  CalendarIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  MapPin,
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// ─────────────────────────────────────────────
// Define interfaces for our filter state
// ─────────────────────────────────────────────
interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface Filters {
  search: string;
  status: string;
  dateRange: DateRange;
  type: string;
  location: string;
  sortField: string;
  sortOrder: 'asc' | 'desc';
}

// ─────────────────────────────────────────────
// Helper function to safely format dates
// ─────────────────────────────────────────────
const formatDate = (dateStr: string | Date | null | undefined) => {
  if (!dateStr) return '-';
  try {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', dateStr);
      return '-';
    }
    return format(date, 'MMM dd, yyyy');
  } catch (error) {
    console.error('Date formatting error:', error, 'for date:', dateStr);
    return '-';
  }
};

// ─────────────────────────────────────────────
// Enums from schema
// ─────────────────────────────────────────────
const TransactionType = {
  UPI: 'UPI',
  NET_BANKING: 'NET_BANKING',
  CARD: 'CARD',
  CASH: 'CASH'
};

const TransactionStatus = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED'
};

const MoneyForCategory = {
  CLOTHES: 'CLOTHES',
  FOOD: 'FOOD',
  CYCLE: 'CYCLE',
  EDUCATION: 'EDUCATION',
  HEALTHCARE: 'HEALTHCARE',
  OTHER: 'OTHER'
};

export default function DownloadData() {
  // ─────────────────────────────────────────────
  // State management
  // ─────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('drives');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadFormat, setDownloadFormat] = useState('csv');
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: 'all',
    dateRange: {
      from: undefined,
      to: undefined,
    },
    type: 'all',
    location: 'all',
    sortField: 'createdAt',
    sortOrder: 'desc'
  });

  // ─────────────────────────────────────────────
  // Options for tabs
  // ─────────────────────────────────────────────
  const statusOptions = {
    drives: ['pending', 'completed'],
    donations: Object.values(TransactionStatus),
    users: []
  };

  const typeOptions = {
    drives: ['food', 'clothes', 'books', 'medicine'],
    donations: Object.values(MoneyForCategory),
    users: []
  };

  // ─────────────────────────────────────────────
  // Build query string for API calls
  // ─────────────────────────────────────────────
  const buildQueryString = (includeFormat = false) => {
    const params = new URLSearchParams();
    params.append('type', activeTab);

    if (filters.search) params.append('search', filters.search);
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.type && filters.type !== 'all') params.append('filterType', filters.type);
    if (filters.location && filters.location !== 'all') params.append('location', filters.location);
    if (filters.dateRange.from) params.append('startDate', filters.dateRange.from.toISOString());
    if (filters.dateRange.to) params.append('endDate', filters.dateRange.to.toISOString());
    params.append('sortField', filters.sortField);
    params.append('sortOrder', filters.sortOrder);

    if (includeFormat) params.append('format', downloadFormat);

    return params.toString();
  };

  // ─────────────────────────────────────────────
  // Fetch data from the API
  // ─────────────────────────────────────────────
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/admin?${buildQueryString()}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (!Array.isArray(result)) {
        throw new Error('Invalid data format received');
      }

      setData(result);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Handle download action
  // ─────────────────────────────────────────────
  const handleDownload = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin?${buildQueryString(true)}`);

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeTab}-${Date.now()}.${downloadFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Download failed');
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Reset filters to initial state
  // ─────────────────────────────────────────────
  const resetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      dateRange: {
        from: undefined,
        to: undefined,
      },
      type: 'all',
      location: 'all',
      sortField: 'createdAt',
      sortOrder: 'desc'
    });
  };

  // ─────────────────────────────────────────────
  // Handle sorting of table columns
  // ─────────────────────────────────────────────
  const handleSort = (field: string) => {
    setFilters(prev => ({
      ...prev,
      sortField: field,
      sortOrder: prev.sortField === field && prev.sortOrder === 'desc' ? 'asc' : 'desc'
    }));
  };

  // ─────────────────────────────────────────────
  // Fetch data when filters or active tab change
  // ─────────────────────────────────────────────
  useEffect(() => {
    fetchData();
  }, [activeTab, filters]);

  // ─────────────────────────────────────────────
  // Render table columns based on active tab
  // ─────────────────────────────────────────────
  const renderColumns = () => {
    switch (activeTab) {
      case 'drives':
        return (
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort('title')}>
              Title <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Time Interval</TableHead>
            <TableHead>Place Link</TableHead>
            <TableHead>Resources</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('createdAt')}>
              Created At <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
          </TableRow>
        );
      case 'users':
        return (
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort('fullname')}>
              Name <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead>User Type</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('email')}>
              Email <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Avatar</TableHead>
            <TableHead>Organization ID</TableHead>
            <TableHead>Transactions</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('createdAt')}>
              Joined Date <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
          </TableRow>
        );
      case 'donations':
        return (
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
              Name <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>User Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Transaction Nature</TableHead>
            <TableHead>Entry Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Money For</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
              Date <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
          </TableRow>
        );
      default:
        return null;
    }
  };

  // ─────────────────────────────────────────────
  // Render table rows based on active tab
  // ─────────────────────────────────────────────
  const renderRows = () => {
    if (!Array.isArray(data) || data.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={10} className="text-center py-10">
            No data available
          </TableCell>
        </TableRow>
      );
    }

    return data.map((item) => {
      switch (activeTab) {
        case 'drives':
          return (
            <TableRow key={item.id}>
              <TableCell>{item.title || '-'}</TableCell>
              <TableCell>{item.location || '-'}</TableCell>
              <TableCell>{item.dtype || '-'}</TableCell>
              <TableCell>
                <Badge variant={item.status === 'completed' ? 'success' : 'secondary'}>
                  {item.status || '-'}
                </Badge>
              </TableCell>
              <TableCell>{item.startDate || '-'}</TableCell>
              <TableCell>{item.EndDate || '-'}</TableCell>
              <TableCell>{item.timeInterval || '-'}</TableCell>
              <TableCell>
                {item.placeLink ? (
                  <Tooltip>
                    <TooltipTrigger>
                      <LinkIcon className="h-4 w-4 text-blue-500 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>{item.placeLink}</TooltipContent>
                  </Tooltip>
                ) : '-'}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {item.photos?.length > 0 && (
                    <Tooltip>
                      <TooltipTrigger>
                        <ImageIcon className="h-4 w-4 text-blue-500" />
                      </TooltipTrigger>
                      <TooltipContent>{`${item.photos.length} photos`}</TooltipContent>
                    </Tooltip>
                  )}
                  {item.geoLocation && (
                    <Tooltip>
                      <TooltipTrigger>
                        <MapPin className="h-4 w-4 text-blue-500" />
                      </TooltipTrigger>
                      <TooltipContent>{JSON.stringify(item.geoLocation)}</TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </TableCell>
              <TableCell>{item.createdAt || '-'}</TableCell>
            </TableRow>
          );
        case 'users':
          return (
            <TableRow key={item.id}>
              <TableCell>{item.fullname || '-'}</TableCell>
              <TableCell>
                <Badge>{item.userType || 'individual'}</Badge>
              </TableCell>
              <TableCell>{item.email || '-'}</TableCell>
              <TableCell>{item.mobile || '-'}</TableCell>
              <TableCell>{item.address || '-'}</TableCell>
              <TableCell>
                {item.avatar ? (
                  <Tooltip>
                    <TooltipTrigger>
                      <ImageIcon className="h-4 w-4 text-blue-500" />
                    </TooltipTrigger>
                    <TooltipContent>{item.avatar}</TooltipContent>
                  </Tooltip>
                ) : '-'}
              </TableCell>
              <TableCell>{item.organizationId || '-'}</TableCell>
              <TableCell>
                <Badge variant="outline">{item.transactions || 0}</Badge>
              </TableCell>
              <TableCell>{item.createdAt || '-'}</TableCell>
            </TableRow>
          );
        case 'donations':
          return (
            <TableRow key={item.id}>
              <TableCell>{item.name || '-'}</TableCell>
              <TableCell>{item.email || '-'}</TableCell>
              <TableCell>{item.phone || '-'}</TableCell>
              <TableCell>
                <Badge>{item.userType || '-'}</Badge>
              </TableCell>
              <TableCell>
                ₹{typeof item.amount === 'number' ? item.amount.toFixed(2) : '-'}
              </TableCell>
              <TableCell>{item.type || '-'}</TableCell>
              <TableCell>{item.transactionId || '-'}</TableCell>
              <TableCell>
                <Badge variant="outline">{item.transactionNature || '-'}</Badge>
              </TableCell>
              <TableCell>{item.entryType || '-'}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    item.status === 'VERIFIED'
                      ? 'success'
                      : item.status === 'REJECTED'
                      ? 'destructive'
                      : 'secondary'
                  }
                >
                  {item.status || '-'}
                </Badge>
              </TableCell>
              <TableCell>
                {item.moneyFor || '-'}
                {item.customMoneyFor && (
                  <span className="text-muted-foreground ml-1">
                    ({item.customMoneyFor})
                  </span>
                )}
              </TableCell>
              <TableCell>
                {item.date ? formatDate(item.date) : '-'}
              </TableCell>
            </TableRow>
          );
        default:
          return null;
      }
    });
  };

  // ─────────────────────────────────────────────
  // Main Render
  // ─────────────────────────────────────────────
  return (
    <div className="container mx-auto space-y-6">
      <div className="w-full h-20 flex justify-between items-center px-4 pl-11 pt-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-black p-2 rounded-lg">
            <FileDown className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-gray-900">
              Download Data
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Export and analyze data records
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardContent>
          <div className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="drives">Drives</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="donations">Donations</TabsTrigger>
              </TabsList>

              <div className="my-6 flex flex-wrap gap-4">
                <Input
                  placeholder="Search..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  className="w-64"
                />

                {statusOptions[activeTab as keyof typeof statusOptions].length > 0 && (
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      {statusOptions[activeTab as keyof typeof statusOptions].map(
                        (status) => (
                          <SelectItem key={status} value={status.toLowerCase()}>
                            {status}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                )}

                {typeOptions[activeTab as keyof typeof typeOptions].length > 0 && (
                  <Select
                    value={filters.type}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {typeOptions[activeTab as keyof typeof typeOptions].map(
                        (type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                )}

                {activeTab === 'drives' && (
                  <Select
                    value={filters.location}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, location: value }))
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="pune">Pune</SelectItem>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                    </SelectContent>
                  </Select>
                )}

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[260px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.from && filters.dateRange.to ? (
                        <span>
                          {format(filters.dateRange.from, 'LLL dd, y')} -{' '}
                          {format(filters.dateRange.to, 'LLL dd, y')}
                        </span>
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[800px] p-0">
                    <DialogHeader className="px-4 pt-4">
                      <DialogTitle>Select Date Range</DialogTitle>
                    </DialogHeader>
                    <div className="p-4">
                      <div className="flex justify-between gap-4 mb-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-medium mb-2">
                            From Date
                          </label>
                          <Calendar
                            mode="single"
                            selected={filters.dateRange.from}
                            onSelect={(date: Date | undefined) =>
                              setFilters((prev) => ({
                                ...prev,
                                dateRange: { ...prev.dateRange, from: date },
                              }))
                            }
                            disabled={(date: Date) =>
                              filters.dateRange.to ? date > filters.dateRange.to : false
                            }
                            initialFocus
                            className="rounded-md border"
                            components={{
                              // Using "any" here to bypass the CaptionProps type conflict.
                              Caption: (props: any) => {
                                const { displayMonth, onMonthChange } = props;
                                return (
                                  <div className="flex justify-center gap-1 items-center py-2">
                                    <Select
                                      value={format(displayMonth, 'MMMM')}
                                      onValueChange={(value) => {
                                        const newMonth = new Date(displayMonth);
                                        newMonth.setMonth(
                                          [
                                            'January',
                                            'February',
                                            'March',
                                            'April',
                                            'May',
                                            'June',
                                            'July',
                                            'August',
                                            'September',
                                            'October',
                                            'November',
                                            'December',
                                          ].indexOf(value)
                                        );
                                        onMonthChange(newMonth);
                                      }}
                                    >
                                      <SelectTrigger className="w-[130px]">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {Array.from({ length: 12 }, (_, i) => {
                                          const month = new Date(0, i);
                                          return (
                                            <SelectItem
                                              key={i}
                                              value={format(month, 'MMMM')}
                                            >
                                              {format(month, 'MMMM')}
                                            </SelectItem>
                                          );
                                        })}
                                      </SelectContent>
                                    </Select>
                                    <Select
                                      value={format(displayMonth, 'yyyy')}
                                      onValueChange={(value) => {
                                        const newMonth = new Date(displayMonth);
                                        newMonth.setFullYear(parseInt(value));
                                        onMonthChange(newMonth);
                                      }}
                                    >
                                      <SelectTrigger className="w-[90px]">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {Array.from({ length: 10 }, (_, i) => {
                                          const year = new Date().getFullYear() - 5 + i;
                                          return (
                                            <SelectItem
                                              key={year}
                                              value={year.toString()}
                                            >
                                              {year}
                                            </SelectItem>
                                          );
                                        })}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                );
                              },
                            }}
                          />
                        </div>
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-medium mb-2">
                            To Date
                          </label>
                          <Calendar
                            mode="single"
                            selected={filters.dateRange.to}
                            onSelect={(date: Date | undefined) =>
                              setFilters((prev) => ({
                                ...prev,
                                dateRange: { ...prev.dateRange, to: date },
                              }))
                            }
                            disabled={(date: Date) =>
                              filters.dateRange.from ? date < filters.dateRange.from : false
                            }
                            initialFocus
                            className="rounded-md border"
                            components={{
                              // Also using "any" here to bypass the CaptionProps type conflict.
                              Caption: (props: any) => {
                                const { displayMonth, onMonthChange } = props;
                                return (
                                  <div className="flex justify-center gap-1 items-center py-2">
                                    <Select
                                      value={format(displayMonth, 'MMMM')}
                                      onValueChange={(value) => {
                                        const newMonth = new Date(displayMonth);
                                        newMonth.setMonth(
                                          [
                                            'January',
                                            'February',
                                            'March',
                                            'April',
                                            'May',
                                            'June',
                                            'July',
                                            'August',
                                            'September',
                                            'October',
                                            'November',
                                            'December',
                                          ].indexOf(value)
                                        );
                                        onMonthChange(newMonth);
                                      }}
                                    >
                                      <SelectTrigger className="w-[130px]">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {Array.from({ length: 12 }, (_, i) => {
                                          const month = new Date(0, i);
                                          return (
                                            <SelectItem
                                              key={i}
                                              value={format(month, 'MMMM')}
                                            >
                                              {format(month, 'MMMM')}
                                            </SelectItem>
                                          );
                                        })}
                                      </SelectContent>
                                    </Select>
                                    <Select
                                      value={format(displayMonth, 'yyyy')}
                                      onValueChange={(value) => {
                                        const newMonth = new Date(displayMonth);
                                        newMonth.setFullYear(parseInt(value));
                                        onMonthChange(newMonth);
                                      }}
                                    >
                                      <SelectTrigger className="w-[90px]">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {Array.from({ length: 10 }, (_, i) => {
                                          const year = new Date().getFullYear() - 5 + i;
                                          return (
                                            <SelectItem
                                              key={year}
                                              value={year.toString()}
                                            >
                                              {year}
                                            </SelectItem>
                                          );
                                        })}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                );
                              },
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                        {filters.dateRange.from && filters.dateRange.to && (
                          <span>
                            Selected Range: {format(filters.dateRange.from, 'PPP')} to{' '}
                            {format(filters.dateRange.to, 'PPP')}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={() =>
                              setFilters((prev) => ({
                                ...prev,
                                dateRange: { from: undefined, to: undefined },
                              }))
                            }
                          >
                            Clear
                          </Button>
                        </DialogTrigger>
                        <DialogTrigger asChild>
                          <Button
                            type="submit"
                            disabled={
                              !filters.dateRange.from || !filters.dateRange.to
                            }
                          >
                            Apply Range
                          </Button>
                        </DialogTrigger>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Reset Filters
                </Button>

                <div className="flex ml-auto gap-2">
                  <Select
                    value={downloadFormat}
                    onValueChange={setDownloadFormat}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="xlsx">XLSX</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={handleDownload}
                    disabled={loading || data.length === 0}
                    className="gap-2"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    Download
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>{renderColumns()}</TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : (
                      renderRows()
                    )}
                  </TableBody>
                </Table>
              </div>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
