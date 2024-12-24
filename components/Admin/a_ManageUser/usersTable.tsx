"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { RiDeleteBin7Line } from "react-icons/ri";

interface Invoice {
  name: string;
  email: string;
  mobile: string;
  address: string;
}

export default function UsersTable() {
  const [userData, setUserData] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await fetch("/api/user");
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.log("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllUsers();
  }, []);

  const handleDelete = (name: string) => {
    alert(`Deleted user: ${name}`);
  };

  return (
    <>
      {loading ? (
        <div className="w-full h-[400px] flex justify-center items-center">
          Fetching Users{" "}
          <span className="text-red-400 font-semibold">_ Stay Calm.. </span>
        </div>
      ) : (
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Index</TableHead>
              <TableHead className="w-[250px]">Name</TableHead>
              <TableHead className="w-[250px]">Email</TableHead>
              <TableHead className="w-[200px]">Mobile</TableHead>
              <TableHead className="w-[400px]">Address</TableHead>
              <TableHead className="w-[200px]">Type</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userData.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell>{user.mobile}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>User</TableCell>
                <TableCell>
                  <button
                    onClick={() => handleDelete(user.name)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <RiDeleteBin7Line size={24} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
