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
import { Download, Loader2, ArrowUpDown, X, CalendarIcon } from 'lucide-react';
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

export default function DownloadData() {
  // State management
  const [activeTab, setActiveTab] = useState('drives');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadFormat, setDownloadFormat] = useState('csv');
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    dateRange: {
      from: undefined,
      to: undefined,
    },
    type: 'all',
    location: 'all',
    sortField: 'createdAt',
    sortOrder: 'desc' as 'asc' | 'desc'
  });

  // Status options for different tabs
  const statusOptions = {
    drives: ['pending', 'completed'],
    donations: ['Pending', 'Approved', 'Completed'],
    users: []
  };

  // Type options for different tabs
  const typeOptions = {
    drives: ['food', 'clothes', 'books', 'medicine'],
    donations: ['food', 'clothes', 'money', 'other'],
    users: []
  };

  // Build query string for API calls
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

  // Fetch data
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

  // Handle download
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

  // Reset filters
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

  // Handle sort
  const handleSort = (field: string) => {
    setFilters(prev => ({
      ...prev,
      sortField: field,
      sortOrder: prev.sortField === field && prev.sortOrder === 'desc' ? 'asc' : 'desc'
    }));
  };

  // Effect to fetch data when filters or tab changes
  useEffect(() => {
    fetchData();
  }, [activeTab, filters]);

  // Render table columns
  const renderColumns = () => {
    const commonColumns = (
      <TableRow>
        <TableHead className="w-[100px]">ID</TableHead>
        <TableHead className="cursor-pointer" onClick={() => handleSort('createdAt')}>
          Date
          <ArrowUpDown className="ml-2 h-4 w-4 inline" />
        </TableHead>
      </TableRow>
    );

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
            <TableHead className="cursor-pointer" onClick={() => handleSort('email')}>
              Email <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>Address</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('createdAt')}>
              Joined Date <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
          </TableRow>
        );

      case 'donations':
        return (
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort('fullname')}>
              Name <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('createdAt')}>
              Created At <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
          </TableRow>
        );

      default:
        return null;
    }
  };

  // Render table rows
  const renderRows = () => {
    if (!Array.isArray(data) || data.length === 0) {
      return (
        <TableRow>
          <TableCell
            colSpan={7}
            className="text-center py-10"
          >
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
              <TableCell>{item.createdAt || '-'}</TableCell>
            </TableRow>
          );

        case 'users':
          return (
            <TableRow key={item.id}>
              <TableCell>{item.fullname || '-'}</TableCell>
              <TableCell>{item.email || '-'}</TableCell>
              <TableCell>{item.mobile || '-'}</TableCell>
              <TableCell>{item.address || '-'}</TableCell>
              <TableCell>{item.createdAt || '-'}</TableCell>
            </TableRow>
          );

        case 'donations':
          return (
            <TableRow key={item.id}>
              <TableCell>{item.fullname || '-'}</TableCell>
              <TableCell>{item.email || '-'}</TableCell>
              <TableCell>{item.mobile || '-'}</TableCell>
              <TableCell>{item.type || '-'}</TableCell>
              <TableCell>{item.quantity || '-'}</TableCell>
              <TableCell>
                <Badge variant={item.status === 'Completed' ? 'success' : 'secondary'}>
                  {item.status || '-'}
                </Badge>
              </TableCell>
              <TableCell>{item.createdAt || '-'}</TableCell>
            </TableRow>
          );

        default:
          return null;
      }
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Download Data</CardTitle>
          <CardDescription>
            View and download data from different categories
          </CardDescription>
        </CardHeader>
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
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-64"
                />

                {statusOptions[activeTab as keyof typeof statusOptions].length > 0 && (
                  <Select
                    value={filters.status}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      {statusOptions[activeTab as keyof typeof statusOptions].map((status) => (
                        <SelectItem key={status} value={status.toLowerCase()}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {typeOptions[activeTab as keyof typeof typeOptions].length > 0 && (
                  <Select
                    value={filters.type}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {typeOptions[activeTab as keyof typeof typeOptions].map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {activeTab === 'drives' && (
                  <Select
                    value={filters.location}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}
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
                    <Button variant="outline" className="w-[260px] justify-start text-left font-normal">
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
                          <label className="text-sm font-medium mb-2">From Date</label>
                          <Calendar
                            mode="single"
                            selected={filters.dateRange.from}
                            onSelect={(date) =>
                              setFilters(prev => ({
                                ...prev,
                                dateRange: {
                                  ...prev.dateRange,
                                  from: date
                                },
                              }))
                            }
                            disabled={(date) =>
                              filters.dateRange.to ? date > filters.dateRange.to : false
                            }
                            initialFocus
                            className="rounded-md border"
                            components={{
                              Caption: ({ displayMonth, onMonthChange }) => {
                                return (
                                  <div className="flex justify-center gap-1 items-center py-2">
                                    <Select
                                      value={format(displayMonth, 'MMMM')}
                                      onValueChange={(value) => {
                                        const newMonth = new Date(displayMonth);
                                        newMonth.setMonth(
                                          ['January', 'February', 'March', 'April', 'May', 'June',
                                           'July', 'August', 'September', 'October', 'November', 'December']
                                          .indexOf(value)
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
                          <label className="text-sm font-medium mb-2">To Date</label>
                          <Calendar
                            mode="single"
                            selected={filters.dateRange.to}
                            onSelect={(date) =>
                              setFilters(prev => ({
                                ...prev,
                                dateRange: {
                                  ...prev.dateRange,
                                  to: date
                                },
                              }))
                            }
                            disabled={(date) =>
                              filters.dateRange.from ? date < filters.dateRange.from : false
                            }
                            initialFocus
                            className="rounded-md border"
                            components={{
                              Caption: ({ displayMonth, onMonthChange }) => {
                                return (
                                  <div className="flex justify-center gap-1 items-center py-2">
                                    <Select
                                      value={format(displayMonth, 'MMMM')}
                                      onValueChange={(value) => {
                                        const newMonth = new Date(displayMonth);
                                        newMonth.setMonth(
                                          ['January', 'February', 'March', 'April', 'May', 'June',
                                           'July', 'August', 'September', 'October', 'November', 'December']
                                          .indexOf(value)
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
                            onClick={() => {
                              setFilters(prev => ({
                                ...prev,
                                dateRange: {
                                  from: undefined,
                                  to: undefined,
                                },
                              }));
                            }}
                          >
                            Clear
                          </Button>
                        </DialogTrigger>
                        <DialogTrigger asChild>
                          <Button 
                            type="submit" 
                            disabled={!filters.dateRange.from || !filters.dateRange.to}
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
                  <TableHeader>
                    {renderColumns()}
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="h-24 text-center"
                        >
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