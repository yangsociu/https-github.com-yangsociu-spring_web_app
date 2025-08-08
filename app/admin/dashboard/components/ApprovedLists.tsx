// Component hiển thị danh sách người dùng và trò chơi cho admin, 
// với giao diện tab để chuyển đổi giữa hai danh sách, 
// lấy dữ liệu từ API và hiển thị trạng thái bằng badge.

"use client";

import { useEffect, useState } from "react";
import { getAdminAllUsers, getAdminAllGames } from "@/lib/api";
import type { User, Game } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2 } from 'lucide-react';

const getStatusVariant = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "default";
    case "PENDING":
      return "secondary";
    case "REJECTED":
      return "destructive";
    default:
      return "outline";
  }
};

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminAllUsers()
      .then(setUsers)
      .catch(() => console.error("Failed to fetch users"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 bg-gradient-to-b from-blue-50 to-white">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Full Name</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>{user.fullName || "N/A"}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(user.status)}>{user.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function GameList() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminAllGames()
      .then(setGames)
      .catch(() => console.error("Failed to fetch games"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 bg-gradient-to-b from-blue-50 to-white">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Game Name</TableHead>
          <TableHead>Developer ID</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {games.map((game) => (
          <TableRow key={game.id}>
            <TableCell>{game.name}</TableCell>
            <TableCell>{game.developerId}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(game.status)}>{game.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function ApprovedLists() {
  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-white">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Admin Directory</h2>
      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="users">All Users</TabsTrigger>
          <TabsTrigger value="games">All Games</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <h3 className="text-2xl font-semibold text-gray-800 text-center mb-4">User Directory</h3>
          <UserList />
        </TabsContent>
        <TabsContent value="games">
          <h3 className="text-2xl font-semibold text-gray-800 text-center mb-4">Game Directory</h3>
          <GameList />
        </TabsContent>
      </Tabs>
    </div>
  );
}