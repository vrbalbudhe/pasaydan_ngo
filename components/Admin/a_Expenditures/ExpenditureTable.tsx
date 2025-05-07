// components/Admin/a_Expenditures/ExpenditureTable.tsx
"use client";

import { useState, useEffect } from "react";
import { useExpenditures } from "@/contexts/ExpenditureContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Loader2, 
  Calendar, 
  Search,
  FilterX,
  Download
} from "lucide-react";
import ExpenditureForm from "./ExpenditureForm";

export default function ExpenditureTable() {
  const { 
    expenditures, 
    loading, 
    error, 
    fetchExpenditures, 
    deleteExpenditure 
  } = useExpenditures();
  const { toast } = useToast();
  
  // State for filtering
  const [filters, setFilters] = useState({
    category: "all",
    startDate: "",
    endDate: "",
    search: "",
  });
  
  // State for dialogs
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Filter change handlers
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Apply filters
  const applyFilters = () => {
    const filterParams: Record<string, string> = {};
    
    if (filters.category && filters.category !== "all") filterParams.category = filters.category;
    if (filters.startDate) filterParams.startDate = filters.startDate;
    if (filters.endDate) filterParams.endDate = filters.endDate;
    
    fetchExpenditures(filterParams);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      category: "all",
      startDate: "",
      endDate: "",
      search: "",
    });
    fetchExpenditures();
  };

  // Handle editing
  const handleEdit = (id: string) => {
    setEditingId(id);
    setIsEditDialogOpen(true);
  };

  // Handle deletion
  const handleDelete = async () => {
    if (!isDeletingId) return;
    
    try {
      const success = await deleteExpenditure(isDeletingId);
      
      if (success) {
        toast({
          title: "Success",
          description: "Expenditure deleted successfully",
        });
      } else {
        throw new Error("Failed to delete expenditure");
      }
    } catch (error) {
      console.error("Error deleting expenditure:", error);
      toast({
        title: "Error",
        description: "Failed to delete expenditure",
        variant: "destructive",
      });
    } finally {
      setIsDeletingId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  // Export to CSV
  const exportToCSV = async () => {
    setIsExporting(true);
    
    try {
      // Get filtered data
      const dataToExport = expenditures.map(item => ({
        'Amount': item.amount,
        'Date': format(new Date(item.date), 'yyyy-MM-dd'),
        'Category': item.category === 'OTHER' ? item.customCategory : item.category.toLowerCase(),
        'Description': item.description || '',
        'Member': item.User?.fullname || 'N/A',
        'Created At': format(new Date(item.createdAt), 'yyyy-MM-dd')
      }));
      
      // Convert to CSV
      const headers = Object.keys(dataToExport[0]).join(',');
      const rows = dataToExport.map(row => 
        Object.values(row).map(value => 
          typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value
        ).join(',')
      );
      const csv = [headers, ...rows].join('\n');
      
      // Create download link
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `expenditures_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success",
        description: "Expenditure data exported successfully",
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Error",
        description: "Failed to export expenditure data",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Filter data by search term
  const filteredExpenditures = expenditures.filter(item => {
    if (!filters.search) return true;
    
    const searchTerm = filters.search.toLowerCase();
    const category = item.category === 'OTHER' 
      ? (item.customCategory || '').toLowerCase() 
      : item.category.toLowerCase();
    const description = (item.description || '').toLowerCase();
    const memberName = (item.User?.fullname || '').toLowerCase();
    const memberEmail = (item.User?.email || '').toLowerCase();
    
    return (
      category.includes(searchTerm) ||
      description.includes(searchTerm) ||
      memberName.includes(searchTerm) ||
      memberEmail.includes(searchTerm) ||
      item.amount.toString().includes(searchTerm)
    );
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchExpenditures();
  }, [fetchExpenditures]);

  if (error) {
    return (
      <Card className="bg-red-50">
        <CardContent className="p-6">
          <p className="text-red-500">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => fetchExpenditures()}
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-md font-medium mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Category</label>
            <Select
              value={filters.category}
              onValueChange={(value) => handleFilterChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="CYCLE">Cycle</SelectItem>
                <SelectItem value="ASHRAM">Ashram</SelectItem>
                <SelectItem value="STUDENT">Student</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Start Date</label>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">End Date</label>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
            />
          </div>

          <div className="flex items-end space-x-2">
            <Button onClick={applyFilters} className="flex-grow">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={resetFilters}>
              <FilterX className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Search & Export Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search expenditures..."
            className="pl-8"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        <Button 
          variant="outline" 
          className="w-full sm:w-auto"
          onClick={exportToCSV}
          disabled={isExporting || loading}
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Export to CSV
        </Button>
      </div>

      {/* Expenditure Table */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredExpenditures.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No expenditure records found</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead className="hidden md:table-cell">Member</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenditures.map((expenditure) => (
                <TableRow key={expenditure.id}>
                  <TableCell className="font-medium">
                    ₹{expenditure.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {format(new Date(expenditure.date), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell>
                    {expenditure.category === "OTHER"
                      ? expenditure.customCategory
                      : expenditure.category.charAt(0) + expenditure.category.slice(1).toLowerCase()}
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-[300px] truncate">
                    {expenditure.description || "-"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {expenditure.User?.fullname || expenditure.User?.email || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEdit(expenditure.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setIsDeletingId(expenditure.id);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Dialog */}
<Dialog 
  open={isEditDialogOpen} 
  onOpenChange={(open) => {
    setIsEditDialogOpen(open);
    if (!open) {
      // Reset editing ID when dialog closes
      setEditingId(null);
    }
  }}
>
  <DialogContent className="sm:max-w-[600px]">
    <DialogHeader>
      <DialogTitle>Edit Expenditure</DialogTitle>
      <DialogDescription>
        Update the expenditure details below.
      </DialogDescription>
    </DialogHeader>
    {editingId && (
      <ExpenditureForm
        expenditureId={editingId}
        onSuccess={() => {
          setIsEditDialogOpen(false);
          setEditingId(null);
          fetchExpenditures();
        }}
      />
    )}
  </DialogContent>
</Dialog>
      

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              expenditure record from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeletingId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}