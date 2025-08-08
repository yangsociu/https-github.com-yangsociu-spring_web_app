// Component hiển thị danh sách người dùng đang chờ phê duyệt cho admin, 
// cho phép xem chi tiết thông tin người dùng, phê duyệt hoặc từ chối tài khoản, cập nhật danh sách sau hành động, và hiển thị thông báo kết quả.

"use client";

import { useEffect, useState } from "react";
import { getPendingUsers, approveUser } from "@/lib/api";
import type { User } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from 'lucide-react';

export function UserApproval() {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const users = await getPendingUsers();
      setPendingUsers(users);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch pending users.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApproval = async (userId: number, status: "APPROVED" | "REJECTED") => {
    try {
      await approveUser(userId, status);
      toast({
        title: "Success",
        description: `User has been ${status.toLowerCase()}.`,
      });
      fetchUsers();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update user status.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 bg-gradient-to-b from-blue-50 to-white">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-white">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Pending User Approvals</h2>
      {pendingUsers.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{user.role}</Badge>
                </TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell className="space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-200 text-gray-800 hover:bg-blue-50 rounded-lg"
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white border-gray-200 rounded-lg shadow-lg">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-gray-800">User Details</DialogTitle>
                        <DialogDescription className="text-gray-600">
                          Review the user's information before making a decision.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <p className="text-gray-800"><strong>Email:</strong> {user.email}</p>
                        <p className="text-gray-800"><strong>Full Name:</strong> {user.fullName}</p>
                        <p className="text-gray-800"><strong>Role:</strong> {user.role}</p>
                        <p className="text-gray-800">
                          <strong>Portfolio:</strong>{" "}
                          <a href={user.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {user.portfolioUrl}
                          </a>
                        </p>
                        <p className="text-gray-800"><strong>Experience:</strong> {user.experienceYears} years</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    onClick={() => handleApproval(user.id, "APPROVED")}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
                    onClick={() => handleApproval(user.id, "REJECTED")}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-gray-600 text-center">No pending user approvals.</p>
      )}
    </div>
  );
}